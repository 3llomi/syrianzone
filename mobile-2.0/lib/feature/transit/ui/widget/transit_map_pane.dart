import 'package:flutter/material.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';
import 'package:syrianzone/core/constants/route_palette.dart';
import 'package:syrianzone/core/network/response/map_data_response.dart';
import 'package:syrianzone/core/util/color_util.dart';
import 'package:syrianzone/core/util/map_util.dart';
import 'package:syrianzone/feature/transit/ui/widget/nearby_stops_bottom_sheet.dart';

class TransitMapPane extends StatefulWidget {
  const TransitMapPane({
    super.key,
    this.latitude,
    this.longitude,
    this.zoom,
    this.mapData,
    this.selectedRouteId,
  });

  final double? latitude;
  final double? longitude;
  final double? zoom;
  final MapDataResponse? mapData;
  final String? selectedRouteId;

  @override
  State<TransitMapPane> createState() => _TransitMapPaneState();
}

class _TransitMapPaneState extends State<TransitMapPane> {
  static const _fallbackLat = 33.5138;
  static const _fallbackLon = 36.2765;

  late final MapController _mapController;
  final List<GeoPoint> _drawnMarkers = <GeoPoint>[];
  final Map<String, MapStopFeature> _stopsByLocation =
      <String, MapStopFeature>{};
  MapStopFeature? _selectedStop;
  GeoPoint? _selectedGeoPoint;
  bool _isMapReady = false;
  String? _lastRenderedSignature;

  final _tileLayer = CustomTile(
    urlsServers: List<TileURLs>.of([
      TileURLs(
        url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ),
    ]),
    tileExtension: 'png',
    sourceName: 'Carto Streets',
  );

  @override
  void initState() {
    super.initState();
    final lat = widget.latitude ?? _fallbackLat;
    final lon = widget.longitude ?? _fallbackLon;

    _mapController = MapController.withPosition(
      initPosition: GeoPoint(latitude: lat, longitude: lon),
    );
  }

