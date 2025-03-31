import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'clothing_item_screen.dart' as AddClothingItemScreen;

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
  List<Map<String, dynamic>> _clothingItems = [];
  String _message = '';

  @override
  void initState() {
    super.initState();
    _currentJwtToken = widget.jwtToken;
    _fetchClothingItems(); // Fetch clothing items on screen load
  }

  // Fetch clothing items from the API
  Future<void> _fetchClothingItems() async {
    try {
      final response = await http.get(
        Uri.parse('http://dressmeupproject.com:5001/api/getClothingItems?userId=${widget.userId}'),
        headers: {
          'Authorization': 'Bearer $_currentJwtToken',
        },
      );

      print("Status code: ${response.statusCode}");
      print("Response body: ${response.body}");

      if (response.statusCode == 200) {
        final List<dynamic> items = jsonDecode(response.body)['results'];
        setState(() {
          _clothingItems = List<Map<String, dynamic>>.from(items);
        });
      } else {
        setState(() {
          _message = 'Failed to load clothing items';
        });
      }
    } catch (e) {
      setState(() {
        _message = 'Error: $e';
      });
    }
  }

  // Handle logout
  void _logout() {
    Navigator.pushReplacementNamed(context, '/login');
  }

  // Handle adding a new clothing item via the camera
  Future<void> _takePictureAndAddItem() async {
    final image = await ImagePicker().pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.rear,
      imageQuality: 85,
    );

    if (image != null) {
      final newItem = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AddClothingItemScreen.AddClothingItemScreen(
            imageFile: File(image.path),
            jwtToken: _currentJwtToken,
            userId: widget.userId,
          ),
        ),
      );

      if (newItem != null) {
        setState(() {
          _clothingItems.add(newItem); // Add the new item to the list
        });
      }
    }
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
        title: const Text('My Closet'),
        backgroundColor: themeDarkBeige,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
            tooltip: 'Logout',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton.icon(
              onPressed: _takePictureAndAddItem,
              icon: const Icon(Icons.camera_alt),
              label: const Text('Add Clothing Item'),
              style: ElevatedButton.styleFrom(
                backgroundColor: themeGreen,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
            ),
            const SizedBox(height: 20),
            if (_message.isNotEmpty)
              Text(
                _message,
                style: const TextStyle(color: Colors.red),
              ),
            const SizedBox(height: 20),
            Expanded(
              child: _clothingItems.isEmpty
                  ? const Center(child: Text('No clothing items yet.'))
                  : ListView.builder(
                      itemCount: _clothingItems.length,
                      itemBuilder: (context, index) {
                        final item = _clothingItems[index];
                        print("Item file type: ${item['file'].runtimeType}");
                        return Card(
                          color: themeLightBeige,
                          elevation: 4,
                          margin: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                if (item['file'] != null)
                                  // Directly decode and display the image
                                  Image.memory(
                                    base64Decode(item['file']),
                                    height: 200,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                  ),
                                const SizedBox(height: 10),
                                Text(
                                  item['Name'] ?? 'Unnamed',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: themeGray,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  item['Category'] ?? 'Category Not Available',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: themeGray,
                                  ),
                                ),
                              ],
                            ),
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
