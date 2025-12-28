import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { signInWithOTP } from '../../lib/supabase';

interface FormData {
  email: string;
}

export function Login() {
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
      const { error } = await signInWithOTP(data.email);
      
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
    <div className="space-y-6">
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
            <h2 className="text-lg font-medium text-center">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Enter your email to receive a one-time login link
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        </>
      )}
    </div>
  );
}