import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:syrianzone/core/constants/route_palette.dart';
import 'package:shimmer/shimmer.dart';
import 'package:syrianzone/core/network/response/city_route_response.dart';
import 'package:syrianzone/core/util/color_util.dart';
import 'package:syrianzone/core/util/text_util.dart';
import 'package:syrianzone/feature/transit/logic/transit_cubit.dart';
import 'package:syrianzone/feature/transit/logic/transit_state.dart';

class TransitScreen extends StatelessWidget {
  final String cityId;
  final String cityName;
  const TransitScreen({super.key, required this.cityId, required this.cityName});

  static const _cardBackground = Color(0xFFFCFCFC);
  static const _cardBorder = Color(0xFFE4D8C8);
  static const _titleColor = Color(0xFF2F2722);
  static const _metaColor = Color(0xFF8D7E6E);
  static const _priceBg = Color(0xFFF3ECE3);
  static const _priceText = Color(0xFFAF6F17);




  @override
  Widget build(BuildContext context) {
    
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        
        title: BlocBuilder<TransitCubit, TransitState>(
          builder: (context, state) {
            return state.maybeWhen(
              success: (routes) => _TransitAppBarTitle(
                title: cityName,
                subtitle: '${TextUtil.toArabicDigits(routes.length)} خط سيرفيس',
              ),
              orElse: () => _TransitAppBarTitle(
                title: cityName,
                subtitle: '',
              ),
            );
          },
        ),
      ),
      body: SafeArea(
        child: BlocBuilder<TransitCubit, TransitState>(
          builder: (context, state) {
            return state.maybeWhen(
              orElse: () => const SizedBox.shrink(),
              loading: () => const _TransitLoadingList(),
              success: (routes) {
                if (routes.isEmpty) {
                  return const Center(child: Text('لا توجد خطوط متاحة حالياً'));
                }
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
                  itemCount: routes.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (context, index) =>
                      _RouteCard(route: routes[index]),
                );
              },
              error: (message) => Center(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(message, textAlign: TextAlign.center),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: cityId.isEmpty
                            ? null
                            : () => context
                                .read<TransitCubit>()
                                .fetchRoutes(cityId),
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  
}

class _TransitAppBarTitle extends StatelessWidget {
  const _TransitAppBarTitle({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          title,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w700,
            color: TransitScreen._titleColor,
          ),
        ),
        Text(
          subtitle,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: TransitScreen._metaColor,
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}

class _RouteCard extends StatelessWidget {
  const _RouteCard({required this.route});

  final CityRouteResponse route;



  String _stopsCountLabel(int count) {
    final n = count.abs();

    if (n == 0) {
      return 'لا توجد مواقف';
    }
    if (n == 1) {
      return 'موقف واحد';
    }
    if (n == 2) {
      return 'موقفان';
    }
    if (n >= 3 && n <= 10) {
      return '${TextUtil.toArabicDigits(n)} مواقف';
    }
  
    return '${TextUtil.toArabicDigits(n)} موقف';
  }

  @override
  Widget build(BuildContext context) {
    final stripeColor = ColorUtil.hexToColor(
      RoutePalette.colorForIndexOrDefault(route.colorIndex),
    );

    final fareValue = route.priceNew ?? 0;
    final fareLabel = '${TextUtil.toArabicDigits(fareValue)} ل.س';

    return Material(
      color: TransitScreen._cardBackground,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: TransitScreen._cardBorder),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {},
        splashColor: const Color(0x22000000),
        highlightColor: const Color(0x11000000),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 18, 22, 16),
              child: Column(
                children: [
                  Align(
                    alignment: Alignment.centerRight,
                    child: Text(
                      route.nameAr,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                        color: TransitScreen._titleColor,
                        fontWeight: FontWeight.w700,
                        fontSize: 18,
                        height: 1.25,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    textDirection: TextDirection.rtl,
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 20,
                        color: TransitScreen._metaColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _stopsCountLabel(route.stopsCount),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: TransitScreen._metaColor,
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          '•',
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFFC8BEB2),
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: TransitScreen._priceBg,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Text(
                          fareLabel,
                          style: const TextStyle(
                            color: TransitScreen._priceText,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Positioned(
              top: 0,
              bottom: 0,
              right: 0,
              child: Container(
                width: 8,
                decoration: BoxDecoration(
                  color: stripeColor,
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TransitLoadingList extends StatelessWidget {
  const _TransitLoadingList();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
      itemCount: 5,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        final stripeColor = ColorUtil.hexToColor(
          RoutePalette.colorForIndexOrDefault(index),
        );
        return ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: TransitScreen._cardBackground,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: TransitScreen._cardBorder),
                ),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(18, 18, 22, 16),
                  child: Shimmer.fromColors(
                    baseColor: const Color(0xFFF1ECE3),
                    highlightColor: const Color(0xFFF8F5EF),
                    child: Column(
                      children: [
                        Container(
                          height: 52,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        const SizedBox(height: 10),
                        Align(
                          alignment: Alignment.centerRight,
                          child: Container(
                            height: 22,
                            width: 160,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 0,
                bottom: 0,
                right: 0,
                child: Container(
                  width: 8,
                  decoration: BoxDecoration(
                    color: stripeColor,
                    borderRadius: const BorderRadius.only(
                      topRight: Radius.circular(24),
                      bottomRight: Radius.circular(24),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
}

  }
