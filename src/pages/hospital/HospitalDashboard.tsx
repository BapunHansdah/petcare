import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Users, RefreshCw, Search } from 'lucide-react';
import { useGetHospitalQuery, useGetPatientsQuery, useGetDoctorsByHospitalQuery } from '../../store/api';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PatientCard } from '../../components/shared/PatientCard';
import { PatientCardSkeleton } from '../../components/shared/SkeletonLoader';
import { Modal } from '../../components/ui/Modal';
import { AddPatientForm } from '../../components/hospital/AddPatientForm';
import { AddDoctorForm } from '../../components/hospital/AddDoctorForm';

export function HospitalDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: hospital, isLoading: isLoadingHospital } = useGetHospitalQuery(user?.id || '');
  const { data: doctors = [], isLoading: isLoadingDoctors } = useGetDoctorsByHospitalQuery(hospital?.id || '');
  const { data: patients = [], isLoading: isLoadingPatients } = useGetPatientsQuery({ hospitalId: hospital?.id });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  
  const filteredPatients = patients.filter(patient => 
    patient.phone.includes(searchTerm) || 
    patient.owner_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const pendingPatients = filteredPatients.filter(patient => patient.status === 'pending');
  const completedPatients = filteredPatients.filter(patient => patient.status === 'completed');
  
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
    <div className="space-y-6 ">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{hospital?.name}</h1>
          <p className="text-gray-600">Hospital Dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setShowAddDoctorModal(true)}
            icon={<Users size={16} />}
          >
            Add Doctor
          </Button>
          <Button
            onClick={() => setShowAddPatientModal(true)}
            icon={<Plus size={16} />}
          >
            Add Patient
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>Doctors</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {doctors.length}
            </span>
          </Card.Header>
          <Card.Content>
            {isLoadingDoctors ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 mt-1 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No doctors added yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAddDoctorModal(true)}
                >
                  Add your first doctor
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                      {doctor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialization}</p>
                    </div>
                  </div>
                ))}
                {doctors.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-blue-600"
                  >
                    View all doctors
                  </Button>
                )}
              </div>
            )}
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>Pending Cases</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {pendingPatients.length}
            </span>
          </Card.Header>
          <Card.Content>
            {isLoadingPatients ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 mt-1 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingPatients.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No pending cases</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPatients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                      {patient.owner_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{patient.owner_name}</p>
                      <p className="text-xs text-gray-500">{patient.issue_type}</p>
                    </div>
                  </div>
                ))}
                {pendingPatients.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-amber-600"
                  >
                    View all pending cases
                  </Button>
                )}
              </div>
            )}
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header className="flex justify-between items-center">
            <h2>Completed Cases</h2>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {completedPatients.length}
            </span>
          </Card.Header>
          <Card.Content>
            {isLoadingPatients ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 mt-1 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : completedPatients.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No completed cases</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedPatients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium">
                      {patient.owner_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{patient.owner_name}</p>
                      <p className="text-xs text-gray-500">{patient.issue_type}</p>
                    </div>
                  </div>
                ))}
                {completedPatients.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-green-600"
                  >
                    View all completed cases
                  </Button>
                )}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium">Recent Patients</h2>
          
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  viewPath={`/patients/${patient.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
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
      
      <Modal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        title="Invite Doctor"
      >
        <AddDoctorForm
          hospitalId={hospital?.id || ''}
          onSuccess={() => setShowAddDoctorModal(false)}
        />
      </Modal>
    </div>
  );
}