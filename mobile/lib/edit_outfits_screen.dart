import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'select_clothing_item_screen.dart';

class EditOutfitsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;
  final Map<String, dynamic> existingOutfit;

  const EditOutfitsScreen({
    super.key,
    required this.jwtToken,
    required this.userId,
    required this.existingOutfit,
  });

  @override
  _EditOutfitsScreenState createState() => _EditOutfitsScreenState();
}

class _EditOutfitsScreenState extends State<EditOutfitsScreen> {
  late TextEditingController _nameController;
  Map<String, dynamic>? _selectedTop;
  Map<String, dynamic>? _selectedBottom;
  Map<String, dynamic>? _selectedShoes;
  String? _selectedWeather;
  bool _isSaving = false;

  static const themeGreen = Color(0xFFB6C7AA);
  static const themeGray = Color(0xFFA0937D);
  static const themeDarkBeige = Color(0xFFE7D4B5);
  static const themeLightBeige = Color(0xFFF6E6CB);

  @override
  void initState() {
    super.initState();
    final outfit = widget.existingOutfit;
    _nameController = TextEditingController(text: outfit['Name'] ?? '');
_selectedTop = outfit['Top'] is Map ? outfit['Top'] : null;
_selectedBottom = outfit['Bottom'] is Map ? outfit['Bottom'] : null;
_selectedShoes = outfit['Shoes'] is Map ? outfit['Shoes'] : null;
    _selectedWeather = outfit['WeatherCategory'] ?? 'Normal';
  }

  Future<void> _updateOutfit() async {
    setState(() => _isSaving = true);

    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/updateOutfit'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${widget.jwtToken}',
      },
      body: jsonEncode({
        '_id': widget.existingOutfit['_id'],
        'name': _nameController.text,
        'top': _selectedTop?['_id'],
        'bottom': _selectedBottom?['_id'],
        'shoes': _selectedShoes?['_id'],
        'weatherCategory': _selectedWeather,
      }),
    );

    setState(() => _isSaving = false);

    if (response.statusCode == 200) {
      final updated = jsonDecode(response.body)['updatedOutfit'];
      Navigator.pop(context, updated);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update outfit')),
      );
    }
  }

  Future<void> _selectClothingItem(
    String label,
    List<String> allowedCategories,
    void Function(Map<String, dynamic>) onSelected,
  ) async {
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
    if (selected != null) setState(() => onSelected(selected));
  }

  Widget _clothingPreview(dynamic item, String label, List<String> allowedCategories, void Function(Map<String, dynamic>) onSelected) {
    return GestureDetector(
      onTap: () => _selectClothingItem(label, allowedCategories, onSelected),
      child: Row(
        children: [
          if (item != null && item is Map<String, dynamic> && item['file'] != null)
            Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: Image.memory(
                base64Decode(item['file']),
                width: 40,
                height: 40,
                fit: BoxFit.cover,
              ),
            ),
          Text('$label: ${item?['Name'] ?? "Tap to select"}')
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF6E6CB),
      appBar: AppBar(title: const Text('Edit Outfit'),backgroundColor: themeDarkBeige,),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Outfit Name'),
            ),
            const SizedBox(height: 10),
            _clothingPreview(_selectedTop, 'Top', ['shirts', 'longsleeves'], (item) => _selectedTop = item),
            const SizedBox(height: 10),
            _clothingPreview(_selectedBottom, 'Bottom', ['pants', 'shorts'], (item) => _selectedBottom = item),
            const SizedBox(height: 10),
            _clothingPreview(_selectedShoes, 'Shoes', ['shoes'], (item) => _selectedShoes = item),
            const SizedBox(height: 10),
            DropdownButtonFormField<String>(
              value: _selectedWeather,
              items: ['Cold', 'Normal', 'Rainy', 'Sunny', 'Cloudy'].map((weather) {
                return DropdownMenuItem(
                  value: weather,
                  child: Text(weather),
                );
              }).toList(),
              onChanged: (val) => setState(() => _selectedWeather = val),
              decoration: const InputDecoration(labelText: 'Weather Category'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isSaving ? null : _updateOutfit,
              style: ElevatedButton.styleFrom(backgroundColor: themeGreen),
              child: _isSaving ? const CircularProgressIndicator() : const Text('Save Changes'),
            )
          ],
        ),
      ),
    );
  }
}
