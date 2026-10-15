import 'package:flutter/material.dart';
import 'package:syrianzone/core/widget/bump_animation.dart';

class TransitScreen extends StatelessWidget {
  const TransitScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(centerTitle: true, title: BumpyBusAnimation()),
      body: const SafeArea(child: Center(child: Text('Transit Screen'))),
    );
  }
}
