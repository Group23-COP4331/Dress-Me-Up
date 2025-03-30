import 'dart:convert';
import 'dart:io';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class CardsScreen extends StatefulWidget {
  final String jwtToken;
  final String userId;

  const CardsScreen({
    Key? key,
    required this.jwtToken,
    required this.userId,
  }) : super(key: key);

  @override
  State<CardsScreen> createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  final TextEditingController _addCardController = TextEditingController();
  final TextEditingController _searchCardController = TextEditingController();
  late String _currentJwtToken;
  List<String> _cards = [];
  String _message = '';
  File? _cardImage;
  late CameraController _cameraController;
  bool _isCameraInitialized = false;

  @override
  void initState() {
    super.initState();
    _currentJwtToken = widget.jwtToken;
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    _cameraController = CameraController(
      cameras.first,
      ResolutionPreset.medium,
    );
    await _cameraController.initialize();
    if (!mounted) return;
    setState(() => _isCameraInitialized = true);
  }

  Future<void> _takePicture() async {
    final image = await ImagePicker().pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.rear,
      imageQuality: 85,
    );
    
    if (image != null) {
      setState(() => _cardImage = File(image.path));
    }
  }

  Future<void> _addCard() async {
    final cardText = _addCardController.text;
    if (cardText.isEmpty) {
      setState(() => _message = 'Card text is required');
      return;
    }

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://dressmeupproject.com:5001/api/addcard'),
    );

    // Add JWT token and headers
    request.headers['Authorization'] = 'Bearer $_currentJwtToken';
    request.headers['Content-Type'] = 'multipart/form-data';

    // Add image if captured
    if (_cardImage != null) {
      request.files.add(await http.MultipartFile.fromPath(
        'file',
        _cardImage!.path,
      ));
    }

    // Add other fields
    request.fields.addAll({
      'card': cardText,
      'userId': widget.userId,
    });

    try {
      var response = await request.send();
      var body = await response.stream.bytesToString();
      final data = jsonDecode(body);

      if (response.statusCode == 200) {
        setState(() {
          _message = 'Card added successfully';
          _addCardController.clear();
          _cardImage = null;
          if (data['jwtToken'] != null) {
            _currentJwtToken = data['jwtToken'];
          }
        });
      } else {
        setState(() => _message = 'Error: ${data['error'] ?? 'Unknown error'}');
      }
    } catch (e) {
      setState(() => _message = 'Connection error: $e');
    }
  }

  Future<void> _searchCards() async {
  final searchQuery = _searchCardController.text.trim();
  if (searchQuery.isEmpty) return;

  try {
    final response = await http.post(
      Uri.parse('http://dressmeupproject.com:5001/api/searchcards'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_currentJwtToken'
      },
      body: jsonEncode({
        'userId': widget.userId,
        'search': searchQuery,
        'jwtToken': _currentJwtToken
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      setState(() {
        _cards = List<String>.from(data['results'] ?? []);
        _message = 'Found ${_cards.length} cards';
        _currentJwtToken = data['jwtToken'] ?? _currentJwtToken;
      });
    } else {
      setState(() => _message = 'Error: ${data['error']}');
    }
  } catch (e) {
    setState(() => _message = 'Search failed: ${e.toString()}');
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
            // Search Section (unchanged)
            TextField(
              controller: _searchCardController,
              decoration: const InputDecoration(labelText: 'Search Cards'),
            ),
            ElevatedButton(
              onPressed: _searchCards,
              child: const Text('Search'),
            ),

            const SizedBox(height: 20),
            
            // Camera Preview Section
            if (_isCameraInitialized && _cardImage == null)
              SizedBox(
                height: 200,
                child: CameraPreview(_cameraController),
              ),
            
            if (_cardImage != null)
              Image.file(_cardImage!, height: 200),
            
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _addCardController,
                    decoration: const InputDecoration(labelText: 'Card Text'),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.camera_alt),
                  onPressed: _takePicture,
                ),
              ],
            ),
            
            ElevatedButton(
              onPressed: _addCard,
              child: const Text('Add Card with Image'),
            ),
            
            const SizedBox(height: 20),
            Text(_message),
            const SizedBox(height: 20),
            const Text('Your Cards:'),
            Expanded(
              child: ListView.builder(
                itemCount: _cards.length,
                itemBuilder: (context, index) => ListTile(
                  title: Text(_cards[index]),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _cameraController.dispose();
    super.dispose();
  }
}