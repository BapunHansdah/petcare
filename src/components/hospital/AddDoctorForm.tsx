import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Send } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';

interface AddDoctorFormProps {
  hospitalId: string;
  onSuccess: () => void;
}

interface FormData {
  email: string;
}

export function AddDoctorForm({ hospitalId, onSuccess }: AddDoctorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // In a real app, we would send an invite email with a magic link
      // For this demo, we'll just simulate the invitation
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/doctor-onboarding?hospital_id=${hospitalId}`,
        },
      });
      
      if (error) throw error;
      
      setSuccessMessage(`Invitation sent to ${data.email}`);
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error inviting doctor:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Doctor's Email"
        id="email"
        type="email"
        placeholder="doctor@example.com"
        icon={<Mail size={16} />}
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />
      
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3">
          <div className="flex">
            <div className="text-sm text-green-700">{successMessage}</div>
          </div>
        </div>
      )}
      
      <Button
        type="submit"
        isLoading={isLoading}
        icon={<Send size={16} />}
        className="w-full"
      >
        Send Invitation
      </Button>
    </form>
  );
}