import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AddClothingItemScreen extends StatefulWidget {
  final File imageFile;
  final String jwtToken;
  final String userId;

  const AddClothingItemScreen({
    Key? key,
    required this.imageFile,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  _AddClothingItemScreenState createState() => _AddClothingItemScreenState();
}

class _AddClothingItemScreenState extends State<AddClothingItemScreen> {
  final _nameController = TextEditingController();
  final _colorController = TextEditingController();
  final _categoryController = TextEditingController();
  final _sizeController = TextEditingController();
  String _message = '';

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final color = _colorController.text.trim();
    final category = _categoryController.text.trim();
    final size = _sizeController.text.trim();

    if (name.isEmpty || color.isEmpty || category.isEmpty || size.isEmpty) {
      setState(() => _message = 'Please fill out all fields.');
      return;
    }

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://dressmeupproject.com:5001/api/addClothingItem'),
    );

    // Add form fields
    request.fields['userId'] = widget.userId;
    request.fields['name'] = name;
    request.fields['color'] = color;
    request.fields['category'] = category;
    request.fields['size'] = size;
    request.fields['jwtToken'] = widget.jwtToken;

    // Add image file
    request.files.add(await http.MultipartFile.fromPath('image', widget.imageFile.path));

// ignore: avoid_print
print("Fields: ${request.fields}");
// ignore: avoid_print
print("Number of files: ${request.files.length}");

    try {
      var response = await request.send();
      var body = await response.stream.bytesToString();
      final data = jsonDecode(body);

      if (response.statusCode == 201) {
        // On success, pop this screen and return the new item
        Navigator.pop(context, data['newItem']);
      } else {
        setState(() => _message = data['error'] ?? 'Unknown error');
      }
    } catch (e) {
      setState(() => _message = 'Error: $e');
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _colorController.dispose();
    _categoryController.dispose();
    _sizeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Clothing Item')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Image.file(widget.imageFile, height: 200),
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: _colorController,
              decoration: const InputDecoration(labelText: 'Color'),
            ),
            TextField(
              controller: _categoryController,
              decoration: const InputDecoration(labelText: 'Category'),
            ),
            TextField(
              controller: _sizeController,
              decoration: const InputDecoration(labelText: 'Size'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _submit,
              child: const Text('Submit'),
            ),
            if (_message.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(_message, style: const TextStyle(color: Colors.red)),
              ),
          ],
        ),
      ),
    );
  }
}
