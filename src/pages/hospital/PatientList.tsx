import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import { useGetHospitalQuery, useGetPatientsQuery } from '../../store/api';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PatientCard } from '../../components/shared/PatientCard';
import { PatientCardSkeleton } from '../../components/shared/SkeletonLoader';
import { Modal } from '../../components/ui/Modal';
import { AddPatientForm } from '../../components/hospital/AddPatientForm';
import { Pagination } from '../../components/ui/Pagination';

export function PatientList() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: hospital, isLoading: isLoadingHospital } = useGetHospitalQuery(user?.id || '');
  const { data: patients = [], isLoading: isLoadingPatients } = useGetPatientsQuery({ hospitalId: hospital?.id });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Filter patients based on search term and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.phone.includes(searchTerm) || 
      patient.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination logic
  const patientsPerPage = 10;
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  
  if (isLoadingHospital) {
    return (
      <div className="space-y-4">
        <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-gray-600">Manage all your patients</p>
        </div>
        
        <Button
          onClick={() => setShowAddPatientModal(true)}
          icon={<Plus size={16} />}
        >
          Add Patient
        </Button>
      </div>
      
      <Card>
        <Card.Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium">All Patients</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {filteredPatients.length}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex space-x-2">
              <Button 
                variant={statusFilter === 'all' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'pending' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={statusFilter === 'completed' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </Card.Header>
        
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="relative">
            <Input
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              className="w-full md:w-64"
            />
          </div>
        </div>
        
        <Card.Content>
          {isLoadingPatients ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <PatientCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No patients found</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setShowAddPatientModal(true)}
              >
                Add your first patient
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    viewPath={`/patients/${patient.id}`}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="mt-6"
                />
              )}
            </div>
          )}
        </Card.Content>
      </Card>
      
      <Modal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        title="Add New Patient"
      >
        <AddPatientForm
          hospitalId={hospital?.id || ''}
          onSuccess={() => setShowAddPatientModal(false)}
        />
      </Modal>
    </div>
  );
}