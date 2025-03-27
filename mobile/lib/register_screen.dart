import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController  = TextEditingController();
  final _loginController     = TextEditingController();
  final _passwordController  = TextEditingController();
  bool _isLoading = false;
  String _message = '';

  Future<void> _register() async {
    setState(() {
      _isLoading = true;
      _message = '';
    });

    final registrationData = {
      'FirstName': _firstNameController.text,
      'LastName': _lastNameController.text,
      'Login': _loginController.text,
      'Password': _passwordController.text,
    };

    try {
      final response = await http.post(
        Uri.parse('http://dressmeupproject.com:5001/api/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(registrationData),
      );

      final data = jsonDecode(response.body);
      if (data['error'] != null && data['error'].isNotEmpty) {
        setState(() {
          _message = 'Error: ${data['error']}';
        });
      } else {
        setState(() {
          _message = data['message'] ??
              'Registration successful! Check your email for the verification link.';
        });
      }
    } catch (e) {
      setState(() {
        _message = 'Error: $e';
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
      appBar: AppBar(title: const Text('Register')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _firstNameController,
              decoration: const InputDecoration(labelText: 'First Name'),
            ),
            TextField(
              controller: _lastNameController,
              decoration: const InputDecoration(labelText: 'Last Name'),
            ),
            TextField(
              controller: _loginController,
              decoration: const InputDecoration(labelText: 'Email or Login'),
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
                    onPressed: _register, 
                    child: const Text('Register'),
                  ),
            const SizedBox(height: 20),
            Text(_message, style: const TextStyle(color: Colors.red)),
          ],
        ),
      ),
    );
  }
}
