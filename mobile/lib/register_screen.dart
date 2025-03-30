import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _loginController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String _message = '';

  Future<void> _register() async {
  if (!context.mounted) return;

  setState(() {
    _isLoading = true;
    _message = '';
  });

  final registrationData = {
    'FirstName': _firstNameController.text.trim(),
    'LastName': _lastNameController.text.trim(),
    'Login': _loginController.text.trim(),
    'Password': _passwordController.text.trim(),
  };

  try {
    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(registrationData),
    );

    print('Status Code: ${response.statusCode}');
    print('Response Body: ${response.body}');

    if (context.mounted) {
      dynamic data;
      try {
        data = jsonDecode(response.body);
      } catch (e) {
        setState(() => _message = 'Error parsing server response');
        return;
      }

      if (response.statusCode == 200) {
        if (data['error']?.isNotEmpty ?? false) {
          setState(() => _message = 'Error: ${data['error']}');
        } else {
          await showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              title: const Text('Success'),
              content: const Text('Registration complete! Check your email to verify.'),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('OK'),
                ),
              ],
            ),
          );

          if (context.mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const LoginScreen()),
            );
          }
        }
      } else {
        final errorMsg = data['error'] ?? data['message'] ?? 'Unknown error';
        setState(() => _message = 'Error: $errorMsg');
      }
    }
  } catch (e) {
    print('Exception: $e');
    if (context.mounted) {
      setState(() => _message = 'Network error: Please check your connection');
    }
  } finally {
    if (context.mounted) {
      setState(() => _isLoading = false);
    }
  }
}

  @override
Widget build(BuildContext context) {
  final inputDecoration = InputDecoration(
    filled: true,
    fillColor: Colors.white.withOpacity(0.9),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderSide: BorderSide(color: Color(0xFF5E5340)),
    ),
    labelStyle: TextStyle(color: Color(0xFF5E5340)),
  );

  return Scaffold(
    body: Container(
      color: const Color(0xFFF6E6CB),
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
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
                    )
                  ],
                ),
                child: Column(
                  children: [
                    Text(
                      'Register',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[800], // Using your green color
                      ),
                    ),
                    const SizedBox(height: 32),
                    TextField(
                      controller: _firstNameController,
                      decoration: inputDecoration.copyWith(
                        labelText: 'First Name',
                        prefixIcon: Icon(Icons.person_outline, 
                          color: Color(0xFF5E5340)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _lastNameController,
                      decoration: inputDecoration.copyWith(
                        labelText: 'Last Name',
                        prefixIcon: Icon(Icons.people_alt_outlined,
                          color: Color(0xFF5E5340)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _loginController,
                      decoration: inputDecoration.copyWith(
                        labelText: 'Email',
                        prefixIcon: Icon(Icons.email_outlined,
                          color: Color(0xFF5E5340)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: inputDecoration.copyWith(
                        labelText: 'Password',
                        prefixIcon: Icon(Icons.lock_outlined,
                          color: Color(0xFF5E5340)),
                      ),
                    ),
                    const SizedBox(height: 24),
                    _isLoading
                        ? const CircularProgressIndicator()
                        : SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF5E5340),
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8)),
                              ),
                              onPressed: _register,
                              child: const Text(
                                'Register',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white),
                              ),
                            ),
                          ),
                    const SizedBox(height: 20),
                    TextButton(
                      onPressed: () {
                        if (context.mounted) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LoginScreen(),
                            ),
                          );
                        }
                      },
                      child: RichText(
                        text: TextSpan(
                          style: TextStyle(
                            color: Colors.green[800],
                            fontSize: 16,
                          ),
                          children: [
                            const TextSpan(text: 'Already have an account? '),
                            TextSpan(
                              text: 'Login',
                              style: TextStyle(
                                color: Colors.green[800],
                                fontWeight: FontWeight.bold,
                                decoration: TextDecoration.underline,
                                decorationColor: Colors.green[800],
                                decorationThickness: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      _message,
                      style: TextStyle(
                        color: _message.contains('Error') 
                          ? Colors.red[700]
                          : Color(0xFF4CAF50),
                        fontWeight: FontWeight.w500,
                      ),
                      textAlign: TextAlign.center,
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