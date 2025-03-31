import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'select_clothing_item_screen.dart';

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
  String? _selectedWeather = 'Normal';

  static const weatherOptions = ['Cold', 'Normal', 'Rainy', 'Sunny', 'Cloudy'];

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
        'weatherCategory': _selectedWeather,
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

  Widget _clothingItemButton({
    required String label,
    required Map<String, dynamic>? selectedItem,
    required List<String> allowedCategories,
    required void Function(Map<String, dynamic>) onItemSelected,
  }) {
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
            onItemSelected(selected);
          });
        }
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: themeGreen,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (selectedItem != null && selectedItem['file'] != null)
            Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: Image.memory(
                base64Decode(selectedItem['file']),
                width: 30,
                height: 30,
                fit: BoxFit.cover,
              ),
            ),
          Text(
            selectedItem == null
                ? 'Select $label'
                : 'Selected: ${selectedItem['Name']}',
            style: const TextStyle(color: themeGray),
          ),
        ],
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
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Outfit Name',
                labelStyle: const TextStyle(color: themeGray),
                enabledBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: themeGreen),
                ),
                focusedBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(color: themeGreen),
                ),
              ),
              style: const TextStyle(color: themeGray),
            ),
            const SizedBox(height: 10),

            _clothingItemButton(
              label: 'Top',
              selectedItem: _selectedTop,
              allowedCategories: ['shirts', 'longsleeves'],
              onItemSelected: (item) => _selectedTop = item,
            ),
            const SizedBox(height: 10),

            _clothingItemButton(
              label: 'Bottom',
              selectedItem: _selectedBottom,
              allowedCategories: ['pants', 'shorts'],
              onItemSelected: (item) => _selectedBottom = item,
            ),
            const SizedBox(height: 10),

            _clothingItemButton(
              label: 'Shoe',
              selectedItem: _selectedShoes,
              allowedCategories: ['shoes'],
              onItemSelected: (item) => _selectedShoes = item,
            ),
            const SizedBox(height: 20),

            DropdownButtonFormField<String>(
              value: _selectedWeather,
              items: weatherOptions.map((weather) {
                return DropdownMenuItem(
                  value: weather,
                  child: Text(weather),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedWeather = value;
                });
              },
              decoration: InputDecoration(
                labelText: 'Weather Category',
                labelStyle: const TextStyle(color: themeGray),
                border: const OutlineInputBorder(),
                focusedBorder: const OutlineInputBorder(
                  borderSide: BorderSide(color: themeGreen),
                ),
              ),
            ),
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
