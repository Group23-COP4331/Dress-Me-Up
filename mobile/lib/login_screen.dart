import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'cards_screen.dart';
import 'register_screen.dart';

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

 // In your login screen class
void _goToRegister() {
  // Check if the widget is still mounted
  if (!context.mounted) return;
  
  try {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const RegisterScreen(),
      ),
    );
  } catch (e) {
    print('Navigation error: $e');
    setState(() {
      _errorMessage = 'Error navigating to registration: $e';
    });
  }
}

// Modified login method to ensure context validity
Future<void> _login() async {
  if (!context.mounted) return;

  setState(() {
    _isLoading = true;
    _errorMessage = '';
  });

  final loginData = {
    'Login': _usernameController.text.trim(),
    'Password': _passwordController.text.trim(),
  };

  try {
    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(loginData),
    );

    if (!context.mounted) return;

    final data = jsonDecode(response.body);
    
    if (response.statusCode == 200) {
      if (data['error'] != null && data['error'].isNotEmpty) {
        setState(() {
          _errorMessage = data['error'];
        });
      } else {
        // Successful login - navigate to CardsScreen
        final jwtToken = data['jwtToken'] ?? '';
        final userId = data['id']?.toString() ?? '';
        
if (userId.isEmpty) {
  setState(() {
    _errorMessage = 'Login failed: Invalid user ID';
    _isLoading = false;
  });
  return; // Exit instead of crashing
}

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
    if (context.mounted) {
      setState(() {
        _errorMessage = 'Network error: $e';
      });
    }
  } finally {
    if (context.mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Theme.of(context).colorScheme.background, // Use theme background color
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Centered Logo with increased size
                Image.asset(
                  '../frontend/src/assets/GreenLogo.png', // Make sure this path matches your pubspec.yaml
                  width: 200,  // Increased from 100
                  height: 200, // Increased from 100
                ),
                const SizedBox(height: 40), // Added spacing between logo and form
                
                // Login Form
                Container(
                  width: MediaQuery.of(context).size.width > 600 ? 500 : double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFFA0937D),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Text(
                        'Login',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.green[800],
                        ),
                      ),
                      const SizedBox(height: 32),
                      TextField(
                        controller: _usernameController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          prefixIcon: Icon(Icons.email),
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock),
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 24),
                      if (_errorMessage.isNotEmpty)
                        Text(
                          _errorMessage,
                          style: const TextStyle(color: Colors.red),
                        ),
                      const SizedBox(height: 20),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green[800],
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8)),
                          ),
                          onPressed: _isLoading ? null : _login,
                          child: _isLoading
                              ? const CircularProgressIndicator(color: Colors.white)
                              : const Text(
                                  'Login',
                                  style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.white),
                                  ),
                        ),
                      ),
                      TextButton(
                        onPressed: _goToRegister,
                        child: Text(
                          'Create an account',
                          style: TextStyle(color: Colors.green[800]),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}