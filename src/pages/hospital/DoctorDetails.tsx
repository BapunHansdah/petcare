import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, Briefcase, Award } from 'lucide-react';
import { useGetDoctorQuery } from '../../store/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatDate, generateInitials } from '../../lib/utils';

export function DoctorDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: doctor, isLoading: isLoadingDoctor } = useGetDoctorQuery(id || '');
  
  if (isLoadingDoctor) {
    return (
      <div className="space-y-4">
        <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Doctor not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate('/doctors')}
        >
          Back to Doctors
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto"
          onClick={() => navigate('/doctors')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{doctor.name}</h1>
          <p className="text-gray-600">{doctor.specialization}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium">Doctor Information</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">{doctor.specialization}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{doctor.experience} years</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="font-medium">{formatDate(doctor.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {doctor.onboarding_completed ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-amber-600">Onboarding</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    icon={<Mail size={16} />}
                  >
                    Contact Doctor
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <Card className="mt-6">
            <Card.Header>
              <h2 className="text-lg font-medium">Assigned Patients</h2>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-4">
                <p className="text-gray-500">This section will display patients assigned to this doctor</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  View All Patients
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
        
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium">Profile</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white text-xl font-medium">
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
                  <div className="text-center">
                    <p className="font-medium text-lg">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3">
                  <div className="flex items-center space-x-2">
                    <Briefcase size={16} className="text-gray-500" />
                    <span>{doctor.experience} years of experience</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Joined on {formatDate(doctor.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Award size={16} className="text-gray-500" />
                    <span>Specializes in {doctor.specialization}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}