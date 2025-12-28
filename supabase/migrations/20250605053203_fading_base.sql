/*
  # Initial Schema for PetCare

  1. New Tables
    - `hospitals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `logo_url` (text)
      - `address` (text)
      - `contact_number` (text)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamptz)
    
    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `hospital_id` (uuid, references hospitals)
      - `name` (text)
      - `profile_pic` (text)
      - `specialization` (text)
      - `experience` (integer)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamptz)
    
    - `patients`
      - `id` (uuid, primary key)
      - `hospital_id` (uuid, references hospitals)
      - `doctor_id` (uuid, references doctors, nullable)
      - `owner_name` (text)
      - `phone` (text)
      - `customer_type` (text)
      - `breed` (text)
      - `gender` (text)
      - `issue_type` (text)
      - `issue_description` (text)
      - `status` (text)
      - `created_at` (timestamptz)
    
    - `prescriptions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `diagnosis` (text)
      - `description` (text)
      - `medicines` (jsonb)
      - `pricing` (numeric)
      - `follow_up_date` (date)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  logo_url text,
  address text,
  contact_number text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  hospital_id uuid REFERENCES hospitals NOT NULL,
  name text NOT NULL,
  profile_pic text,
  specialization text,
  experience integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid REFERENCES hospitals NOT NULL,
  doctor_id uuid REFERENCES doctors,
  owner_name text NOT NULL,
  phone text NOT NULL,
  customer_type text NOT NULL,
  breed text NOT NULL,
  gender text NOT NULL,
  issue_type text NOT NULL,
  issue_description text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients NOT NULL,
  diagnosis text NOT NULL,
  description text,
  medicines jsonb DEFAULT '[]'::jsonb,
  pricing numeric DEFAULT 0,
  follow_up_date date,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Hospitals Policies
CREATE POLICY "Hospital owners can manage their own hospitals"
  ON hospitals
  USING (auth.uid() = user_id);

-- Doctors Policies
CREATE POLICY "Hospital owners can view their doctors"
  ON doctors
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM hospitals
    WHERE hospitals.id = doctors.hospital_id
    AND hospitals.user_id = auth.uid()
  ));

CREATE POLICY "Doctors can view their own profile"
  ON doctors
  USING (auth.uid() = user_id);

-- Patients Policies
CREATE POLICY "Hospital owners can manage their patients"
  ON patients
  USING (EXISTS (
    SELECT 1 FROM hospitals
    WHERE hospitals.id = patients.hospital_id
    AND hospitals.user_id = auth.uid()
  ));

CREATE POLICY "Doctors can view and manage their assigned patients"
  ON patients
  USING (EXISTS (
    SELECT 1 FROM doctors
    WHERE doctors.id = patients.doctor_id
    AND doctors.user_id = auth.uid()
  ));

-- Prescriptions Policies
CREATE POLICY "Hospital owners can view prescriptions for their patients"
  ON prescriptions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM patients
    JOIN hospitals ON hospitals.id = patients.hospital_id
    WHERE patients.id = prescriptions.patient_id
    AND hospitals.user_id = auth.uid()
  ));

CREATE POLICY "Doctors can manage prescriptions for their patients"
  ON prescriptions
  USING (EXISTS (
    SELECT 1 FROM patients
    JOIN doctors ON doctors.id = patients.doctor_id
    WHERE patients.id = prescriptions.patient_id
    AND doctors.user_id = auth.uid()
  ));