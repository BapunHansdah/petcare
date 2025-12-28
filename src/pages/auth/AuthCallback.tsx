import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { setUser, setUserRole, setLoading } from '../../store/slices/authSlice';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the auth callback
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No session found');
        }
        
        const user = session.user;
        dispatch(setUser({
          id: user.id,
          email: user.email as string,
        }));
        
        // Check if user is a hospital
        const { data: hospital } = await supabase
          .from('hospitals')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (hospital) {
          dispatch(setUserRole('hospital'));
          
          if (!hospital.onboarding_completed) {
            navigate('/hospital-onboarding');
            return;
          }
          
          navigate('/');
          return;
        }
        
        // Check if user is a doctor
        const { data: doctor } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (doctor) {
          dispatch(setUserRole('doctor'));
          
          if (!doctor.onboarding_completed) {
            navigate('/doctor-onboarding');
            return;
          }
          
          navigate('/');
          return;
        }

            // Check if user is a pet parent
        const { data: petParent } = await supabase
          .from('pet_parents')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (petParent) {
          dispatch(setUserRole('pet_parent'));
          
          if (!petParent.onboarding_completed) {
            navigate('/pet-parent-onboarding');
            return;
          }
          
          navigate('/pet-parent');
          return;
        }

        const signupData = localStorage.getItem('petParentSignupData');
        if (signupData) {
          dispatch(setUserRole('pet_parent'));
          navigate('/pet-parent-onboarding');
          return;
        }
        
        // New user - default to hospital onboarding
        dispatch(setUserRole('hospital'));
        navigate('/hospital-onboarding');
      } catch (error) {
        console.error('Error processing auth callback:', error);
        setError('Failed to authenticate. Please try again.');
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    handleCallback();
  }, [dispatch, navigate]);
  
  return (
    <div className="min-h-screen gradient_background flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {error ? (
          <div className="text-center">
            <h3 className="text-xl font-medium text-red-600">Authentication Error</h3>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Authenticating...</p>
          </div>
        )}
      </div>
    </div>
  );
}