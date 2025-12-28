import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {  Link } from 'react-router-dom';
import { Mail, Heart } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signInWithOTPPetParent } from '../../lib/supabase';

interface FormData {
  email: string;
}

export function PetParentLogin() {
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
      const { error } = await signInWithOTPPetParent(data.email);
      
      if (error) {
        throw error;
      }
      
      setSentEmail(data.email);
    } catch (error) {
      console.error('Error signing in:', error);
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
          Pet Parent Portal
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
                We've sent a magic link to <strong>{sentEmail}</strong>. Click the
                link in the email to sign in.
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
                <h2 className="text-lg font-medium text-center">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Sign in to manage your pet's records
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                  Send magic link
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">New to PetCare?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/pet-parent/signup"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-pink-600 bg-pink-50 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Create an account
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