import 'package:syrianzone/core/network/api_service.dart';
import 'package:syrianzone/core/network/api_result.dart';
import 'package:syrianzone/core/network/response/city_response.dart';

class TransitCitiesRepo {
  final ApiService _apiService;

  TransitCitiesRepo(this._apiService);

  Future<ApiResult<List<CityResponse>>> fetchTransitCities() async {
    try {
      final cities = await _apiService.getTransitCities();
      return ApiResult.success(cities);
    } catch (e) {
      print('Error fetching transit cities: $e');
      //TODO: HANDLE ERROR MESSAGES
      return ApiResult.error(e.toString());
    }
  }
}
