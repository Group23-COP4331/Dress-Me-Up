import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CardsScreen extends StatefulWidget {
  const CardsScreen({Key? key}) : super(key: key);

  @override
  _CardsScreenState createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  final TextEditingController _addCardController = TextEditingController();
  final TextEditingController _searchCardController = TextEditingController();

  List<String> _cards = [];
  String _message = '';

  // Function to add a card
  Future<void> _addCard() async {
    String cardText = _addCardController.text;
    if (cardText.isEmpty) return;

    // Adjust 'userId' as needed (you might store this in local storage or pass it to this screen)
    Map<String, dynamic> cardData = {
      'userId': 'yourUserId',
      'card': cardText,
    };

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/addcard'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(cardData),
      );

      var data = jsonDecode(response.body);
      if (data['error'] != null && data['error'] != '') {
        setState(() {
          _message = 'Error: ${data['error']}';
        });
      } else {
        setState(() {
          _message = 'Card added successfully';
          // Optionally, update your _cards list or refresh the list from the server.
        });
      }
    } catch (e) {
      setState(() {
        _message = 'Error: $e';
      });
    }
  }

  // Function to search for cards
  Future<void> _searchCards() async {
    String searchQuery = _searchCardController.text;
    if (searchQuery.isEmpty) return;

    Map<String, dynamic> searchData = {
      'userId': 'yourUserId',
      'search': searchQuery,
    };

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/searchcards'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(searchData),
      );

      var data = jsonDecode(response.body);
      if (data['error'] != null && data['error'] != '') {
        setState(() {
          _message = 'Error: ${data['error']}';
        });
      } else {
        // Assume the backend returns a list of cards in data['results']
        setState(() {
          _cards = List<String>.from(data['results']);
          _message = 'Cards retrieved successfully';
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
      appBar: AppBar(title: const Text('Cards')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _searchCardController,
              decoration: const InputDecoration(labelText: 'Search Cards'),
            ),
            ElevatedButton(
              onPressed: _searchCards,
              child: const Text('Search'),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _addCardController,
              decoration: const InputDecoration(labelText: 'Add Card'),
            ),
            ElevatedButton(
              onPressed: _addCard,
              child: const Text('Add Card'),
            ),
            const SizedBox(height: 20),
            Text(_message),
            const SizedBox(height: 20),
            const Text('Your Cards:'),
            Expanded(
              child: ListView.builder(
                itemCount: _cards.length,
                itemBuilder: (context, index) {
                  return ListTile(title: Text(_cards[index]));
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
