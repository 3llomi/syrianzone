

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import 'package:syrianzone/core/constants/api_service_constants.dart';
import 'package:syrianzone/core/network/response/city_response.dart';

part 'api_service.g.dart';

@RestApi(baseUrl: ApiServiceConstants.baseUrl)
abstract class ApiService {
  factory ApiService(Dio dio) = _ApiService;

  @GET("cities")
  Future<List<CityResponse>> getTransitCities();
}