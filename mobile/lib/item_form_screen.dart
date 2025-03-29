import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';

class ItemFormScreen extends StatefulWidget {
  final File imageFile;
  final String jwtToken;

  const ItemFormScreen({
    Key? key,
    required this.imageFile,
    required this.jwtToken,
  }) : super(key: key);

  @override
  _ItemFormScreenState createState() => _ItemFormScreenState();
}

class _ItemFormScreenState extends State<ItemFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late String _name, _color, _category, _size;

  Future<void> _submitItem() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('http://dressmeupproject.com/api/addClothingItem'),
    );

    // Add JWT token to headers
    request.headers['Authorization'] = 'Bearer ${widget.jwtToken}';

    // Add image file
    request.files.add(await http.MultipartFile.fromPath(
      'file',
      widget.imageFile.path,
    ));

    // Add other fields
    request.fields.addAll({
      'name': _name,
      'color': _color,
      'category': _category,
      'size': _size,
      'userId': JwtDecoder.decode(widget.jwtToken)['userId'].toString(),
    });

    try {
      var response = await request.send();
      if (response.statusCode == 201) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Item added successfully!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error adding item')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Connection error')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Item Details')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Image.file(widget.imageFile, height: 200),
              SizedBox(height: 20),
              TextFormField(
                decoration: InputDecoration(labelText: 'Item Name'),
                validator: (value) =>
                    value!.isEmpty ? 'Required field' : null,
                onSaved: (value) => _name = value!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Color'),
                validator: (value) =>
                    value!.isEmpty ? 'Required field' : null,
                onSaved: (value) => _color = value!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Category'),
                validator: (value) =>
                    value!.isEmpty ? 'Required field' : null,
                onSaved: (value) => _category = value!,
              ),
              TextFormField(
                decoration: InputDecoration(labelText: 'Size'),
                validator: (value) =>
                    value!.isEmpty ? 'Required field' : null,
                onSaved: (value) => _size = value!,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _submitItem,
                child: Text('Save Item'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}