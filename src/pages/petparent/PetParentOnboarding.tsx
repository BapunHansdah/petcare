import {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useCreatePetParentMutation } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { User, Phone } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  address?: string;
  email?: string;
}

export function PetParentOnboarding() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createPetParent, { isLoading }] = useCreatePetParentMutation();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  
  useEffect(() => {
    // Get signup data from localStorage if available
    const signupData = localStorage.getItem('petParentSignupData');
    if (signupData) {
      const data = JSON.parse(signupData);
      setValue('name', data.name);
      setValue('phone', data.phone);
      setValue('email', data.email);
      localStorage.removeItem('petParentSignupData');
    }
  }, [setValue]);
  
  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    try {
      await createPetParent({
        user_id: user.id,
        name: data.name,
        phone: data.phone,
        address: data.address,
        email: data.email,
        onboarding_completed: true,
      }).unwrap();
      
      navigate('/pet-parent');
    } catch (error) {
      console.error('Error creating pet parent profile:', error);
    }
  };
  
  return (
    <div className="min-h-screen gradient_background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome to PetCare!</h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to start managing your pet's health records
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              id="name"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Full name is required',
              })}
            />
            
            <Input
              label="Phone Number"
              id="phone"
              type="tel"
              icon={<Phone size={16} />}
              error={errors.phone?.message}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Please enter a valid 10-digit phone number',
                },
              })}
            />
            
            <Textarea
              label="Address (Optional)"
              id="address"
              placeholder="Enter your address"
              {...register('address')}
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
      </div>
    </div>
  );
}