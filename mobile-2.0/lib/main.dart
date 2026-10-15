import 'package:flutter/material.dart';
import 'package:syrianzone/core/di/get_it.dart';
import 'package:syrianzone/core/routing/app_router.dart';
import 'package:syrianzone/core/routing/routes.dart';

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
      theme: ThemeData(colorScheme: .fromSeed(seedColor: Colors.deepPurple)),
      initialRoute: Routes.home,
      onGenerateRoute: appRouter.generateRoute,
    );
  }
}
