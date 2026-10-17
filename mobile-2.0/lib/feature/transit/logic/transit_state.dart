
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:syrianzone/core/network/response/city_route_response.dart';

part 'transit_state.freezed.dart';


@freezed
class TransitState with _$TransitState {
  
  const factory TransitState.initial() = _Initial;
  const factory TransitState.loading() = Loading;
  const factory TransitState.success(List<CityRouteResponse> routes) = Success;
  const factory TransitState.error(String message) = Error;

}