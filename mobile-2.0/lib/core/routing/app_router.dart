import 'package:flutter/material.dart';
import 'package:syrianzone/core/routing/routes.dart';
import 'package:syrianzone/feature/home/ui/home_screen.dart'; 

class AppRouter {
  Route? generateRoute(RouteSettings settings) {
    final arguments = settings.arguments;
    switch (settings.name) {
      case Routes.home:
        return MaterialPageRoute(
          builder: (_) => const HomeScreen(),
        );
      default:
        return null;
    }
  }
}
