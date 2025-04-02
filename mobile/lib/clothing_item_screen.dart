import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

class AddClothingItemScreen extends StatefulWidget {
  final File imageFile;
  final String jwtToken;
  final String userId;

  const AddClothingItemScreen({
    super.key,
    required this.imageFile,
    required this.jwtToken,
    required this.userId,
  });

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

  setState(() => _message = '');

  try {
    // Compress the image
    final dir = await getTemporaryDirectory();
    final targetPath = path.join(dir.path, '${DateTime.now().millisecondsSinceEpoch}.jpg');

    final compressedFile = await FlutterImageCompress.compressAndGetFile(
      widget.imageFile.absolute.path,
      targetPath,
      quality: 70, // You can tune this between 0-100
    );

    if (compressedFile == null) {
      setState(() => _message = 'Image compression failed.');
      return;
    }

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://dressmeupproject.com:5001/api/addClothingItem'),
    );

    request.fields['userId'] = widget.userId;
    request.fields['name'] = name;
    request.fields['color'] = color;
    request.fields['category'] = category;
    request.fields['size'] = size;
    request.fields['jwtToken'] = widget.jwtToken;

    request.files.add(
      await http.MultipartFile.fromPath(
        'image',
        compressedFile.path,
        contentType: MediaType('image', 'jpeg'),
      ),
    );

    var response = await request.send();
    var body = await response.stream.bytesToString();
    final data = jsonDecode(body);

    if (response.statusCode == 201) {
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
    // Define your website's color palette
    const themeGreen = Color(0xFFB6C7AA);
    const themeGray = Color(0xFFA0937D);
    const themeDarkBeige = Color(0xFFE7D4B5);
    const themeLightBeige = Color(0xFFF6E6CB);

    return Scaffold(
      backgroundColor: themeLightBeige,
      appBar: AppBar(
        title: const Text('Add Clothing Item'),
        backgroundColor: themeDarkBeige,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Display the image without caption overlay
            Image.file(
              widget.imageFile,
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
            const SizedBox(height: 20),
            // Name TextField
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Name (Ex: Graphic T-Shirt)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: themeGray),
                ),
              ),
            ),
            const SizedBox(height: 10),
            // Color TextField
            TextField(
              controller: _colorController,
              decoration: InputDecoration(
                labelText: 'Color (Ex: Pink, Yellow)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: themeGray),
                ),
              ),
            ),
            const SizedBox(height: 10),
            // Category TextField
            TextField(
              controller: _categoryController,
              decoration: InputDecoration(
                labelText: 'Category (Ex: Shirts, Pants, Longsleeves)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: themeGray),
                ),
              ),
            ),
            const SizedBox(height: 10),
            // Size TextField
            TextField(
              controller: _sizeController,
              decoration: InputDecoration(
                labelText: 'Size (Ex: S for Small, M for Medium)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: themeGray),
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Submit button
            ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: themeGreen,
              ),
              child: const Text('Submit'),
            ),
            if (_message.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(
                  _message,
                  style: const TextStyle(color: Colors.red),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
