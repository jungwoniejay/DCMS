<?php

namespace Database\Seeders;

use App\Models\Child;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChildSeeder extends Seeder
{
    public function run(): void
    {
        $parent1 = User::where('email', 'parent@brgy2dms.com')->first();
        
        $child1 = Child::create([
            'guardian_id' => $parent1->id,
            'last_name' => 'Dela Cruz',
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'sex' => 'Male',
            'birthdate' => '2020-05-15',
            'age' => 4,
            'address' => 'Purok 1, Barangay San Jose, Manila',
            'first_language' => 'Tagalog',
            'second_language' => 'English',
            'registration_status' => 'Approved',
            'accomplished_by' => 'Maria Dela Cruz',
            'reviewed_by' => 'CDC Staff',
        ]);

        $child1->guardians()->create([
            'name' => 'Maria Dela Cruz',
            'relationship' => 'Mother',
            'email' => 'maria.delacruz@email.com',
            'occupation' => 'Teacher',
            'address' => 'Purok 1, Barangay San Jose, Manila',
            'mobile_phone' => '09171234567',
        ]);

        $child1->guardians()->create([
            'name' => 'Pedro Dela Cruz',
            'relationship' => 'Father',
            'email' => 'pedro.delacruz@email.com',
            'occupation' => 'Engineer',
            'address' => 'Purok 1, Barangay San Jose, Manila',
            'mobile_phone' => '09187654321',
        ]);

        $child1->emergencyContacts()->create([
            'name' => 'Rosa Santos',
            'relationship' => 'Grandmother',
            'mobile_phone' => '09191234567',
        ]);

        $child1->fatherProfile()->create([
            'last_name' => 'Dela Cruz',
            'first_name' => 'Pedro',
            'middle_initial' => 'M',
            'date_of_birth' => '1985-03-20',
            'age' => 39,
            'civil_status' => 'Married',
            'district' => 'District 1',
            'purok_zone' => 'Purok 1',
            'mother_tongue' => 'Tagalog',
            'educational_attainment' => 'College',
            'occupational_status' => 'Employed',
        ]);

        $child1->motherProfile()->create([
            'last_name' => 'Dela Cruz',
            'first_name' => 'Maria',
            'middle_initial' => 'S',
            'date_of_birth' => '1987-07-10',
            'age' => 37,
            'civil_status' => 'Married',
            'district' => 'District 1',
            'purok_zone' => 'Purok 1',
            'mother_tongue' => 'Tagalog',
            'educational_attainment' => 'College',
            'occupational_status' => 'Employed',
            'pregnant' => false,
        ]);

        $child1->familyProfile()->create([
            'purok_zone' => 'Purok 1',
            'home_ownership' => 'Owned',
            'home_materials' => 'Concrete',
            'multiple_rooms' => true,
            'has_toilet' => true,
            'has_bedroom' => true,
            'has_dining' => true,
            'has_sala' => true,
            'has_kitchen' => true,
            'running_water' => true,
            'electricity' => true,
            'mobile_phone' => true,
            'tv' => true,
            'books' => true,
            'storybooks' => true,
            'toys' => true,
        ]);

        $child1->childDetails()->create([
            'birth_order' => 1,
            'registered' => true,
            'born_at' => 'Hospital',
            'height' => 105.5,
            'weight' => 18.2,
            'eccd_card' => true,
            'mother_child_book' => true,
            'bcg' => 'Yes',
            'dpt' => 'Yes',
            'oral_polio' => 'Yes',
            'hepa_b' => 'Yes',
            'measles' => 'Yes',
            'left_handed' => false,
        ]);

        $child2 = Child::create([
            'guardian_id' => $parent1->id,
            'last_name' => 'Reyes',
            'first_name' => 'Ana',
            'middle_name' => 'Lopez',
            'sex' => 'Female',
            'birthdate' => '2021-02-20',
            'age' => 3,
            'address' => 'Purok 2, Barangay San Jose, Manila',
            'first_language' => 'Tagalog',
            'registration_status' => 'Pending',
            'accomplished_by' => 'Carmen Reyes',
        ]);

        $child2->guardians()->create([
            'name' => 'Carmen Reyes',
            'relationship' => 'Mother',
            'email' => 'carmen.reyes@email.com',
            'occupation' => 'Nurse',
            'address' => 'Purok 2, Barangay San Jose, Manila',
            'mobile_phone' => '09171112222',
        ]);

        $child3 = Child::create([
            'guardian_id' => $parent1->id,
            'last_name' => 'Garcia',
            'first_name' => 'Miguel',
            'middle_name' => 'Torres',
            'sex' => 'Male',
            'birthdate' => '2019-11-08',
            'age' => 5,
            'address' => 'Purok 3, Barangay San Jose, Manila',
            'first_language' => 'Tagalog',
            'second_language' => 'English',
            'registration_status' => 'Approved',
            'accomplished_by' => 'Lisa Garcia',
            'reviewed_by' => 'CDC Staff',
        ]);

        $child3->guardians()->create([
            'name' => 'Lisa Garcia',
            'relationship' => 'Mother',
            'email' => 'lisa.garcia@email.com',
            'occupation' => 'Business Owner',
            'address' => 'Purok 3, Barangay San Jose, Manila',
            'mobile_phone' => '09183334444',
        ]);
    }
}
