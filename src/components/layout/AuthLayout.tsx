import { Outlet } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen gradient_background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white">
            <Stethoscope size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          PetCare
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Veterinary Hospital Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}