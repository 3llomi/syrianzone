import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:syrianzone/core/network/dio_factory.dart';

final getIt = GetIt.instance;

void setupGetIt() {
  getIt.registerSingleton<Dio>(DioFactory().dio);
}
