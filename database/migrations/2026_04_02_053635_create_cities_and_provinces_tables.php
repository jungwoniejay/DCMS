<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('province_id')->nullable()->constrained('provinces')->onDelete('set null');
            $table->timestamps();
        });

        // Seed Philippine provinces
        $provinces = [
            'Metro Manila', 'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan',
            'Albay', 'Antique', 'Apayao', 'Aurora', 'Basilan', 'Bataan', 'Batanes',
            'Batangas', 'Benguet', 'Biliran', 'Bohol', 'Bukidnon', 'Bulacan',
            'Cagayan', 'Camarines Norte', 'Camarines Sur', 'Camiguin', 'Capiz',
            'Catanduanes', 'Cavite', 'Cebu', 'Compostela Valley', 'Cotabato',
            'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental',
            'Dinagat Islands', 'Eastern Samar', 'Guimaras', 'Ifugao', 'Ilocos Norte',
            'Ilocos Sur', 'Iloilo', 'Isabela', 'Kalinga', 'La Union', 'Laguna',
            'Lanao del Norte', 'Lanao del Sur', 'Leyte', 'Maguindanao', 'Marinduque',
            'Masbate', 'Misamis Occidental', 'Misamis Oriental', 'Mountain Province',
            'Negros Occidental', 'Negros Oriental', 'Northern Samar', 'Nueva Ecija',
            'Nueva Vizcaya', 'Occidental Mindoro', 'Oriental Mindoro', 'Palawan',
            'Pampanga', 'Pangasinan', 'Quezon', 'Quirino', 'Rizal', 'Romblon',
            'Samar', 'Sarangani', 'Siquijor', 'Sorsogon', 'South Cotabato',
            'Southern Leyte', 'Sultan Kudarat', 'Sulu', 'Surigao del Norte',
            'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Zambales', 'Zamboanga del Norte',
            'Zamboanga del Sur', 'Zamboanga Sibugay',
        ];

        foreach ($provinces as $province) {
            DB::table('provinces')->insert(['name' => $province, 'created_at' => now(), 'updated_at' => now()]);
        }

        // Seed Metro Manila cities/municipalities
        $metroManilaId = DB::table('provinces')->where('name', 'Metro Manila')->value('id');
        $metroManilaCities = [
            'Manila', 'Quezon City', 'Caloocan', 'Las Piñas', 'Makati',
            'Malabon', 'Mandaluyong', 'Marikina', 'Muntinlupa', 'Navotas',
            'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'San Juan',
            'Taguig', 'Valenzuela',
        ];
        foreach ($metroManilaCities as $city) {
            DB::table('cities')->insert(['name' => $city, 'province_id' => $metroManilaId, 'created_at' => now(), 'updated_at' => now()]);
        }

        // Seed some common cities per province
        $citiesData = [
            'Cebu'          => ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Danao', 'Toledo', 'Carcar', 'Naga'],
            'Davao del Sur' => ['Davao City', 'Digos', 'Mati'],
            'Bulacan'       => ['Malolos', 'Meycauayan', 'San Jose del Monte', 'Marilao', 'Bocaue', 'Balagtas'],
            'Cavite'        => ['Bacoor', 'Dasmariñas', 'Imus', 'Kawit', 'Tagaytay', 'Trece Martires', 'General Trias'],
            'Laguna'        => ['Santa Rosa', 'Biñan', 'San Pedro', 'Calamba', 'Los Baños', 'Sta. Cruz'],
            'Rizal'         => ['Antipolo', 'Cainta', 'Taytay', 'Angono', 'Binangonan', 'Morong'],
            'Pampanga'      => ['San Fernando', 'Angeles', 'Mabalacat', 'Guagua', 'Lubao'],
            'Batangas'      => ['Batangas City', 'Lipa', 'Tanauan', 'Sto. Tomas', 'Nasugbu'],
            'Iloilo'        => ['Iloilo City', 'Passi', 'Oton', 'Pavia', 'Santa Barbara'],
            'Negros Occidental' => ['Bacolod', 'Bago', 'Cadiz', 'Escalante', 'Himamaylan', 'Kabankalan', 'La Carlota', 'Sagay', 'San Carlos', 'Silay', 'Talisay'],
            'Pangasinan'    => ['Dagupan', 'San Carlos', 'Urdaneta', 'Alaminos', 'Lingayen'],
            'Cagayan'       => ['Tuguegarao', 'Aparri', 'Gonzaga', 'Lal-lo'],
            'Isabela'       => ['Ilagan', 'Cauayan', 'Santiago', 'Roxas'],
            'Albay'         => ['Legazpi', 'Ligao', 'Tabaco', 'Daraga'],
            'Camarines Sur' => ['Naga', 'Iriga', 'Pili', 'Libmanan'],
            'Misamis Oriental' => ['Cagayan de Oro', 'Gingoog', 'El Salvador', 'Villanueva'],
            'Bukidnon'      => ['Malaybalay', 'Valencia', 'Maramag', 'Quezon'],
            'Leyte'         => ['Tacloban', 'Ormoc', 'Baybay', 'Palo'],
            'Zamboanga del Sur' => ['Zamboanga City', 'Pagadian', 'Dipolog', 'Dapitan'],
            'Cotabato'      => ['Kidapawan', 'Cotabato City', 'Kabacan', 'Midsayap'],
            'South Cotabato'=> ['Koronadal', 'General Santos', 'Surallah', 'Tupi'],
            'Tarlac'        => ['Tarlac City', 'Capas', 'Concepcion', 'Paniqui'],
            'Zambales'      => ['Olongapo', 'Iba', 'San Antonio', 'Subic'],
            'Nueva Ecija'   => ['Cabanatuan', 'Gapan', 'Palayan', 'San Jose', 'Muñoz'],
            'Benguet'       => ['Baguio', 'La Trinidad', 'Itogon', 'Mankayan'],
        ];

        foreach ($citiesData as $provinceName => $cities) {
            $provinceId = DB::table('provinces')->where('name', $provinceName)->value('id');
            if ($provinceId) {
                foreach ($cities as $city) {
                    DB::table('cities')->insert(['name' => $city, 'province_id' => $provinceId, 'created_at' => now(), 'updated_at' => now()]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
        Schema::dropIfExists('provinces');
    }
};
