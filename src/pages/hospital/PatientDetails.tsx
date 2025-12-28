import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Phone, User, FileText, Edit } from 'lucide-react';
import { useGetPatientByIdQuery, useGetPrescriptionQuery } from '../../store/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatPhoneNumber, formatDate } from '../../lib/utils';

export function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = useGetPatientByIdQuery(id || '');
  const { data: prescription } = useGetPrescriptionQuery(id || '');
  
  if (isLoadingPatient) {
    return (
      <div className="space-y-4">
        <div className="w-48 h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Patient not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate('/patients')}
        >
          Back to Patients
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
          onClick={() => navigate('/patients')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{patient.owner_name}'s Pet</h1>
          <p className="text-gray-600">{formatPhoneNumber(patient.phone)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium">Patient Information</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Customer Type</p>
                    <p className="font-medium capitalize">{patient.customer_type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium">{formatDate(patient.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Breed</p>
                    <p className="font-medium">{patient.breed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{patient.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Issue Type</p>
                    <p className="font-medium">{patient.issue_type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium capitalize ${patient.status === 'pending' ? 'text-amber-600' : 'text-green-600'}`}>
                      {patient.status}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Issue Description</p>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p>{patient.issue_description}</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    icon={<Edit size={16} />}
                  >
                    Edit Patient
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          {prescription && (
            <Card className="mt-6">
              <Card.Header>
                <h2 className="text-lg font-medium">Prescription</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Diagnosis Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Diagnosis</p>
                        <p className="font-medium">{prescription.diagnosis}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Follow-up Date</p>
                        <p className="font-medium">{formatDate(prescription.follow_up_date)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Description</p>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p>{prescription.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Medicines ({prescription.medicines.length})</h3>
                    <div className="space-y-3">
                      {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{medicine.name}</h4>
                            <span className="text-sm text-gray-500 capitalize">{medicine.type}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>Take {medicine.timing === 'before_food' ? 'before' : 'after'} food</p>
                            <p>Duration: {medicine.duration} days</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Pricing</p>
                    <p className="font-medium text-lg">${prescription.pricing.toFixed(2)}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
        
        <div>
          <Card>
            <Card.Header>
              <h2 className="text-lg font-medium">Owner Information</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{patient.owner_name}</p>
                    <p className="text-sm text-gray-500">Pet Owner</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-500" />
                    <span>{formatPhoneNumber(patient.phone)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Registered on {formatDate(patient.created_at)}</span>
                  </div>
                </div>
                
                {patient.status === 'completed' && prescription && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-2">
                      <FileText size={16} className="text-green-600" />
                      <span className="text-green-700 font-medium">Treatment Completed</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Follow-up date: {formatDate(prescription.follow_up_date)}
                    </p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}