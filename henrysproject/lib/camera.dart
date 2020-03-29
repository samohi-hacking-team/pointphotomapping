import 'dart:async';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;



class CameraPage extends StatefulWidget {
  final storage;

  const CameraPage(this.storage) ;
  @override
  _CameraPageState createState() => _CameraPageState();
}

class _CameraPageState extends State<CameraPage> {
  File _image;
String kTestString = 'Hello world!';

  Future getImage() async {
    File image = await ImagePicker.pickImage(source: ImageSource.camera);
    _uploadFile(image);
    setState(() {
      _image = image;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text('Point Photo Mapping'),
      ),
      body: Center(
        child: _image == null
            ? Text('This application helps organize shot')
            : Image.file(_image),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: getImage,
        tooltip: 'Pick Image',
        child: Icon(Icons.add_a_photo),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
_uploadFile(File file) async {
    final String uuid = "cool";
    final Directory systemTempDir = Directory.systemTemp;
    //final File file = await File('${systemTempDir.path}/foo$uuid.txt').create();
    await file.writeAsString(kTestString);
    assert(await file.readAsString() == kTestString);
    final StorageReference ref =
        widget.storage.ref().child('text').child('foo$uuid.txt');
    final StorageUploadTask uploadTask = ref.putFile(
      file,
      StorageMetadata(
        contentLanguage: 'en',
        customMetadata: <String, String>{'activity': 'test'},
      ),
    );
}Future<void> _downloadFile(StorageReference ref) async {
    final String url = await ref.getDownloadURL();
    final String uuid = "cool";
    final http.Response downloadData = await http.get(url);
    final Directory systemTempDir = Directory.systemTemp;
    final File tempFile = File('${systemTempDir.path}/tmp$uuid.txt');
    if (tempFile.existsSync()) {
      await tempFile.delete();
    }
}}