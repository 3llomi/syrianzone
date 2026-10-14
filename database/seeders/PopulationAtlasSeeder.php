<?php

namespace Database\Seeders;

use App\Models\Population\PopulationDemographic;
use App\Models\Population\PopulationRainfall;
use App\Models\Population\PopulationEnvironmentalLog;
use Illuminate\Database\Seeder;
use RuntimeException;
use stdClass;

class PopulationAtlasSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedDemographics();
        $this->seedRainfall();
        $this->seedEnvironmentalLogs();
    }

    private function seedDemographics(): void
    {
        $csvPath = storage_path('app/seed_data/population.csv');

        // The atlas has nothing to show without demographics, so a missing or
        // unreadable input is a hard failure (non-zero exit) rather than a
        // warning that leaves the tables empty while the seeder reports DONE.
        if (!file_exists($csvPath)) {
            throw new RuntimeException(
                "population.csv not found at {$csvPath}. It is tracked in storage/app/seed_data/; "
                .'restore it with `git checkout -- storage/app/seed_data/population.csv`.'
            );
        }

        $handle = fopen($csvPath, 'r');
        if ($handle === false) {
            throw new RuntimeException("Could not open {$csvPath}");
        }

        $header = fgetcsv($handle);
        if ($header === false) {
            fclose($handle);
            throw new RuntimeException("Could not read the CSV header from {$csvPath}");
        }

        $columnMap = array_flip($header);
        $rows = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $rows++;
            $rawDate = $row[$columnMap['date']];
            $dateValue = null;

            if ($rawDate !== 'unknown' && !empty($rawDate)) {
                if (preg_match('/^\d{4}$/', $rawDate)) {
                    $dateValue = $rawDate . '-01-01';
                } else {
                    $dateValue = $rawDate;
                }
            }

            $data = [
                'data_type' => $row[$columnMap['data_type']],
                'source_id' => (int) $row[$columnMap['source_id']],
                'source_url' => $row[$columnMap['source_url']],
                'date' => $dateValue,
                'note' => $row[$columnMap['note']],
                'city_name' => $row[$columnMap['city_name']],
                'value' => (int) str_replace(',', '', $row[$columnMap['population']]),
            ];

            PopulationDemographic::firstOrCreate(
                [
                    'data_type' => $data['data_type'],
                    'source_id' => $data['source_id'],
                    'city_name' => $data['city_name'],
                ],
                $data
            );
        }

        fclose($handle);

        if ($rows === 0) {
            throw new RuntimeException("{$csvPath} has a header but no data rows");
        }

        $this->command->info('Seeded demographics data');
    }

    private function seedRainfall(): void
    {
        $jsonPath = storage_path('app/seed_data/rainfall_yearly.json');

        // Optional input: it is not tracked, so the rainfall layer stays empty
        // until a developer supplies the file. Say so explicitly. See
        // docs/modules/population-atlas.md for the expected shape.
        if (!file_exists($jsonPath)) {
            $this->command->warn(
                'rainfall_yearly.json not found in storage/app/seed_data/: the rainfall layer will be empty '
                .'(see docs/modules/population-atlas.md).'
            );
            return;
        }

        $jsonContent = file_get_contents($jsonPath);

        // A file that is present but broken is a mistake, not an absent input.
        // Decode without the assoc flag first: with it, a JSON array and a JSON
        // object both become PHP arrays and can't be told apart.
        $decoded = json_decode($jsonContent);
        if (! $decoded instanceof stdClass || get_object_vars($decoded) === []) {
            throw new RuntimeException("Could not decode {$jsonPath} as a non-empty JSON object keyed by district code");
        }

        $data = json_decode($jsonContent, true);

        foreach ($data as $pcode => $years) {
            foreach ($years as $yearData) {
                PopulationRainfall::firstOrCreate(
                    [
                        'pcode' => $pcode,
                        'year' => $yearData['year'],
                    ],
                    [
                        'rainfall' => (float) $yearData['rainfall'],
                        'rainfall_avg' => (float) $yearData['rainfall_avg'],
                    ]
                );
            }
        }

        $this->command->info('Seeded rainfall data');
    }

    private function seedEnvironmentalLogs(): void
    {
        $cities = [
            ['name' => 'Damascus', 'lat' => 33.51, 'lon' => 36.29, 'population' => 2103000],
            ['name' => 'Aleppo', 'lat' => 36.20, 'lon' => 37.16, 'population' => 4118000],
            ['name' => 'Idlib', 'lat' => 35.933, 'lon' => 36.633, 'population' => 1172000],
            ['name' => 'Rif Dimashq', 'lat' => 33.5, 'lon' => 37.3833, 'population' => 3372000],
            ['name' => 'Homs', 'lat' => 34.73, 'lon' => 36.72, 'population' => 1790000],
            ['name' => 'Hama', 'lat' => 35.13, 'lon' => 36.76, 'population' => 2147000],
            ['name' => 'Daraa', 'lat' => 32.6264, 'lon' => 36.1033, 'population' => 966000],
            ['name' => 'Latakia', 'lat' => 35.53, 'lon' => 35.79, 'population' => 1346000],
            ['name' => 'Deir ez-Zor', 'lat' => 35.34, 'lon' => 40.14, 'population' => 1267000],
            ['name' => 'Quneitra', 'lat' => 33.0776, 'lon' => 35.8934, 'population' => 124000],
            ['name' => 'Raqqa', 'lat' => 35.95, 'lon' => 39.01, 'population' => 940000],
            ['name' => 'Al-Hasakah', 'lat' => 36.5079, 'lon' => 40.7463, 'population' => 1865000],
            ['name' => 'Tartus', 'lat' => 34.89, 'lon' => 35.89, 'population' => 1172000],
            ['name' => 'As-Suwayda', 'lat' => 32.709, 'lon' => 36.5695, 'population' => 540000],
        ];

        $yesterday = now()->subDay();

        foreach ($cities as $city) {
            PopulationEnvironmentalLog::updateOrCreate(
                ['city_name' => $city['name']],
                [
                    'lat' => $city['lat'],
                    'lon' => $city['lon'],
                    'population_ref' => $city['population'],
                    'current_conditions' => [],
                    'forecast_summary' => [],
                    'climate_trends' => [],
                    'air_quality' => [],
                    'drought_risk' => [],
                    'historical_summary' => [],
                    'last_updated_at' => $yesterday,
                ]
            );
        }

        $this->command->info('Seeded environmental logs for 14 cities');
    }
}
