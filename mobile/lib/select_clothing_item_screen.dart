import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SelectClothingItemScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;
  final List<String> allowedCategories;

  const SelectClothingItemScreen({
    super.key,
    required this.jwtToken,
    required this.userId,
    required this.allowedCategories,
  });

  @override
  _SelectClothingItemScreenState createState() => _SelectClothingItemScreenState();
}

class _SelectClothingItemScreenState extends State<SelectClothingItemScreen> {
  List<dynamic> _items = [];
  String _message = '';
  static final Map<String, List<dynamic>> _cache = {}; // simple in-memory cache

  @override
  void initState() {
    super.initState();
    _fetchItems();
  }

  Future<void> _fetchItems() async {
  final cacheKey = widget.allowedCategories.join(',').toLowerCase();

  if (_cache.containsKey(cacheKey)) {
    if (!mounted) return;
    setState(() {
      _items = _cache[cacheKey]!;
      if (_items.isEmpty) {
        _message = 'No items available in this category.';
      }
    });
    return;
  }

  try {
    debugPrint('🛠️ Fetching clothing items for: $cacheKey');

    final categoryParams = widget.allowedCategories
        .map((cat) => 'category=${Uri.encodeComponent(cat)}')
        .join('&');

    final url = Uri.parse(
      'http://dressmeupproject.com:5001/api/getClothingItems?userId=${widget.userId}&$categoryParams',
    );

    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer ${widget.jwtToken}',
      },
    );

    if (!mounted) return;

    if (response.statusCode == 200) {
      debugPrint('🧾 getClothingItems raw response: ${response.body}');
      final data = jsonDecode(response.body);
      final items = data['results'] ?? [];

      final allowed = widget.allowedCategories.map((e) => e.toLowerCase()).toSet();
      final filteredItems = items.where((item) {
        final category = item['Category']?.toString().toLowerCase() ?? '';
        return allowed.contains(category);
      }).toList();

      if (!mounted) return;
      setState(() {
        _items = filteredItems;
        _cache[cacheKey] = filteredItems;
        if (_items.isEmpty) {
          _message = 'No items available in this category.';
        }
      });
    } else {
      if (!mounted) return;
      setState(() {
        _message = 'Failed to load items.';
      });
    }
  } catch (e) {
    if (!mounted) return;
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
