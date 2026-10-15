import 'package:flutter/material.dart';
import 'package:syrianzone/core/di/get_it.dart';
import 'package:syrianzone/core/routing/app_router.dart';
import 'package:syrianzone/core/routing/routes.dart';
import 'package:syrianzone/core/theme/app_theme.dart';
import 'package:syrianzone/core/widget/splash.dart';
import 'package:syrianzone/feature/home/ui/home_screen.dart';

void main() {
  setupGetIt();
  runApp(MyApp(appRouter: AppRouter()));
}

class MyApp extends StatelessWidget {
  final AppRouter appRouter;
  const MyApp({super.key, required this.appRouter});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Syrian Zone',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      initialRoute: Routes.splash,
      onGenerateRoute: appRouter.generateRoute,
      
    );
  }
}
