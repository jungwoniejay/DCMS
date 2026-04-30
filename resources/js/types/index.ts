import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'parent';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Guardian {
    id: number;
    name: string;
    relationship: string;
    mobile_phone?: string;
    email?: string;
    occupation?: string;
}

export interface EmergencyContact {
    id: number;
    name: string;
    relationship: string;
    mobile_phone?: string;
}

export interface FatherProfile {
    id: number;
    first_name: string;
    last_name: string;
    age?: number;
    civil_status?: string;
    educational_attainment?: string;
    occupational_status?: string;
    mother_tongue?: string;
}

export interface MotherProfile {
    id: number;
    first_name: string;
    last_name: string;
    age?: number;
    civil_status?: string;
    educational_attainment?: string;
    occupational_status?: string;
    pregnant?: boolean;
}

export interface FamilyProfile {
    id: number;
    purok_zone?: string;
    home_ownership?: string;
    home_materials?: string;
    electricity?: boolean;
    running_water?: boolean;
    internet?: boolean;
}

export interface Sibling {
    id: number;
    name: string;
    age?: number;
    sex?: string;
}

export interface MedicalAssessment {
    id: number;
    bcg_status?: string;
    dpt_status?: string;
    polio_status?: string;
    mmr_status?: string;
    hepa_b_status?: string;
    measles_status?: string;
}

export interface HealthAssessment {
    id: number;
    hospital_center_name?: string;
    last_checkup_date?: string;
    medical_assessment?: MedicalAssessment;
}

export interface NutritionRecord {
    id: number;
    height_first?: number;
    weight_first?: number;
    height_second?: number;
    weight_second?: number;
    nutritional_status_result?: string;
    date_first?: string;
}

export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Child {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    sex: 'Male' | 'Female';
    age: number;
    birthdate: string;
    address?: string;
    classroom?: string;
    first_language?: string;
    second_language?: string;
    profile_picture?: string;
    registration_status: RegistrationStatus;
    accomplished_by?: string;
    reviewed_by?: string;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
    guardians?: Guardian[];
    emergency_contacts?: EmergencyContact[];
    father_profile?: FatherProfile;
    mother_profile?: MotherProfile;
    family_profile?: FamilyProfile;
    siblings?: Sibling[];
    health_assessment?: HealthAssessment;
    nutrition_record?: NutritionRecord;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}
