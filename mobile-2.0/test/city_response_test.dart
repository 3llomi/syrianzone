import 'package:flutter_test/flutter_test.dart';
import 'package:syrianzone/core/network/response/city_response.dart';

void main() {
  test('CityResponse deserializes center [lng, lat] and bounds correctly', () {
    final rawJson = {
      'id': 'city-1',
      'nameAr': 'دمشق',
      'nameEn': 'Damascus',
      'status': 'active',
      'zoom': 12.5,
      'center': [36.297, 33.513], // List<dynamic> at runtime
      'bounds': [
        [36.2, 33.4],
        [36.4, 33.6],
      ],
      'routeCount': 5,
      'icon': {
        'viewBox': '0 0 24 24',
        'path': 'M0 0h24v24H0z',
      },
    };

    final city = CityResponse.fromJson(rawJson);

    expect(city.id, 'city-1');
    expect(city.center.longitude, 36.297);
    expect(city.center.latitude, 33.513);
    expect(city.bounds.length, 2);
    expect(city.bounds[0].longitude, 36.2);
    expect(city.bounds[0].latitude, 33.4);
    expect(city.bounds[1].longitude, 36.4);
    expect(city.bounds[1].latitude, 33.6);
  });

  test('Handles integer coordinates without casting error', () {
    final rawJson = {
      'id': 'city-2',
      'nameAr': 'دمشق',
      'nameEn': 'Damascus',
      'status': 'active',
      'zoom': 12,
      'center': [36, 33], // ints
      'bounds': [],
      'routeCount': 0,
      'icon': {
        'viewBox': '0 0 24 24',
        'path': 'M0 0h24v24H0z',
      },
    };

    final city = CityResponse.fromJson(rawJson);
    expect(city.center.longitude, 36.0);
    expect(city.center.latitude, 33.0);
    expect(city.bounds, isEmpty);
  });
}
