// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'city_route_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CityRouteResponse _$CityRouteResponseFromJson(Map<String, dynamic> json) =>
    CityRouteResponse(
      id: json['id'] as String,
      cityId: json['cityId'] as String,
      nameAr: json['nameAr'] as String,
      nameEn: json['nameEn'] as String?,
      colorIndex: (json['colorIndex'] as num).toInt(),
      priceOld: (json['priceOld'] as num?)?.toInt(),
      priceNew: (json['priceNew'] as num?)?.toInt(),
      stopsCount: (json['stopsCount'] as num).toInt(),
    );

Map<String, dynamic> _$CityRouteResponseToJson(CityRouteResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'cityId': instance.cityId,
      'nameAr': instance.nameAr,
      'nameEn': instance.nameEn,
      'colorIndex': instance.colorIndex,
      'priceOld': instance.priceOld,
      'priceNew': instance.priceNew,
      'stopsCount': instance.stopsCount,
    };
