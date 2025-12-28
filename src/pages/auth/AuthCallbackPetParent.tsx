import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabase';
import { setUser, setUserRole, setLoading } from '../../store/slices/authSlice';

export function AuthCallbackPetParent() {
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
        
        dispatch(setUserRole('pet_parent'));
        navigate('/pet-parent-onboarding');
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