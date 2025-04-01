import 'dart:convert';
import 'package:flutter/material.dart';

class EditOutfitsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;
  final Map<String, dynamic> existingOutfit;

  const EditOutfitsScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
    required this.existingOutfit,
  }) : super(key: key);

  @override
  _EditOutfitsScreenState createState() => _EditOutfitsScreenState();
}

class _EditOutfitsScreenState extends State<EditOutfitsScreen> {
  late Map<String, dynamic> outfit;

  @override
  void initState() {
    super.initState();
    outfit = widget.existingOutfit;
    print("Editing outfit: ${jsonEncode(outfit)}");
  }

  Widget _clothingPreview(Map<String, dynamic>? item, String label) {
    if (item == null || item is! Map || item.isEmpty) {
      return Text('$label: (unresolved ID)');
    }

    return Row(
      children: [
        if (item['file'] != null && item['file'] is String)
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: Image.memory(
              base64Decode(item['file']),
              width: 40,
              height: 40,
              fit: BoxFit.cover,
            ),
          ),
        Expanded(
          child: Text('$label: ${item['Name'] ?? 'Unnamed'}'),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Outfit')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: outfit.isEmpty
            ? const Center(child: Text('No outfit data provided.'))
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Text(
                      outfit['Name'] ?? 'Unnamed Outfit',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _clothingPreview(outfit['Top'], 'Top'),
                  const SizedBox(height: 8),
                  _clothingPreview(outfit['Bottom'], 'Bottom'),
                  const SizedBox(height: 8),
                  _clothingPreview(outfit['Shoes'], 'Shoes'),
                  const SizedBox(height: 12),
                  Text(
                    'Weather: ${outfit['WeatherCategory'] ?? 'N/A'}',
                    style: const TextStyle(fontSize: 16),
                  ),
                ],
              ),
      ),
    );
  }
}
