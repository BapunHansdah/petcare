export interface User {
  id: string;
  email: string;
}

export interface Hospital {
  id: string;
  user_id: string;
  name: string;
  logo_url: string;
  address: string;
  contact_number: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  hospital_id: string;
  name: string;
  profile_pic: string;
  specialization: string;
  experience: number;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Patient {
  id: string;
  hospital_id: string;
  doctor_id: string | null;
  owner_name: string;
  phone: string;
  customer_type: string;
  breed: string;
  gender: string;
  issue_type: string;
  issue_description: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  diagnosis: string;
  description: string;
  medicines: Medicine[];
  pricing: number;
  follow_up_date: string;
  created_at: string;
}

export interface Medicine {
  name: string;
  type: 'syrup' | 'tablet';
  timing: 'before_food' | 'after_food';
  duration: number;
}


// New Pet Parent Types
export interface PetParent {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address?: string;
  email?: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Dog {
  id: string;
  pet_parent_id: string;
  name: string;
  age: number;
  breed: string;
  avatar_url?: string | null | undefined;
  weight: number;
  created_at: string;
}

export interface DogRecord {
  id: string;
  dog_id: string;
  title: string;
  type: 'image' | 'xray' | 'prescription' | 'document';
  file_url: string | null | undefined;
  date: string;
  notes?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  pet_parent_id: string;
  dog_id?: string;
  title: string;
  type: 'food' | 'tablet' | 'vet_visit' | 'vaccination' | 'other';
  reminder_date: string;
  reminder_time: string;
  is_recurring: boolean;
  recurring_interval?: 'daily' | 'weekly' | 'monthly';
  is_completed: boolean;
  notes?: string;
  created_at: string;
}

export interface VisitHistory {
  id: string;
  pet_parent_id: string;
  dog_id: string;
  hospital_name: string;
  doctor_name: string;
  visit_date: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  created_at: string;
}