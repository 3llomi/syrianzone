import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';
import 'package:syrianzone/core/bloc/safe_emit_mixin.dart';
import 'package:syrianzone/core/network/api_result.dart';
import 'package:syrianzone/core/network/response/city_response.dart';
import 'package:syrianzone/feature/transit/repo/transit_repo.dart';
import 'package:syrianzone/feature/transit_studio/data/model/studio_stop.dart';
import 'package:syrianzone/feature/transit_studio/data/model/studio_tool_mode.dart';
import 'transit_studio_state.dart';

class TransitStudioCubit extends Cubit<TransitStudioState>
    with SafeEmit<TransitStudioState> {
  final TransitRepo _transitRepo;
  // Text controllers owned by Cubit
  final TextEditingController nameArController = TextEditingController();
  final TextEditingController nameEnController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController notesController = TextEditingController();

  TransitStudioCubit(this._transitRepo) : super(TransitStudioState.initial());

  
  Future<void> loadCities() async {
    safeEmit(state.copyWith(isLoadingCities: true, errorMessage: null));

    // Simulated short delay ready for real API call with shimmer

    final citiesResult = await _transitRepo.getTransitCities();

    citiesResult.whenOrNull(
      success: (cities) {
        final initialCity = cities.first;
        safeEmit(
          state.copyWith(
            isLoadingCities: false,
            cities: cities,
            selectedCity: initialCity,
          ),
        );
      },
      error: (error) {
        safeEmit(state.copyWith(isLoadingCities: false, errorMessage: error));
      },
    );
  }

  void selectCity(CityResponse city) {
    safeEmit(state.copyWith(selectedCity: city));
  }

  void setToolMode(StudioToolMode mode) {
    safeEmit(
      state.copyWith(
        activeTool: mode,
        selectedPointIndex: mode == StudioToolMode.movePoint
            ? state.selectedPointIndex
            : null,
      ),
    );
  }

  void addRoadPoint(GeoPoint point) {
    final updated = List<GeoPoint>.from(state.roadPoints)..add(point);
    safeEmit(state.copyWith(roadPoints: updated));
  }

  void selectPointToMove(int index) {
    if (index < 0 || index >= state.roadPoints.length) return;
    safeEmit(
      state.copyWith(
        selectedPointIndex: index,
        activeTool: StudioToolMode.movePoint,
      ),
    );
  }

  void cancelMovePoint() {
    safeEmit(
      state.copyWith(
        selectedPointIndex: null,
        activeTool: StudioToolMode.drawRoad,
      ),
    );
  }

  void moveSelectedPoint(GeoPoint newPoint) {
    final idx = state.selectedPointIndex;
    if (idx == null || idx >= state.roadPoints.length) return;

    final updated = List<GeoPoint>.from(state.roadPoints);
    updated[idx] = newPoint;

    safeEmit(
      state.copyWith(
        roadPoints: updated,
        selectedPointIndex: null,
        activeTool: StudioToolMode.drawRoad,
        successMessage: 'تم نقل النقطة بنجاح',
      ),
    );
  }

  void undoLastRoadPoint() {
    if (state.roadPoints.isEmpty) return;
    final updated = List<GeoPoint>.from(state.roadPoints)..removeLast();
    safeEmit(state.copyWith(roadPoints: updated));
  }

  void clearRoadPoints() {
    safeEmit(
      state.copyWith(
        roadPoints: const [],
        selectedPointIndex: null,
        activeTool:
            (state.activeTool == StudioToolMode.drawRoad ||
                state.activeTool == StudioToolMode.movePoint)
            ? StudioToolMode.none
            : state.activeTool,
      ),
    );
  }

  void addStop(GeoPoint point) {
    final newStop = StudioStop(
      id: DateTime.now().millisecondsSinceEpoch,
      position: point,
      name: '',
    );

    final updatedStops = List<StudioStop>.from(state.stops)..add(newStop);
    safeEmit(state.copyWith(stops: updatedStops));
  }

  void removeStop(int index) {
    if (index < 0 || index >= state.stops.length) return;

    final updatedStops = List<StudioStop>.from(state.stops);
    final removed = updatedStops.removeAt(index);
    removed.dispose();

    safeEmit(state.copyWith(stops: updatedStops));
  }

  void setSelectedColorIndex(int index) {
    safeEmit(state.copyWith(selectedColorIndex: index));
  }

  void clearMessages() {
    safeEmit(
      state.copyWith(
        errorMessage: null,
        successMessage: null,
        expandSectionIndex: null,
      ),
    );
  }

  bool validateAndSubmit() {
    // 1. Validate Arabic route name
    if (nameArController.text.trim().isEmpty) {
      safeEmit(
        state.copyWith(
          errorMessage: 'يرجى إدخال اسم المسار بالعربية أولاً',
          expandSectionIndex: 4,
        ),
      );
      return false;
    }

    // 2. Validate road points count
    if (state.roadPoints.length < 2) {
      safeEmit(
        state.copyWith(
          errorMessage: 'يرجى رسم نقطتين على الأقل لمسار الخط',
          expandSectionIndex: 1,
        ),
      );
      return false;
    }

    // 3. Validate stops names
    bool hasEmptyStop = false;
    int firstEmptyIndex = -1;
    for (int i = 0; i < state.stops.length; i++) {
      if (state.stops[i].controller.text.trim().isEmpty) {
        state.stops[i].hasError = true;
        hasEmptyStop = true;
        if (firstEmptyIndex == -1) {
          firstEmptyIndex = i;
        }
      } else {
        state.stops[i].hasError = false;
      }
    }

    if (hasEmptyStop) {
      safeEmit(
        state.copyWith(
          stops: List<StudioStop>.from(state.stops),
          errorMessage:
              'يرجى كتابة اسم لجميع المحطات المضافة (المحطة رقم ${firstEmptyIndex + 1} فارغة)',
          expandSectionIndex: 2,
        ),
      );
      return false;
    }

    //TODO In future: Call API service here with isSubmitting: true
    safeEmit(
      state.copyWith(
        errorMessage: null,
        successMessage:
            'تم استلام المسار "${nameArController.text.trim()}" بنجاح (وضع تجريبي)!',
      ),
    );
    return true;
  }

  void resetAll() {
    for (final stop in state.stops) {
      stop.dispose();
    }

    nameArController.clear();
    nameEnController.clear();
    priceController.clear();
    notesController.clear();

    safeEmit(
      state.copyWith(
        roadPoints: const [],
        stops: const [],
        selectedPointIndex: null,
        activeTool: StudioToolMode.none,
        selectedColorIndex: 0,
        expandSectionIndex: 0,
        successMessage: 'تمت إعادة ضبط جميع البيانات بنجاح',
      ),
    );
  }

  @override
  Future<void> close() {
    nameArController.dispose();
    nameEnController.dispose();
    priceController.dispose();
    notesController.dispose();
    for (final stop in state.stops) {
      stop.dispose();
    }
    return super.close();
  }
}