  @override
  void didUpdateWidget(covariant TransitMapPane oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.mapData != oldWidget.mapData ||
        widget.selectedRouteId != oldWidget.selectedRouteId) {
      if (_selectedStop != null) {
        setState(() {
          _selectedStop = null;
          _selectedGeoPoint = null;
        });
      }
      _renderMapDataIfReady();
    }
  }

  String _buildDataSignature(MapDataResponse data) {
    final selectedRouteId = widget.selectedRouteId ?? '';
    final routeIds = data.routes.features
        .map((route) => route.properties.id)
        .join('|');
    return '$selectedRouteId::$routeIds::${data.stops.features.length}';
  }

  Future<void> _renderMapDataIfReady() async {
    if (!_isMapReady || widget.mapData == null) {
      return;
    }

    final data = widget.mapData!;
    final signature = _buildDataSignature(data);
    if (signature == _lastRenderedSignature) {
      return;
    }

    _lastRenderedSignature = signature;

    try {
      await _mapController.clearAllRoads();
      if (_drawnMarkers.isNotEmpty) {
        await _mapController.removeMarkers(_drawnMarkers);
        _drawnMarkers.clear();
      }

      final selectedRouteId = widget.selectedRouteId;
      final routeFeatures = selectedRouteId == null
          ? data.routes.features
          : data.routes.features
                .where((route) => route.properties.id == selectedRouteId)
                .toList();

      final stopFeatures = selectedRouteId == null
          ? data.stops.features
          : data.stops.features
                .where(
                  (stop) => stop.properties.routeIds.contains(selectedRouteId),
                )
                .toList();

      final roadDrawFutures = <Future<void>>[];
      for (final routeFeature in routeFeatures) {
        if (routeFeature.geometry.type != 'LineString') {
          continue;
        }
        final points = routeFeature.geometry.coordinates
            .where((coordinate) => coordinate.length >= 2)
            .map(
              (coordinate) =>
                  GeoPoint(latitude: coordinate[1], longitude: coordinate[0]),
            )
            .toList();

        if (points.length < 2) {
          continue;
        }

        final roadColor = ColorUtil.hexToColor(
          RoutePalette.colorForIndexOrDefault(
            routeFeature.properties.colorIndex,
          ),
        );

        roadDrawFutures.add(
          _mapController.drawRoadManually(
            points,
            RoadOption(roadColor: roadColor, roadWidth: 6),
          ),
        );
      }
      await Future.wait(roadDrawFutures);

      _stopsByLocation.clear();
      final markerAddFutures = <Future<void>>[];
      for (final stopFeature in stopFeatures) {
        if (stopFeature.geometry.type != 'Point') {
          continue;
        }
        final coordinate = stopFeature.geometry.coordinates;
        if (coordinate.length < 2) {
          continue;
        }

        final centerPoint = GeoPoint(
          latitude: coordinate[1],
          longitude: coordinate[0],
        );
        _drawnMarkers.add(centerPoint);
        _stopsByLocation['${centerPoint.latitude.toStringAsFixed(5)},${centerPoint.longitude.toStringAsFixed(5)}'] =
            stopFeature;

        markerAddFutures.add(
          _mapController.addMarker(
            centerPoint,
            markerIcon: MarkerIcon(
              iconWidget: Stack(
                alignment: Alignment.center,
                children: const [
                  Icon(
                    Icons.circle,
                    size: 24.0, // Slightly larger background icon
                    color: Colors.white, // This mimics the border color
                  ),
                  Icon(
                    Icons.circle,
                    size: 20.0, // Actual foreground icon
                    color: Colors.amber,
                  ),
                ],
              ),
            ),
          ),
        );
      }
      await Future.wait(markerAddFutures);
    } catch (_) {
      // Ignore map drawing errors to keep list UI responsive.
    }
  }

  //TODO THIS IS NOT GETTING TRIGGERED ALL TIME
  void _handleGeoPointClicked(GeoPoint clickedPoint) {
    print('Clicked point: ${clickedPoint.latitude}, ${clickedPoint.longitude}');
    final key =
        '${clickedPoint.latitude.toStringAsFixed(5)},${clickedPoint.longitude.toStringAsFixed(5)}';
    MapStopFeature? matched = _stopsByLocation[key];
    print('Matched stop for key $key: $matched');

    if (matched != null) {
      setState(() {
        _selectedStop = matched;
        _selectedGeoPoint = clickedPoint;
      });
    }
  }

  String _getRouteLabel(MapStopFeature stop) {
    final stopRouteIds = stop.properties.routeIds;
    if (widget.selectedRouteId != null &&
        stopRouteIds.contains(widget.selectedRouteId)) {
      return 'مسار ${widget.selectedRouteId}';
    }
    if (stopRouteIds.isNotEmpty) {
      return 'مسار ${stopRouteIds.first}';
    }
    return '';
  }

  Color _getRouteColor(MapStopFeature stop) {
    const fallbackColor = Color(0xFFA33838);
    final stopRouteIds = stop.properties.routeIds;
    final targetRouteId =
        (widget.selectedRouteId != null &&
            stopRouteIds.contains(widget.selectedRouteId))
        ? widget.selectedRouteId!
        : (stopRouteIds.isNotEmpty ? stopRouteIds.first : null);

    if (targetRouteId != null && widget.mapData != null) {
      for (final route in widget.mapData!.routes.features) {
        if (route.properties.id == targetRouteId) {
          return ColorUtil.hexToColor(
            RoutePalette.colorForIndexOrDefault(route.properties.colorIndex),
          );
        }
      }
    }
    return fallbackColor;
  }

  Widget _buildStopCard(MapStopFeature stop) {
    final bannerColor = _getRouteColor(stop);
    final routeLabel = _getRouteLabel(stop);

    return Material(
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE4D8C8)),
      ),
      elevation: 6,
      shadowColor: const Color(0x33000000),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          if (_selectedGeoPoint != null) {
            MapUtil.openMapApp(
              _selectedGeoPoint!.latitude,
              _selectedGeoPoint!.longitude,
              label: stop.properties.nameAr,
            );
          }
        },
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    stop.properties.nameAr,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF2F2722),
                    ),
                  ),
                  if (routeLabel.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: bannerColor,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        routeLabel,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Positioned(
              top: 8,
              left: 8,
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedStop = null;
                    _selectedGeoPoint = null;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEDE6DD),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.close,
                    size: 16,
                    color: Color(0xFF5A4D41),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNearbyButton() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE4D8C8)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x22000000),
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(24),
          onTap: () {
            NearbyStopsBottomSheet.show(
              context,
              onStopSelected: (stop) async {
                Navigator.pop(context);
                if (stop.coordinates.length >= 2) {
                  final target = GeoPoint(
                    latitude: stop.coordinates[1],
                    longitude: stop.coordinates[0],
                  );
                  await _mapController.moveTo(target);
                  _handleGeoPointClicked(target);
                }
              },
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              textDirection: TextDirection.rtl,
              children: const [
                Icon(
                  Icons.near_me_rounded,
                  color: Color(0xFFC4862E),
                  size: 20,
                ),
                SizedBox(width: 6),
                Text(
                  'المواقف القريبة',
                  style: TextStyle(
                    color: Color(0xFF2F2722),
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        OSMFlutter(
          controller: _mapController,
          onMapIsReady: (isReady) {
            _isMapReady = isReady;
            if (isReady) {
              //TODO Enable once we get an API key.
              // _mapController.changeTileLayer(
              //   tileLayer: _tileLayer
              // );
              _renderMapDataIfReady();
            }
          },
          mapIsLoading: const Center(
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          onGeoPointClicked: _handleGeoPointClicked,
          osmOption: OSMOption(
            showZoomController: true,
            zoomOption: ZoomOption(initZoom: widget.zoom ?? 15),
          ),
        ),
        Positioned(
          bottom: _selectedStop != null ? 140 : 16,
          left: 16,
          child: _buildNearbyButton(),
        ),
        if (_selectedStop != null)
          Positioned(
            bottom: 16,
            left: 20,
            right: 20,
            child: _buildStopCard(_selectedStop!),
          ),
      ],
    );
  }
}
