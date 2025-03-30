import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import 'clothing_item_screen.dart'; // Import your new screen

class CardsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;

  const CardsScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  State<CardsScreen> createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  final TextEditingController _addCardController = TextEditingController();
  final TextEditingController _searchCardController = TextEditingController();
  late String _currentJwtToken;
  List<String> _cards = [];
  String _message = '';

  @override
  void initState() {
    super.initState();
    _currentJwtToken = widget.jwtToken;
  }

  /// Uses ImagePicker to take a picture and then navigates to the add‑clothing‑item form.
  Future<void> _takePictureAndAddItem() async {
    final image = await ImagePicker().pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.rear,
      imageQuality: 85,
    );
    if (image != null) {
      // Navigate to the form screen and await the result (new item)
      final newItem = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AddClothingItemScreen(
            imageFile: File(image.path),
            jwtToken: _currentJwtToken,
            userId: widget.userId,
          ),
        ),
      );
      // If a new item was returned, update the list of items
      if (newItem != null) {
        setState(() {
          _cards.add(newItem['Name']); // Adjust according to your item structure
          // Optionally update _currentJwtToken if your API returns a refreshed token.
        });
      }
    }
  }

  Future<void> _addCard() async {
    final cardText = _addCardController.text;
    if (cardText.isEmpty) {
      setState(() => _message = 'Card text is required');
      return;
    }

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://dressmeupproject.com:5001/api/addcard'),
    );

    request.headers['Authorization'] = 'Bearer $_currentJwtToken';
    request.headers['Content-Type'] = 'multipart/form-data';

    request.fields.addAll({
      'card': cardText,
      'userId': widget.userId,
    });

    try {
      var response = await request.send();
      var body = await response.stream.bytesToString();
      final data = jsonDecode(body);

      if (response.statusCode == 200) {
        setState(() {
          _message = 'Card added successfully';
          _addCardController.clear();
          if (data['jwtToken'] != null) {
            _currentJwtToken = data['jwtToken'];
          }
        });
      } else {
        setState(() => _message = 'Error: ${data['error'] ?? 'Unknown error'}');
      }
    } catch (e) {
      setState(() => _message = 'Connection error: $e');
    }
  }

  Future<void> _searchCards() async {
    final searchQuery = _searchCardController.text.trim();
    if (searchQuery.isEmpty) return;

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/searchcards'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_currentJwtToken'
        },
        body: jsonEncode({
          'userId': widget.userId,
          'search': searchQuery,
          'jwtToken': _currentJwtToken,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        setState(() {
          _cards = List<String>.from(data['results'] ?? []);
          _message = 'Found ${_cards.length} cards';
          _currentJwtToken = data['jwtToken'] ?? _currentJwtToken;
        });
      } else {
        setState(() => _message = 'Error: ${data['error']}');
      }
    } catch (e) {
      setState(() => _message = 'Search failed: ${e.toString()}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cards')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Section
            TextField(
              controller: _searchCardController,
              decoration: const InputDecoration(labelText: 'Search Cards'),
            ),
            ElevatedButton(
              onPressed: _searchCards,
              child: const Text('Search'),
            ),
            const SizedBox(height: 20),
            // Button to launch the camera and then the add item form
            ElevatedButton.icon(
              onPressed: _takePictureAndAddItem,
              icon: const Icon(Icons.camera_alt),
              label: const Text('Add Clothing Item'),
            ),
            const SizedBox(height: 20),
            // Manual card addition section (if needed)
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _addCardController,
                    decoration: const InputDecoration(labelText: 'Card Text'),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: _addCard,
                ),
              ],
            ),
            ElevatedButton(
              onPressed: _addCard,
              child: const Text('Add Card with Image'),
            ),
            const SizedBox(height: 20),
            Text(_message),
            const SizedBox(height: 20),
            const Text('Your Cards:'),
            Expanded(
              child: ListView.builder(
                itemCount: _cards.length,
                itemBuilder: (context, index) => ListTile(
                  title: Text(_cards[index]),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _addCardController.dispose();
    _searchCardController.dispose();
    super.dispose();
  }
}
