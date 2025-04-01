import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class EditOutfitsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;
    final Map<String, dynamic> existingOutfit; // 👈 ADD THIS

  const EditOutfitsScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
    required this.existingOutfit, // 👈 Add this
  }) : super(key: key);

  @override
  _EditOutfitsScreenState createState() => _EditOutfitsScreenState();
}

class _EditOutfitsScreenState extends State<EditOutfitsScreen> {
  List<dynamic> outfits = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchOutfits();
  }

  Future<void> _fetchOutfits() async {
    final response = await http.get(
      Uri.parse('http://dressmeupproject.com:5001/api/getOutfits?userId=${widget.userId}'),
      headers: {
        'Authorization': 'Bearer ${widget.jwtToken}',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        outfits = data['results'];
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
      // Handle error UI here if needed
    }
  }

  Widget _clothingPreview(Map<String, dynamic>? item, String label) {
    if (item == null) return Text('$label: Not selected');

    return Row(
      children: [
        if (item['file'] != null)
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: Image.memory(
              base64Decode(item['file']),
              width: 40,
              height: 40,
              fit: BoxFit.cover,
            ),
          ),
        Expanded(child: Text('$label: ${item['Name']}')),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Outfits')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: outfits.length,
              itemBuilder: (context, index) {
                final outfit = outfits[index];
                return Card(
                  margin: const EdgeInsets.all(10),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          outfit['Name'] ?? 'Unnamed Outfit',
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        _clothingPreview(outfit['Top'], 'Top'),
                        const SizedBox(height: 4),
                        _clothingPreview(outfit['Bottom'], 'Bottom'),
                        const SizedBox(height: 4),
                        _clothingPreview(outfit['Shoes'], 'Shoes'),
                        const SizedBox(height: 8),
                        Text('Weather: ${outfit['WeatherCategory'] ?? 'N/A'}'),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
