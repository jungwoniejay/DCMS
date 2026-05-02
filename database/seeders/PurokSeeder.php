<?php

namespace Database\Seeders;

use App\Models\Purok;
use Illuminate\Database\Seeder;

class PurokSeeder extends Seeder
{
    public function run(): void
    {
        $puroks = [
            // Asia
            'Asia | Purok 1',
            'Asia | Purok 2',
            'Asia | Purok Centro',
            'Asia | Purok Riverside',

            // Bacuyangan
            'Bacuyangan | Purok 1',
            'Bacuyangan | Purok 2',
            'Bacuyangan | Zone 1',
            'Bacuyangan | Zone 2',

            // Barangay I (Poblacion)
            'Barangay I (Poblacion) | Zone 1',
            'Barangay I (Poblacion) | Zone 2',
            'Barangay I (Poblacion) | Zone 3',
            'Barangay I (Poblacion) | Purok Proper',

            // Barangay II (Poblacion)
            'Barangay II (Poblacion) | Zone 1',
            'Barangay II (Poblacion) | Zone 2',
            'Barangay II (Poblacion) | Purok Market Area',

            // Bulwangan
            'Bulwangan | Purok 1',
            'Bulwangan | Purok 2',
            'Bulwangan | Purok Hillside',

            // Culipapa
            'Culipapa | Purok 1',
            'Culipapa | Purok 2',
            'Culipapa | Purok Coastal',

            // Daug
            'Daug | Purok 1',
            'Daug | Purok 2',
            'Daug | Zone Proper',

            // Damutan
            'Damutan | Purok 1',
            'Damutan | Purok 2',
            'Damutan | Purok Interior',

            // Pook
            'Pook | Purok 1',
            'Pook | Purok 2',
            'Pook | Zone 1',

            // Talacagay
            'Talacagay | Purok 1',
            'Talacagay | Purok 2',
            'Talacagay | Purok Proper',

            // Tuyom
            'Tuyom | Purok 1',
            'Tuyom | Purok 2',
            'Tuyom | Purok Riverside',
        ];

        foreach ($puroks as $name) {
            Purok::firstOrCreate(['name' => $name]);
        }
    }
}
