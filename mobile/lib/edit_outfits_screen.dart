import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class EditOutfitScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;
  final Map<String, dynamic> outfit;

  const EditOutfitScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
    required this.outfit,
  }) : super(key: key);

  @override
  _EditOutfitScreenState createState() => _EditOutfitScreenState();
}

class _EditOutfitScreenState extends State<EditOutfitScreen> {
  late TextEditingController _nameController;
  late TextEditingController _topController;
  late TextEditingController _bottomController;
  late TextEditingController _shoesController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.outfit['Name'] ?? '');
    _topController = TextEditingController(text: widget.outfit['Top'] ?? '');
    _bottomController = TextEditingController(text: widget.outfit['Bottom'] ?? '');
    _shoesController = TextEditingController(text: widget.outfit['Shoes'] ?? '');
  }

  Future<void> _saveChanges() async {
    // Implement your updateOutfit API call
    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/updateOutfit'),
      headers: {
        'Authorization': 'Bearer ${widget.jwtToken}',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        '_id': widget.outfit['_id'],
        'userId': widget.userId,
        'name': _nameController.text,
        'top': _topController.text,
        'bottom': _bottomController.text,
        'shoes': _shoesController.text,
      }),
    );
    if (response.statusCode == 200) {
      final updatedOutfit = jsonDecode(response.body)['updatedOutfit'];
      // Pop and return the updated outfit to the previous screen
      Navigator.pop(context, updatedOutfit);
    } else {
      // handle error
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Outfit'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Outfit Name')),
            TextField(controller: _topController, decoration: const InputDecoration(labelText: 'Top')),
            TextField(controller: _bottomController, decoration: const InputDecoration(labelText: 'Bottom')),
            TextField(controller: _shoesController, decoration: const InputDecoration(labelText: 'Shoes')),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _saveChanges,
              child: const Text('Save Changes'),
            ),
          ],
        ),
      ),
    );
  }
}
