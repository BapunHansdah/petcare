import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Heart, User, Phone } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signInWithOTPPetParent } from '../../lib/supabase';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export function PetParentSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Store signup data in localStorage to use after email verification
      localStorage.setItem('petParentSignupData', JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email
      }));

      const { error } = await signInWithOTPPetParent(data.email);
      
      if (error) {
        throw error;
      }
      
      setSentEmail(data.email);
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen gradient_background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-400 flex items-center justify-center text-white">
            <Heart size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          PetCare
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join as a Pet Parent
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-gray-100">
          {sentEmail ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="text-sm text-gray-500">
                We've sent a verification link to <strong>{sentEmail}</strong>. Click the
                link in the email to complete your registration.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSentEmail(null)}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-medium text-center">Create Your Account</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Start managing your pet's health records
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <Input
                  label="Full Name"
                  id="name"
                  type="text"
                  autoComplete="name"
                  icon={<User size={16} />}
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />

                <Input
                  label="Phone Number"
                  id="phone"
                  type="tel"
                  autoComplete="tel"
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

                <Input
                  label="Email address"
                  id="email"
                  type="email"
                  autoComplete="email"
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
                
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Create Account
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/pet-parent/login"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Sign in instead
                  </Link>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Are you a hospital or doctor? Sign in here
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}