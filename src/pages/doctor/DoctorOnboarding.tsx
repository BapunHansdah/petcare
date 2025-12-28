import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCreateDoctorMutation } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Upload } from 'lucide-react';

interface FormData {
  name: string;
  specialization: string;
  experience: number;
}

export function DoctorOnboarding() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createDoctor, { isLoading }] = useCreateDoctorMutation();
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get hospital_id from URL query params
  const searchParams = new URLSearchParams(location.search);
  const hospitalId = searchParams.get('hospital_id') || '';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    try {
      // In a real app, we would upload the profile pic to Supabase Storage
      // For this demo, we'll use a placeholder
      const profilePicUrl = profilePicPreview || 'https://via.placeholder.com/150';
      
      await createDoctor({
        user_id: user.id,
        hospital_id: hospitalId,
        name: data.name,
        profile_pic: profilePicUrl,
        specialization: data.specialization,
        experience: data.experience,
        onboarding_completed: true,
      }).unwrap();
      
      navigate('/');
    } catch (error) {
      console.error('Error creating doctor profile:', error);
    }
  };
  
  const specializationOptions = [
    { value: 'general', label: 'General Veterinarian' },
    { value: 'surgery', label: 'Veterinary Surgery' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'dentistry', label: 'Dentistry' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Complete Your Doctor Profile</h1>
        <p className="text-gray-600 mt-2">
          Set up your profile to start receiving patient cases
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden border-2 border-dashed ${
              profilePicPreview ? 'border-transparent' : 'border-gray-300'
            } flex items-center justify-center bg-gray-50`}
          >
            {profilePicPreview ? (
              <img
                src={profilePicPreview}
                alt="Profile picture preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <label
            htmlFor="profile_pic"
            className="cursor-pointer inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <span>{profilePicPreview ? 'Change photo' : 'Upload photo'}</span>
            <input
              id="profile_pic"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>
        
        <Input
          label="Full Name"
          id="name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
          })}
        />
        
        <Select
          label="Specialization"
          id="specialization"
          options={specializationOptions}
          error={errors.specialization?.message}
          {...register('specialization', {
            required: 'Specialization is required',
          })}
        />
        
        <Input
          label="Years of Experience"
          id="experience"
          type="number"
          min={0}
          error={errors.experience?.message}
          {...register('experience', {
            required: 'Experience is required',
            valueAsNumber: true,
            min: { value: 0, message: 'Experience cannot be negative' },
          })}
        />
        
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Complete Setup
        </Button>
      </form>
    </div>
  );
}