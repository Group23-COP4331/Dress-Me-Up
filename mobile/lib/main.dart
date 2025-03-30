import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'login_screen.dart';
import 'register_screen.dart';
import 'cards_screen.dart';
import 'clothing_item_screen.dart'; // Import the add clothing item screen

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
        '/cards': (context) {
          final args = ModalRoute.of(context)!.settings.arguments as Map<String, String>;
          return CardsScreen(
            jwtToken: args['jwtToken']!,
            userId: args['userId']!,
          );
        },
        // New route for the clothing item form screen
        '/add-item': (context) {
          final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
          return AddClothingItemScreen(
            imageFile: args['imageFile'] as File,
            jwtToken: args['jwtToken'] as String,
            userId: args['userId'] as String,
          );
        },
      },
      // Optionally, you can handle dynamic routes with onGenerateRoute if needed.
      onGenerateRoute: (settings) {
        return null;
      },
    );
  }
}
