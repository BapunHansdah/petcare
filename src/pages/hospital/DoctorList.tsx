import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Search } from 'lucide-react';
import { useGetHospitalQuery, useGetDoctorsByHospitalQuery } from '../../store/api';
import { RootState } from '../../store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { AddDoctorForm } from '../../components/hospital/AddDoctorForm';
import { Pagination } from '../../components/ui/Pagination';
import { generateInitials } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function DoctorList() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: hospital, isLoading: isLoadingHospital } = useGetHospitalQuery(user?.id || '');
  const { data: doctors = [], isLoading: isLoadingDoctors } = useGetDoctorsByHospitalQuery(hospital?.id || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  
  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination logic
  const doctorsPerPage = 10;
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );
  
  if (isLoadingHospital) {
    return (
      <div className="space-y-4">
        <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-gray-600">Manage your hospital's doctors</p>
        </div>
        
        <Button
          onClick={() => setShowAddDoctorModal(true)}
          icon={<Plus size={16} />}
        >
          Add Doctor
        </Button>
      </div>
      
      <Card>
        <Card.Header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium">All Doctors</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {filteredDoctors.length}
            </span>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
              className="w-full md:w-64"
            />
          </div>
        </Card.Header>
        
        <Card.Content>
          {isLoadingDoctors ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center p-4 border border-gray-100 rounded-lg animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No doctors found</p>
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
            <div className="space-y-6">
              <div className="space-y-4">
                {paginatedDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-medium">
                      {doctor.profile_pic ? (
                        <img 
                          src={doctor.profile_pic} 
                          alt={doctor.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        generateInitials(doctor.name)
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        icon={<Mail size={14} />}
                      >
                        Contact
                      </Button> */}
                      <Button
                        size="sm"
                        onClick={() => navigate(`/doctors/${doctor.user_id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
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