import  { useState } from 'react';
import { useSelector } from 'react-redux';
import { Search, RefreshCw } from 'lucide-react';
import { useGetDoctorQuery, useGetPatientsQuery } from '../../store/api';
import { RootState } from '../../store';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PatientCard } from '../../components/shared/PatientCard';
import { PatientCardSkeleton } from '../../components/shared/SkeletonLoader';

export function DoctorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: doctor, isLoading: isLoadingDoctor } = useGetDoctorQuery(user?.id || '');
  const { data: patients = [], isLoading: isLoadingPatients } = useGetPatientsQuery(
    { doctorId: doctor?.id }
  );
  
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = patients.filter(patient => 
    (patient.phone.includes(searchTerm) || 
    patient.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === 'all' || patient.status === activeTab)
  );
  
  const tabs = [
    { id: 'pending', label: 'Pending Cases' },
    { id: 'completed', label: 'Completed Cases' },
    { id: 'all', label: 'All Cases' },
  ];
  
  //get doctor on page load
   
  //get patients on page load

  
  if (isLoadingDoctor) {
    return (
      <div className="space-y-4">
        <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, Dr. {doctor?.name}</h1>
        <p className="text-gray-600">Manage your patient cases</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <Tabs
            tabs={tabs}
            defaultTab="pending"
            onChange={setActiveTab}
          />
        </div>
        
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-500">
            {filteredPatients.length} {activeTab === 'all' ? 'total' : activeTab} cases
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-64">
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={16} />}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw size={16} />}
              className="flex-shrink-0"
            >
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {isLoadingPatients ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PatientCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === 'pending'
                  ? 'No pending cases found'
                  : activeTab === 'completed'
                  ? 'No completed cases found'
                  : 'No cases found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  viewPath={`/cases/${patient.id}`}
                  isDoctor
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}