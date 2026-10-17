import 'package:freezed_annotation/freezed_annotation.dart';

part 'city_route_response.g.dart';

@JsonSerializable()
class CityRouteResponse {
  final String id;
  final String cityId;
  final String nameAr;
  final String? nameEn;
  final int colorIndex;
  final int? priceOld;
  final int? priceNew;
  final int stopsCount;

  CityRouteResponse({
    required this.id,
    required this.cityId,
    required this.nameAr,
    this.nameEn,
    required this.colorIndex,
    this.priceOld,
    this.priceNew,
    required this.stopsCount,
  });

  factory CityRouteResponse.fromJson(Map<String, dynamic> json) =>
      _$CityRouteResponseFromJson(json);
}