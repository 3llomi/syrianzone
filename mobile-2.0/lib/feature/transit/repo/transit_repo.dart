import 'package:syrianzone/core/network/api_service.dart';
import 'package:syrianzone/core/network/response/city_route_response.dart';
import 'package:syrianzone/core/network/api_result.dart';

class TransitRepo {
  final ApiService _apiService;
  TransitRepo(this._apiService);


  Future<ApiResult<List<CityRouteResponse>>> fetchRoutes(String cityId) async{
    try{
      final response = await _apiService.getTransitRoutes(cityId);
      return ApiResult.success(response);
    }catch(e){
      return ApiResult.error(e.toString());
    }
  }
}