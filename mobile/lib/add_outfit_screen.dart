import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'select_clothing_item_screen.dart'; // Ensure this file exists

class AddOutfitScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;

  const AddOutfitScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  _AddOutfitScreenState createState() => _AddOutfitScreenState();
}

class _AddOutfitScreenState extends State<AddOutfitScreen> {
  final TextEditingController _nameController = TextEditingController();
  Map<String, dynamic>? _selectedTop;
  Map<String, dynamic>? _selectedBottom;
  Map<String, dynamic>? _selectedShoes;
  bool _isLoading = false;

  // Use the same color palette as your other screens:
  static const themeGreen = Color(0xFFB6C7AA);
  static const themeGray = Color(0xFFA0937D);
  static const themeDarkBeige = Color(0xFFE7D4B5);
  static const themeLightBeige = Color(0xFFF6E6CB);

  Future<void> _addOutfit() async {
    setState(() {
      _isLoading = true;
    });
    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/addOutfit'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${widget.jwtToken}',
      },
      body: jsonEncode({
        'userId': widget.userId,
        'name': _nameController.text,
        'top': _selectedTop?['_id'] ?? '',
        'bottom': _selectedBottom?['_id'] ?? '',
        'shoes': _selectedShoes?['_id'] ?? '',
        // You can include 'weatherCategory' if needed
      }),
    );
    setState(() {
      _isLoading = false;
    });
    if (response.statusCode == 200) {
      final newOutfit = jsonDecode(response.body);
      Navigator.pop(context, newOutfit);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to add outfit')),
      );
    }
  }

  // Helper widget to build a selection button
  Widget _buildSelectButton(String label, Map<String, dynamic>? selectedItem, List<String> allowedCategories) {
    return ElevatedButton(
      onPressed: () async {
        final selected = await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SelectClothingItemScreen(
              jwtToken: widget.jwtToken,
              userId: widget.userId,
              allowedCategories: allowedCategories,
            ),
          ),
        );
        if (selected != null) {
          setState(() {
            if (allowedCategories.contains('shirts') || allowedCategories.contains('longsleeves')) {
              _selectedTop = selected;
            } else if (allowedCategories.contains('pants') || allowedCategories.contains('shorts')) {
              _selectedBottom = selected;
            } else if (allowedCategories.contains('shoes')) {
              _selectedShoes = selected;
            }
          });
        }
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: themeGreen,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
      child: Text(
        selectedItem == null ? 'Select $label' : 'Selected: ${selectedItem['Name']}',
        style: TextStyle(color: themeGray),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: themeLightBeige,
      appBar: AppBar(
        title: const Text('Add Outfit'),
        backgroundColor: themeDarkBeige,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Outfit name input
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Outfit Name',
                labelStyle: TextStyle(color: themeGray),
                enabledBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: themeGreen),
                ),
                focusedBorder: UnderlineInputBorder(
                  borderSide: BorderSide(color: themeGreen),
                ),
              ),
              style: TextStyle(color: themeGray),
            ),
            const SizedBox(height: 10),
            // Selection buttons for Top, Bottom, and Shoes:
            _buildSelectButton('Top', _selectedTop, ['shirts', 'longsleeves']),
            const SizedBox(height: 10),
            _buildSelectButton('Bottom', _selectedBottom, ['pants', 'shorts']),
            const SizedBox(height: 10),
            _buildSelectButton('Shoe', _selectedShoes, ['shoes']),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isLoading ? null : _addOutfit,
              style: ElevatedButton.styleFrom(
                backgroundColor: themeGreen,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Add Outfit'),
            ),
          ],
        ),
      ),
    );
  }
}
