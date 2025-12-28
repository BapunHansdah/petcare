import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'sonner';
import { getSession, supabase } from './lib/supabase';
import { setUser, setLoading, setUserRole } from './store/slices/authSlice';
import { RootState } from './store';

// Layouts
import { AuthLayout } from './components/layout/AuthLayout';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { AuthCallback } from './pages/auth/AuthCallback';
import { PetParentLogin } from './pages/auth/PetParentLogin';
import { PetParentSignup } from './pages/auth/PetParentSignup';

// Hospital Pages
import { HospitalOnboarding } from './pages/hospital/HospitalOnboarding';
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';

// Doctor Pages
import { DoctorOnboarding } from './pages/doctor/DoctorOnboarding';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { PatientCase } from './pages/doctor/PatientCase';


// Pet Parent Pages
import { PetParentOnboarding } from './pages/petparent/PetParentOnboarding';
import { PetParentDashboard } from './pages/petparent/PetParentDashboard';
import { DogsPage } from './pages/petparent/DogsPage';
import { AddDogPage } from './pages/petparent/AddDogPage';
import { DogDetailsPage } from './pages/petparent/DogDetailsPage';
import { AddRecordPage } from './pages/petparent/AddRecordPage';
import { EditRecordPage } from './pages/petparent/EditRecordPage';
import { RemindersPage } from './pages/petparent/RemindersPage';
import { AddReminderPage } from './pages/petparent/AddReminderPage';
import { EditReminderPage } from './pages/petparent/EditReminderPage';
import { ViewRecordPage } from './pages/petparent/ViewRecordPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return (
      <div className="min-h-screen gradient_background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

// Role-based Route Component
function RoleRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: ('hospital' | 'doctor' | 'pet_parent')[] 
}) {
  const { userRole, isLoading } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return (
      <div className="min-h-screen gradient_background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

function App() {
  const dispatch = useDispatch();
  const { userRole } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { session, error } = await getSession();
      
      if (error) {
        console.error('Error checking auth status:', error);
        dispatch(setLoading(false));
        return;
      }
      
      if (session) {
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email as string,
        }));
        
        // Add this code to determine user role on page reload
        try {
          // Check if user is a hospital
          const { data: hospital } = await supabase
            .from('hospitals')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (hospital) {
            dispatch(setUserRole('hospital'));
            dispatch(setLoading(false));
            return;
          }
          
          // Check if user is a doctor
          const { data: doctor } = await supabase
            .from('doctors')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (doctor) {
            dispatch(setUserRole('doctor'));
            dispatch(setLoading(false));
            return;
          }

          // Check if user is a pet parent
          const { data: petParent } = await supabase
            .from('pet_parents')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (petParent) {
            dispatch(setUserRole('pet_parent'));
            dispatch(setLoading(false));
            return;
          }

        } catch (error) {
          console.error('Error determining user role:', error);
        }
      }
      
      dispatch(setLoading(false));
    };
    
    checkAuth();
  }, [dispatch]);
  
  return (
    <BrowserRouter>
 
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/pet-parent/callback" element={<AuthCallbackPetParent />} />

          {/* Pet Parent Auth Routes */}
        <Route path="/pet-parent/login" element={<PetParentLogin />} />
        <Route path="/pet-parent/signup" element={<PetParentSignup />} />
        
        {/* Onboarding Routes */}
        <Route
          path="/hospital-onboarding"
          element={
            <ProtectedRoute>
              <HospitalOnboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-onboarding"
          element={
            <ProtectedRoute>
              <DoctorOnboarding />
            </ProtectedRoute>
          }
        />

          <Route
          path="/pet-parent-onboarding"
          element={
            <ProtectedRoute>
              <PetParentOnboarding />
            </ProtectedRoute>
          }
        />
        
        {/* App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              userRole === 'hospital' ? (
                <RoleRoute allowedRoles={['hospital']}>
                  <HospitalDashboard />
                </RoleRoute>
              ) : userRole === 'doctor'  ? (
                <RoleRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </RoleRoute>
              ) : (
                <Navigate to="/pet-parent" />
              )
            }
          />
          
          {/* Hospital Routes */}
          <Route
            path="doctors"
            element={
              <RoleRoute allowedRoles={['hospital']}>
                <DoctorList />
              </RoleRoute>
            }
          />
          <Route
            path="doctors/:id"
            element={
              <RoleRoute allowedRoles={['hospital']}>
                <DoctorDetails />
              </RoleRoute>
            }
          />
          <Route
            path="patients"
            element={
              <RoleRoute allowedRoles={['hospital']}>
                <PatientList />
              </RoleRoute>
            }
          />
          <Route
            path="patients/:id"
            element={
              <RoleRoute allowedRoles={['hospital']}>
                <PatientDetails />
              </RoleRoute>
            }
          />
          
          {/* Doctor Routes */}
          <Route
            path="cases"
            element={
              <RoleRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="cases/:id"
            element={
              <RoleRoute allowedRoles={['doctor']}>
                <PatientCase />
              </RoleRoute>
            }
          />
        </Route>

         {/* Pet Parent App Routes */}
        <Route
          path="/pet-parent"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['pet_parent']}>
                <PetParentLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<PetParentDashboard />} />
          <Route path="dogs" element={<DogsPage />} />
          <Route path="dogs/new" element={<AddDogPage />} />
          <Route path="dogs/:id" element={<DogDetailsPage />} />
          {/* <Route path="reminders" element={<div>Reminders Page</div>} /> */}
          <Route path="dogs/:id/edit" element={<EditDogPage />} />
          <Route path="dogs/:id/records/new" element={<AddRecordPage />} />
          <Route path="dogs/:dogId/records/:recordId/edit" element={<EditRecordPage />} />
          <Route path="dogs/:dogId/records/:recordId/view" element={<ViewRecordPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="reminders/new" element={<AddReminderPage />} />
          <Route path="reminders/:id/edit" element={<EditReminderPage />} />
          <Route path="history" element={<div>Visit History Page</div>} />
        </Route>
        
        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { PatientList } from './pages/hospital/PatientList';
import { DoctorList } from './pages/hospital/DoctorList';
import { PatientDetails } from './pages/hospital/PatientDetails';
import { DoctorDetails } from './pages/hospital/DoctorDetails';
import { PetParentLayout } from './components/layout/PetParentLayout';
import { AuthCallbackPetParent } from './pages/auth/AuthCallbackPetParent';
import { EditDogPage } from './pages/petparent/EditDogPage';

