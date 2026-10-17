import 'package:bloc/bloc.dart';
import 'package:syrianzone/core/network/api_result.dart';
import 'transit_state.dart';
import '../repo/transit_repo.dart';

class TransitCubit extends Cubit<TransitState> {
  final TransitRepo _transitRepo;
  TransitCubit(this._transitRepo) : super(const TransitState.initial());

  void fetchRoutes(String cityId) async {
    emit(const TransitState.loading());
    final result = await _transitRepo.fetchRoutes(cityId.toString());
    result.when(
      success: (routes) => emit(TransitState.success(routes)),
      error: (message) => emit(TransitState.error(message)),
    );
  }
}
