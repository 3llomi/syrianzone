

import 'package:retrofit/http.dart';
import 'package:syrianzone/core/constants/api_service_constants.dart';

@RestApi(baseUrl: ApiServiceConstants.baseUrl)
abstract class ApiService {

  @GET("cities")
  Future<List<dynamic>> getTransitCities();
}