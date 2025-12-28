import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCreateHospitalMutation } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Upload } from 'lucide-react';

interface FormData {
  name: string;
  address: string;
  contact_number: string;
}

export function HospitalOnboarding() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createHospital, { isLoading }] = useCreateHospitalMutation();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    try {
      // In a real app, we would upload the logo to Supabase Storage
      // For this demo, we'll use a placeholder
      const logoUrl = logoPreview || 'https://via.placeholder.com/150';
      
      await createHospital({
        user_id: user.id,
        name: data.name,
        logo_url: logoUrl,
        address: data.address,
        contact_number: data.contact_number,
        onboarding_completed: true,
      }).unwrap();
      
      navigate('/');
    } catch (error) {
      console.error('Error creating hospital:', error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to PetCare</h1>
        <p className="text-gray-600 mt-2">
          Complete your hospital profile to get started
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`w-32 h-32 rounded-full overflow-hidden border-2 border-dashed ${
              logoPreview ? 'border-transparent' : 'border-gray-300'
            } flex items-center justify-center bg-gray-50`}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Hospital logo preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <label
            htmlFor="logo"
            className="cursor-pointer inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <span>{logoPreview ? 'Change logo' : 'Upload logo'}</span>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleLogoChange}
            />
          </label>
        </div>
        
        <Input
          label="Hospital Name"
          id="name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Hospital name is required',
          })}
        />
        
        <Textarea
          label="Address"
          id="address"
          error={errors.address?.message}
          {...register('address', {
            required: 'Address is required',
          })}
        />
        
        <Input
          label="Contact Number"
          id="contact_number"
          type="tel"
          error={errors.contact_number?.message}
          {...register('contact_number', {
            required: 'Contact number is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'Please enter a valid 10-digit phone number',
            },
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