import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import 'clothing_item_screen.dart'; // Assuming this is your AddClothingItemScreen

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
  late String _currentJwtToken;
  // Replace the card list with a clothing items list.
  List<Map<String, dynamic>> _clothingItems = [];
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
      // Navigate to the add clothing item form and await the result (new item)
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
      // If a new item was returned, update the list.
      if (newItem != null) {
        setState(() {
          _clothingItems.add(newItem);
          // Optionally update _currentJwtToken if your API returns a refreshed token.
        });

        
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Set the background to the light beige from your website.
      backgroundColor: const Color(0xFFF6E6CB), // themeLightBeige
      appBar: AppBar(
        title: const Text('My Closet'),
        backgroundColor: const Color(0xFFE7D4B5), // themeDarkBeige
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Button to launch the camera and then the add clothing item form.
            ElevatedButton.icon(
  onPressed: _takePictureAndAddItem,
  icon: const Icon(Icons.camera_alt),
  label: const Text('Add Clothing Item'),
  style: ElevatedButton.styleFrom(
    backgroundColor: const Color(0xFFB6C7AA), // themeGreen
  ),
),

            const SizedBox(height: 20),
            if (_message.isNotEmpty)
              Text(
                _message,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 20),
            // Display the list of clothing items.
            Expanded(
              child: _clothingItems.isEmpty
                  ? const Center(child: Text('No clothing items yet.'))
                  : ListView.builder(
                      itemCount: _clothingItems.length,
                      itemBuilder: (context, index) {
                        final item = _clothingItems[index];

                        if (item['file'] != null) {
  final decodedBytes = base64Decode(item['file']);
  return Image.memory(decodedBytes, fit: BoxFit.cover);
}
                        return Card(
                          color: const Color(0xFFF6E6CB), // themeLightBeige
                          margin: const EdgeInsets.symmetric(
                              vertical: 8, horizontal: 8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              // Display the image. This assumes that item['file'] contains
                              // a base64-encoded string of the image.
                              if (item['file'] != null)
                                Image.memory(
                                  base64Decode(item['file']),
                                  height: 200,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                ),
                              const SizedBox(height: 8),
                              // Display the clothing item's name as a caption.
                              Text(
                                item['Name'] ?? 'Unnamed',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
