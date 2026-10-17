import 'package:flutter/material.dart';
import 'package:syrianzone/core/extensions/color_scheme_extensions.dart';
import 'package:syrianzone/core/widget/bump_animation.dart';
import 'package:syrianzone/feature/transit_cities/ui/transit_cities_grid_bloc.dart';

class TransitCitiesScreen extends StatelessWidget {
  const TransitCitiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(centerTitle: true, title: BumpyBusAnimation()),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                color: context.colorScheme.primary,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(8, 16, 8, 16),
                  child: Column(
                    children: [
                      Text(
                        "ترانزيت سوريا",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "دليل وخرائط تفاعلية لشبكات وخطوط المواصلات العامة والسرافيس في المدن السورية — يجمعها المجتمع ويحدّثها، ومتاحة للجميع مجاناً.",
                        style: TextStyle(color: Colors.white, fontSize: 16),
                        textAlign: TextAlign.right,
                      ),

                      const SizedBox(height: 16),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            spacing: 4,
                            children: [
                              Text(
                                "مدن جاهزة",
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                "١٢",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                          VerticalDivider(),
                          Row(
                            spacing: 4,

                            children: [
                              Text(
                                "خط سيرفيس",
                                style: TextStyle(
                                  color: Colors.grey,
                                  fontSize: 14,
                                ),
                              ),
                              Text(
                                "١١٩",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: TransitCitiesGridBloc(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
