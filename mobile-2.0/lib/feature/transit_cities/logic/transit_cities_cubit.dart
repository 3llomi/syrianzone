import 'package:bloc/bloc.dart';
import 'package:syrianzone/core/network/api_result.dart';
import 'package:syrianzone/core/network/response/city_response.dart';
import 'package:syrianzone/feature/transit_cities/repo/transit_cities_repo.dart';
import 'transit_cities_state.dart';

class TransitCitiesCubit extends Cubit<TransitCitiesState> {
  final TransitCitiesRepo _transitCitiesRepo;
  List<CityResponse> _allCities = const [];

  TransitCitiesCubit(this._transitCitiesRepo) : super(const TransitCitiesState.initial());

  void loadCities() async{
    emit(const TransitCitiesState.loading());
      // Fetch cities from the repository
      final result = await _transitCitiesRepo.fetchTransitCities();
      result.whenOrNull(
        success: (cities) {
          _allCities = cities;
          emit(TransitCitiesState.success(cities));
        },
        error: (message) => emit(TransitCitiesState.error(message)),
      );
      
  }

  void searchCities(String query) {
    final normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.isEmpty) {
      emit(TransitCitiesState.success(_allCities));
      return;
    }

    final filtered = _allCities.where((city) {
      final nameAr = city.nameAr.toLowerCase();
      final nameEn = city.nameEn.toLowerCase();
      return nameAr.contains(normalizedQuery) || nameEn.contains(normalizedQuery);
    }).toList();

    emit(TransitCitiesState.success(filtered));
  }
}