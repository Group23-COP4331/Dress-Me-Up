import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import "edit_outfits_screen.dart" as EditOutfitScreen;
import "add_outfit_screen.dart" as AddOutfitScreen; // Ensure this file exists

class MyOutfitsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;

  const MyOutfitsScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  _MyOutfitsScreenState createState() => _MyOutfitsScreenState();
}

class _MyOutfitsScreenState extends State<MyOutfitsScreen> {
  List<dynamic> _outfits = [];
  String _message = '';

  static const themeGreen = Color(0xFFB6C7AA);
  static const themeGray = Color(0xFFA0937D);
  static const themeDarkBeige = Color(0xFFE7D4B5);
  static const themeLightBeige = Color(0xFFF6E6CB);

  @override
  void initState() {
    super.initState();
    _fetchOutfits();
  }

  Future<void> _fetchOutfits() async {
    try {
      final url = Uri.parse(
        'http://dressmeupproject.com:5001/api/getOutfits?userId=${widget.userId}',
      );
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer ${widget.jwtToken}',
        },
      );

      debugPrint("GET Outfits Status code: ${response.statusCode}");
      debugPrint("GET Outfits Response body: ${response.body}");

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _outfits = data['results'] ?? [];
          if (_outfits.isEmpty) {
            _message = 'No outfits yet.';
          }
        });
      } else {
        setState(() {
          _message = 'Failed to load outfits. (Status: ${response.statusCode})';
        });
      }
    } catch (e) {
      setState(() {
        _message = 'Error: $e';
      });
    }
  }

  Future<void> _deleteOutfit(String outfitId) async {
    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/deleteOutfit'),
        headers: {
          'Authorization': 'Bearer ${widget.jwtToken}',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'_id': outfitId}),
      );

      if (response.statusCode == 200) {
        setState(() {
          _outfits.removeWhere((outfit) => outfit['_id'] == outfitId);
          if (_outfits.isEmpty) {
            _message = 'No outfits yet.';
          }
        });
      } else {
        debugPrint('Delete outfit failed: ${response.body}');
      }
    } catch (e) {
      debugPrint('Error deleting outfit: $e');
    }
  }

  void _editOutfit(Map<String, dynamic> outfit) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditOutfitScreen.EditOutfitsScreen(
          jwtToken: widget.jwtToken,
          userId: widget.userId,
          existingOutfit: outfit,
        ),
      ),
    ).then((updatedOutfit) {
      if (updatedOutfit != null) {
        final index = _outfits.indexWhere((o) => o['_id'] == updatedOutfit['_id']);
        if (index != -1) {
          setState(() {
            _outfits[index] = updatedOutfit;
          });
        }
      }
    });
  }

Widget _buildClothingRow(String label, dynamic item) {
  if (item == null) return Text('$label: N/A');

  if (item is String) {
    return Text('$label: (unresolved ID)');
  }

  if (item is Map<String, dynamic>) {
    final name = item['Name'];
    final imageData = item['file'];

    return Row(
      children: [
        if (imageData is String)
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: Image.memory(
              base64Decode(imageData),
              width: 40,
              height: 40,
              fit: BoxFit.cover,
            ),
          ),
        Text('$label: ${name ?? "N/A"}'),
      ],
    );
  }

  return Text('$label: (invalid data)');
}



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: themeLightBeige,
      appBar: AppBar(
        title: const Text('My Outfits'),
        backgroundColor: themeDarkBeige,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AddOutfitScreen.AddOutfitScreen(
                      jwtToken: widget.jwtToken,
                      userId: widget.userId,
                    ),
                  ),
                ).then((newOutfit) {
                  if (newOutfit != null) {
                    setState(() {
                      _outfits.add(newOutfit);
                      _message = '';
                    });
                  }
                });
              },
              icon: const Icon(Icons.add),
              label: const Text('Add Outfit'),
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
            Expanded(
              child: _outfits.isEmpty
                  ? const Center(child: Text('No outfits yet.'))
                  : ListView.builder(
                      itemCount: _outfits.length,
                      itemBuilder: (context, index) {
                        final outfit = _outfits[index];
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
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Center(
                                  child: Text(
                                    outfit['Name'] ?? 'Unnamed Outfit',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: themeGray,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 5),
                                _buildClothingRow('Top', outfit['Top']),
                                const SizedBox(height: 5),
                                _buildClothingRow('Bottom', outfit['Bottom']),
                                const SizedBox(height: 5),
                                _buildClothingRow('Shoes', outfit['Shoes']),
                                const SizedBox(height: 5),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    IconButton(
                                      icon: const Icon(Icons.edit),
                                      color: themeGray,
                                      onPressed: () => _editOutfit(outfit),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.delete),
                                      color: themeGray,
                                      onPressed: () => _deleteOutfit(outfit['_id']),
                                    ),
                                  ],
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
