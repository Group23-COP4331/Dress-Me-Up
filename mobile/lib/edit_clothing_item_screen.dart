import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';

class EditClothingItemScreen extends StatefulWidget {
  final Map<String, dynamic> clothingItem;
  final String jwtToken;
  final String userId;

  const EditClothingItemScreen({
    super.key,
    required this.clothingItem,
    required this.jwtToken,
    required this.userId,
  });

  @override
  _EditClothingItemScreenState createState() => _EditClothingItemScreenState();
}

class _EditClothingItemScreenState extends State<EditClothingItemScreen> {
  late TextEditingController _nameController;
  late TextEditingController _colorController;
  late TextEditingController _categoryController;
  late TextEditingController _sizeController;
  File? _selectedImage;
  String _message = '';
  bool _isLoading = false;

  static const themeGreen = Color(0xFFB6C7AA);
  static const themeGray = Color(0xFFA0937D);
  static const themeDarkBeige = Color(0xFFE7D4B5);
  static const themeLightBeige = Color(0xFFF6E6CB);

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.clothingItem['Name'] ?? '');
    _colorController = TextEditingController(text: widget.clothingItem['Color'] ?? '');
    _categoryController = TextEditingController(text: widget.clothingItem['Category'] ?? '');
    _sizeController = TextEditingController(text: widget.clothingItem['Size'] ?? '');
  }

  Future<void> _pickImage() async {
    final image = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (image != null) {
      setState(() {
        _selectedImage = File(image.path);
      });
    }
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final color = _colorController.text.trim();
    final category = _categoryController.text.trim();
    final size = _sizeController.text.trim();

    if (name.isEmpty || color.isEmpty || category.isEmpty || size.isEmpty) {
      setState(() => _message = 'Please fill out all fields.');
      return;
    }

    setState(() => _isLoading = true);

    var uri = Uri.parse('http://dressmeupproject.com:5001/api/updateClothingItem');
    var request = http.MultipartRequest('POST', uri);
    request.fields['_id'] = widget.clothingItem['_id'];
    request.fields['userId'] = widget.userId;
    request.fields['name'] = name;
    request.fields['color'] = color;
    request.fields['category'] = category;
    request.fields['size'] = size;
    request.fields['jwtToken'] = widget.jwtToken;

    if (_selectedImage != null) {
      request.files.add(
        await http.MultipartFile.fromPath(
          'image',
          _selectedImage!.path,
          contentType: MediaType('image', 'jpeg'),
        ),
      );
    }

    try {
      var response = await request.send();
      var body = await response.stream.bytesToString();
      final data = jsonDecode(body);
      setState(() => _isLoading = false);
      if (response.statusCode == 200) {
        Navigator.pop(context, data['item']);
      } else {
        setState(() => _message = data['error'] ?? 'Unknown error');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _message = 'Error: $e';
      });
    }
  }

  Future<void> _deleteClothingItem() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Deletion'),
        content: const Text('Are you sure you want to delete this item?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.of(context).pop(true), child: const Text('Delete')),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() => _isLoading = true);

    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/deleteClothingItem'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'_id': widget.clothingItem['_id'], 'jwtToken': widget.jwtToken}),
    );

    setState(() => _isLoading = false);

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      if (body['error'] == '') {
        Navigator.pop(context, 'deleted');
      } else {
        setState(() => _message = body['error']);
      }
    } else {
      final body = jsonDecode(response.body);
      setState(() => _message = body['error'] ?? 'Failed to delete item.');
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
      backgroundColor: themeLightBeige,
      appBar: AppBar(
        title: const Text('Edit Clothing Item'),
        backgroundColor: themeDarkBeige,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (widget.clothingItem['file'] != null)
              Image.memory(
                base64Decode(widget.clothingItem['file']),
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            if (_selectedImage != null)
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Image.file(
                  _selectedImage!,
                  height: 200,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: _pickImage,
              icon: const Icon(Icons.image),
              label: const Text('Change Image'),
              style: ElevatedButton.styleFrom(
                backgroundColor: themeGreen,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Name (Ex: Graphic T-Shirt)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: themeGray)),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _colorController,
              decoration: InputDecoration(
                labelText: 'Color (Ex: Pink, Yellow)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: themeGray)),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _categoryController,
              decoration: InputDecoration(
                labelText: 'Category (Ex: Shirts, Pants, Longsleeves)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: themeGray)),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _sizeController,
              decoration: InputDecoration(
                labelText: 'Size (Ex: S for Small, M for Medium)',
                border: const OutlineInputBorder(),
                focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: themeGray)),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isLoading ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: themeGreen,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Save Changes'),
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: _isLoading ? null : _deleteClothingItem,
              child: const Text(
                'Delete Item',
                style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
              ),
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
