/*
  # Pet Parent System Schema

  1. New Tables
    - `pet_parents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `address` (text, optional)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamptz)
    
    - `dogs`
      - `id` (uuid, primary key)
      - `pet_parent_id` (uuid, references pet_parents)
      - `name` (text)
      - `age` (numeric)
      - `breed` (text)
      - `avatar_url` (text, optional)
      - `weight` (numeric)
      - `created_at` (timestamptz)
    
    - `dog_records`
      - `id` (uuid, primary key)
      - `dog_id` (uuid, references dogs)
      - `title` (text)
      - `type` (text) - 'image', 'xray', 'prescription', 'document'
      - `file_url` (text)
      - `date` (date)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
    
    - `reminders`
      - `id` (uuid, primary key)
      - `pet_parent_id` (uuid, references pet_parents)
      - `dog_id` (uuid, references dogs, optional)
      - `title` (text)
      - `type` (text) - 'food', 'tablet', 'vet_visit', 'vaccination', 'other'
      - `reminder_date` (date)
      - `reminder_time` (time)
      - `is_recurring` (boolean)
      - `recurring_interval` (text, optional) - 'daily', 'weekly', 'monthly'
      - `is_completed` (boolean)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
    
    - `visit_history`
      - `id` (uuid, primary key)
      - `pet_parent_id` (uuid, references pet_parents)
      - `dog_id` (uuid, references dogs)
      - `hospital_name` (text)
      - `doctor_name` (text)
      - `visit_date` (date)
      - `diagnosis` (text, optional)
      - `prescription` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for pet parents to manage their own data
*/

-- Create pet_parents table
CREATE TABLE IF NOT EXISTS pet_parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_parent_id uuid REFERENCES pet_parents NOT NULL,
  name text NOT NULL,
  age numeric NOT NULL,
  breed text NOT NULL,
  avatar_url text,
  weight numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create dog_records table
CREATE TABLE IF NOT EXISTS dog_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid REFERENCES dogs NOT NULL,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'xray', 'prescription', 'document')),
  file_url text NOT NULL,
  date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_parent_id uuid REFERENCES pet_parents NOT NULL,
  dog_id uuid REFERENCES dogs,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('food', 'tablet', 'vet_visit', 'vaccination', 'other')),
  reminder_date date NOT NULL,
  reminder_time time NOT NULL,
  is_recurring boolean DEFAULT false,
  recurring_interval text CHECK (recurring_interval IN ('daily', 'weekly', 'monthly')),
  is_completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create visit_history table
CREATE TABLE IF NOT EXISTS visit_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_parent_id uuid REFERENCES pet_parents NOT NULL,
  dog_id uuid REFERENCES dogs NOT NULL,
  hospital_name text NOT NULL,
  doctor_name text NOT NULL,
  visit_date date NOT NULL,
  diagnosis text,
  prescription text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pet_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dog_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_history ENABLE ROW LEVEL SECURITY;

-- Pet Parents Policies
CREATE POLICY "Pet parents can manage their own profile"
  ON pet_parents
  USING (auth.uid() = user_id);

-- Dogs Policies
CREATE POLICY "Pet parents can manage their own dogs"
  ON dogs
  USING (EXISTS (
    SELECT 1 FROM pet_parents
    WHERE pet_parents.id = dogs.pet_parent_id
    AND pet_parents.user_id = auth.uid()
  ));

-- Dog Records Policies
CREATE POLICY "Pet parents can manage their dogs' records"
  ON dog_records
  USING (EXISTS (
    SELECT 1 FROM dogs
    JOIN pet_parents ON pet_parents.id = dogs.pet_parent_id
    WHERE dogs.id = dog_records.dog_id
    AND pet_parents.user_id = auth.uid()
  ));

-- Reminders Policies
CREATE POLICY "Pet parents can manage their own reminders"
  ON reminders
  USING (EXISTS (
    SELECT 1 FROM pet_parents
    WHERE pet_parents.id = reminders.pet_parent_id
    AND pet_parents.user_id = auth.uid()
  ));

-- Visit History Policies
CREATE POLICY "Pet parents can view their own visit history"
  ON visit_history
  USING (EXISTS (
    SELECT 1 FROM pet_parents
    WHERE pet_parents.id = visit_history.pet_parent_id
    AND pet_parents.user_id = auth.uid()
  ));