import 'dart:io';
import 'camera_screen.dart' show CameraScreen; // Add this line

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'login_screen.dart' show LoginScreen;
import 'register_screen.dart' show RegisterScreen;
import 'cards_screen.dart' show CardsScreen;
import 'item_form_screen.dart' show ItemFormScreen; // Add this import

void main() {
  runApp(const MyApp());
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    systemNavigationBarColor: Color(0xFFF6E6CB),
  ));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DressMeUp',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // ... existing theme data
      ),
      home: const LoginScreen(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/add-item': (context) { // Add this new route
          final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
          return ItemFormScreen(
            imageFile: args['imageFile'] as File,
            jwtToken: args['jwtToken'] as String,
          );
        },
      },
      onGenerateRoute: (settings) {
        // Existing cards route
        if (settings.name == '/cards') {
          final args = settings.arguments as Map<String, String>;
          return MaterialPageRoute(
            builder: (context) => CardsScreen(
              jwtToken: args['jwtToken']!,
              userId: args['userId']!,
            ),
          );
        }
        
        // Add item form route
        if (settings.name == '/camera') {
          return MaterialPageRoute(
            builder: (context) => CameraScreen(
              jwtToken: (settings.arguments as Map)['jwtToken'] as String,
            ),
          );
        }
        
        return null;
      },
    );
  }
}