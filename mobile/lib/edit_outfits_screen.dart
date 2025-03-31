import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'select_clothing_item_screen.dart';

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
  final _nameController = TextEditingController();
  Map<String, dynamic>? _topItem;
  Map<String, dynamic>? _bottomItem;
  Map<String, dynamic>? _shoesItem;
  String? _selectedWeather;
  bool _isLoading = true;

  static const weatherOptions = ['Cold', 'Normal', 'Rainy', 'Sunny', 'Cloudy'];

  static const themeGreen = Color(0xFFB6C7AA);
  static const themeGray = Color(0xFFA0937D);
  static const themeLightBeige = Color(0xFFF6E6CB);

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.outfit['Name'] ?? '';
    _selectedWeather = widget.outfit['WeatherCategory'] ?? 'Normal';
    _fetchClothingItems();
  }

  Future<void> _fetchClothingItems() async {
    final ids = [widget.outfit['Top'], widget.outfit['Bottom'], widget.outfit['Shoes']];
    final responses = await Future.wait(ids.map((id) =>
      http.get(Uri.parse('http://dressmeupproject.com:5001/api/getClothingItemById?id=$id'))
    ));

    setState(() {
      _topItem = jsonDecode(responses[0].body);
      _bottomItem = jsonDecode(responses[1].body);
      _shoesItem = jsonDecode(responses[2].body);
      _isLoading = false;
    });
  }

  Widget _clothingPreview(Map<String, dynamic>? item, String label, List<String> allowedCategories, void Function(Map<String, dynamic>) onItemSelected) {
    return InkWell(
      onTap: () async {
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
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: themeGray),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            if (item != null && item['file'] != null)
              Image.memory(
                base64Decode(item['file']),
                width: 60,
                height: 60,
                fit: BoxFit.cover,
              ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                item != null ? item['Name'] ?? label : 'Select $label',
                style: TextStyle(fontSize: 16, color: themeGray),
              ),
            ),
            const Icon(Icons.edit, color: themeGray),
          ],
        ),
      ),
    );
  }

  Future<void> _saveChanges() async {
    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/updateOutfit'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${widget.jwtToken}',
      },
      body: jsonEncode({
        '_id': widget.outfit['_id'],
        'name': _nameController.text.trim(),
        'top': _topItem?['_id'],
        'bottom': _bottomItem?['_id'],
        'shoes': _shoesItem?['_id'],
        'weatherCategory': _selectedWeather,
      }),
    );

    if (response.statusCode == 200) {
      final updatedOutfit = jsonDecode(response.body)['updatedOutfit'];
      Navigator.pop(context, updatedOutfit);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update outfit')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: themeLightBeige,
      appBar: AppBar(
        title: const Text('Edit Outfit'),
        backgroundColor: themeGreen,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(labelText: 'Outfit Name'),
                  ),
                  _clothingPreview(_topItem, 'Top', ['shirts', 'longsleeves'], (item) => _topItem = item),
                  _clothingPreview(_bottomItem, 'Bottom', ['pants', 'shorts'], (item) => _bottomItem = item),
                  _clothingPreview(_shoesItem, 'Shoes', ['shoes'], (item) => _shoesItem = item),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<String>(
                    value: _selectedWeather,
                    decoration: const InputDecoration(labelText: 'Weather Category'),
                    items: weatherOptions.map((weather) {
                      return DropdownMenuItem(value: weather, child: Text(weather));
                    }).toList(),
                    onChanged: (val) => setState(() => _selectedWeather = val),
                  ),
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
