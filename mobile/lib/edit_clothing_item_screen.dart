import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'select_clothing_item_screen.dart';

class EditOutfitScreen extends StatefulWidget {
  final Map<String, dynamic> outfit;
  final String jwtToken;
  final String userId;

  const EditOutfitScreen({
    Key? key,
    required this.outfit,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  State<EditOutfitScreen> createState() => _EditOutfitScreenState();
}

class _EditOutfitScreenState extends State<EditOutfitScreen> {
  final TextEditingController _nameController = TextEditingController();
  Map<String, dynamic>? _top;
  Map<String, dynamic>? _bottom;
  Map<String, dynamic>? _shoes;
  String? _selectedWeather;
  bool _isLoading = false;

  static const themeGreen = Color(0xFFB6C7AA);
  static const themeGray = Color(0xFFA0937D);
  static const themeDarkBeige = Color(0xFFE7D4B5);
  static const themeLightBeige = Color(0xFFF6E6CB);

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.outfit['Name'] ?? '';
    _selectedWeather = widget.outfit['WeatherCategory'] ?? 'Any';
    _fetchClothingItems();
  }

  Future<void> _fetchClothingItems() async {
    try {
      final ids = [widget.outfit['Top'], widget.outfit['Bottom'], widget.outfit['Shoes']];
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/getClothingItemsByIds'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'ids': ids}),
      );
      if (response.statusCode == 200) {
        final items = List<Map<String, dynamic>>.from(jsonDecode(response.body)['results']);
        setState(() {
          _top = items.firstWhere((item) => item['_id'] == widget.outfit['Top']);
          _bottom = items.firstWhere((item) => item['_id'] == widget.outfit['Bottom']);
          _shoes = items.firstWhere((item) => item['_id'] == widget.outfit['Shoes']);
        });
      }
    } catch (e) {
      print('Failed to load clothing items: $e');
    }
  }

  Future<void> _saveChanges() async {
    setState(() => _isLoading = true);

    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/updateOutfit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        '_id': widget.outfit['_id'],
        'name': _nameController.text,
        'top': _top?['_id'] ?? '',
        'bottom': _bottom?['_id'] ?? '',
        'shoes': _shoes?['_id'] ?? '',
        'weatherCategory': _selectedWeather ?? '',
      }),
    );

    setState(() => _isLoading = false);

    if (response.statusCode == 200) {
      Navigator.pop(context, jsonDecode(response.body)['updatedOutfit']);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update outfit')),
      );
    }
  }

  Widget _clothingTile(Map<String, dynamic>? item, String label) {
    if (item == null) return Text('No $label selected');
    return ListTile(
      leading: item['file'] != null
          ? Image.memory(
              base64Decode(item['file']),
              width: 50,
              height: 50,
              fit: BoxFit.cover,
            )
          : const Icon(Icons.image_not_supported),
      title: Text(item['Name'] ?? label),
      subtitle: Text(item['Category'] ?? ''),
    );
  }

  Future<void> _selectItem(String type, List<String> categories) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SelectClothingItemScreen(
          jwtToken: widget.jwtToken,
          userId: widget.userId,
          allowedCategories: categories,
        ),
      ),
    );
    if (result != null) {
      setState(() {
        if (type == 'Top') _top = result;
        if (type == 'Bottom') _bottom = result;
        if (type == 'Shoes') _shoes = result;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: themeLightBeige,
      appBar: AppBar(
        title: const Text('Edit Outfit'),
        backgroundColor: themeDarkBeige,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Outfit Name'),
            ),
            const SizedBox(height: 10),
            _clothingTile(_top, 'Top'),
            ElevatedButton(
              onPressed: () => _selectItem('Top', ['shirts', 'longsleeves']),
              child: const Text('Change Top'),
            ),
            _clothingTile(_bottom, 'Bottom'),
            ElevatedButton(
              onPressed: () => _selectItem('Bottom', ['pants', 'shorts']),
              child: const Text('Change Bottom'),
            ),
            _clothingTile(_shoes, 'Shoes'),
            ElevatedButton(
              onPressed: () => _selectItem('Shoes', ['shoes']),
              child: const Text('Change Shoes'),
            ),
            const SizedBox(height: 10),
            DropdownButtonFormField<String>(
              value: _selectedWeather,
              decoration: const InputDecoration(labelText: 'Weather Category'),
              items: const [
                DropdownMenuItem(value: 'Hot', child: Text('Hot')),
                DropdownMenuItem(value: 'Cold', child: Text('Cold')),
                DropdownMenuItem(value: 'Normal', child: Text('Normal')),
                DropdownMenuItem(value: 'Rainy', child: Text('Rainy')),
                DropdownMenuItem(value: 'Sunny', child: Text('Sunny')),
                DropdownMenuItem(value: 'Cloudy', child: Text('Cloudy')),
              ],
              onChanged: (value) => setState(() => _selectedWeather = value),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isLoading ? null : _saveChanges,
              child: _isLoading ? const CircularProgressIndicator() : const Text('Save Changes'),
            )
          ],
        ),
      ),
    );
  }
}
