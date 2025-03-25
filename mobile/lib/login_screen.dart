import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'cards_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String _errorMessage = '';

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    final username = _usernameController.text;
    final password = _passwordController.text;

    // Adjust keys to match your backend's expected JSON fields
    final loginData = {
      'Login': username,
      'Password': password,
    };

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(loginData),

        
      );

      print('Login response: ${response.body}');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        // Check for any error in the response
        if (data['error'] != null && data['error'].isNotEmpty) {
          setState(() {
            _errorMessage = data['error'];
          });
        } else {
          // Extract JWT token and user ID from the response
          final jwtToken = data['jwtToken'] ?? '';
          final userId = data['id']?.toString() ?? '';

          // Navigate to CardsScreen, passing the token and user ID
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => CardsScreen(
                jwtToken: jwtToken,
                userId: userId,
              ),
            ),
          );
        }
      } else {
        setState(() {
          _errorMessage = 'Server error: ${response.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _usernameController,
              decoration: const InputDecoration(labelText: 'Username'),
            ),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            _isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _login,
                    child: const Text('Login'),
                  ),
            if (_errorMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
