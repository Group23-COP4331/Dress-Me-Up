import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class CardsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;

  const CardsScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  _CardsScreenState createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  final TextEditingController _addCardController = TextEditingController();
  final TextEditingController _searchCardController = TextEditingController();

  // We'll store the current token in a state variable so we can update it
  // whenever the server returns a refreshed token.
  late String _currentJwtToken;

  List<String> _cards = [];
  String _message = '';

  @override
  void initState() {
    super.initState();
    // Initialize _currentJwtToken with the token passed from LoginScreen
    _currentJwtToken = widget.jwtToken;
  }

  // Function to add a card
  Future<void> _addCard() async {
    final cardText = _addCardController.text;
    if (cardText.isEmpty) return;

    // The server code expects userId, card, and jwtToken
    final cardData = {
      'userId': widget.userId,
      'card': cardText,
      'jwtToken': _currentJwtToken,
    };

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/addcard'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(cardData),
      );

      final data = jsonDecode(response.body);

      // Check if there's an error
      if (data['error'] != null && data['error'].isNotEmpty) {
        setState(() {
          _message = 'Error: ${data['error']}';
        });
      } else {
        setState(() {
          _message = 'Card added successfully';

          // >>> If the server returns a refreshed token, store it <<<
          final newToken = data['jwtToken'];
          if (newToken != null && newToken.isNotEmpty) {
            _currentJwtToken = newToken;
          }
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
    final searchQuery = _searchCardController.text;
    if (searchQuery.isEmpty) return;

    final searchData = {
      'userId': widget.userId,
      'search': searchQuery,
      'jwtToken': _currentJwtToken,
    };

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/searchcards'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(searchData),
      );

      final data = jsonDecode(response.body);

      if (data['error'] != null && data['error'].isNotEmpty) {
        setState(() {
          _message = 'Error: ${data['error']}';
        });
      } else {
        // The server returns a list of cards in data['results']
        setState(() {
          _cards = List<String>.from(data['results']);
          _message = 'Cards retrieved successfully';

          // >>> Also store the refreshed token if present <<<
          final newToken = data['jwtToken'];
          if (newToken != null && newToken.isNotEmpty) {
            _currentJwtToken = newToken;
          }
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
