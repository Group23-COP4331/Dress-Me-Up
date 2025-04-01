import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SelectClothingItemScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;
  final List<String> allowedCategories;

  const SelectClothingItemScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
    required this.allowedCategories,
  }) : super(key: key);

  @override
  _SelectClothingItemScreenState createState() => _SelectClothingItemScreenState();
}

class _SelectClothingItemScreenState extends State<SelectClothingItemScreen> {
  List<dynamic> _items = [];
  String _message = '';

  @override
  void initState() {
    super.initState();
    _fetchItems();
  }

  

  Future<void> _fetchItems() async {

    debugPrint('🛠️ _fetchItems called');

    try {
      // Fetch all clothing items for the user (without filtering by category on the server)
      final response = await http.get(
        Uri.parse(
  'http://dressmeupproject.com:5001/api/getClothingItems?userId=${widget.userId}&category=${widget.allowedCategories.first}',
),





        headers: {
          'Authorization': 'Bearer ${widget.jwtToken}',
        },

        
      );
      if (response.statusCode == 200) {
        debugPrint('🧾 getClothingItems raw response: ${response.body}');
        final data = jsonDecode(response.body);
        final items = data['results'] ?? [];

        debugPrint("➡️ Allowed categories: ${widget.allowedCategories}");
for (var item in items) {
  debugPrint("🧢 Item: Name=${item['Name']}, Category=${item['Category']}");
}
        // Filter items locally based on allowedCategories (case-insensitive)
        setState(() {
          
          _items = items.where((item) {
            final category = item['Category']?.toString().toLowerCase() ?? '';
            return widget.allowedCategories.map((e) => e.toLowerCase()).contains(category);
          }).toList();
          if (_items.isEmpty) {
            _message = 'No items available in this category.';
          }
        });
        
      } else {
        setState(() {
          _message = 'Failed to load items.';
        });
      }
    } catch (e) {
      setState(() {
        _message = 'Error: $e';
      });
    }
    
  }

  

  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Item'),
      ),
      body: _items.isEmpty
          ? Center(child: Text(_message.isNotEmpty ? _message : 'Loading...'))
          : ListView.builder(
              itemCount: _items.length,
              itemBuilder: (context, index) {
                final item = _items[index];
                return ListTile(
                  leading: item['file'] != null
                      ? Image.memory(
                          base64Decode(item['file']),
                          height: 50,
                          width: 50,
                          fit: BoxFit.cover,
                        )
                      : null,
                  title: Text(item['Name'] ?? 'Unnamed'),
                  subtitle: Text(item['Category'] ?? ''),
                  onTap: () {
                    Navigator.pop(context, item);
                  },
                );
              },
            ),
    );
  }
}
