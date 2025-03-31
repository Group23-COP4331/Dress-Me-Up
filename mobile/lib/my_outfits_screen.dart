import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import "edit_outfits_screen.dart" as EditOutfitScreen;

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

  @override
  void initState() {
    super.initState();
    _fetchOutfits();
  }

  Future<void> _fetchOutfits() async {
    try {
      final response = await http.get(
        Uri.parse('http://dressmeupproject.com:5001/api/getOutfits?userId=${widget.userId}'),
        headers: {
          'Authorization': 'Bearer ${widget.jwtToken}',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _outfits = data['results'] ?? [];
        });
      } else {
        // handle error
      }
    } catch (e) {
      // handle error
    }
  }

  // Delete an outfit
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
        // Remove from local list
        setState(() {
          _outfits.removeWhere((outfit) => outfit['_id'] == outfitId);
        });
      } else {
        // handle error
      }
    } catch (e) {
      // handle error
    }
  }

  // Navigate to an edit screen or dialog
  void _editOutfit(Map<String, dynamic> outfit) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditOutfitScreen.EditOutfitScreen(
          jwtToken: widget.jwtToken,
          userId: widget.userId,
          outfit: outfit,
        ),
      ),
    ).then((updatedOutfit) {
      // If the user saved changes, update the local list
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Outfits'),
      ),
      body: ListView.builder(
        itemCount: _outfits.length,
        itemBuilder: (context, index) {
          final outfit = _outfits[index];
          return Card(
            child: ListTile(
              title: Text(outfit['Name'] ?? 'Unnamed Outfit'),
              subtitle: Text(
                'Top: ${outfit['Top']} • Bottom: ${outfit['Bottom']} • Shoes: ${outfit['Shoes']}',
              ),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Edit
                  IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () => _editOutfit(outfit),
                  ),
                  // Delete
                  IconButton(
                    icon: const Icon(Icons.delete),
                    onPressed: () => _deleteOutfit(outfit['_id']),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
