import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { useGetPatientByIdQuery, useGetPrescriptionQuery } from '../../store/api';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatPhoneNumber, formatDate } from '../../lib/utils';
import { PrescriptionForm } from '../../components/doctor/PrescriptionForm';

export function PatientCase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading: isLoadingPatient } = useGetPatientByIdQuery(id || '');
  const { data: prescription } = useGetPrescriptionQuery(id || '');
  
  const [activeTab, setActiveTab] = useState('details');
  
  const tabs = [
    { id: 'details', label: 'Patient Details' },
    { id: 'prescription', label: 'Prescription' },
  ];
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  const handleSuccess = () => {
    setActiveTab('details');
  };
  
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
          onClick={() => navigate(-1)}
        >
          Go back
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
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{patient.owner_name}'s Pet</h1>
          <p className="text-gray-600">{formatPhoneNumber(patient.phone)}</p>
        </div>
      </div>
      
      <Card>
        <Card.Header>
          <Tabs
            tabs={tabs}
            defaultTab="details"
            onChange={handleTabChange}
          />
        </Card.Header>
        
        <Card.Content>
          {activeTab === 'details' ? (
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
                  <p className={`font-medium capitalize ${
                    patient.status === 'pending' ? 'text-amber-600' : 'text-green-600'
                  }`}>
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
              
              {prescription ? (
                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center">
                    <FileText className="text-green-600 mr-2" size={20} />
                    <div>
                      <p className="font-medium text-green-800">Prescription Created</p>
                      <p className="text-sm text-green-700">
                        You've already created a prescription for this patient
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={() => setActiveTab('prescription')}
                  >
                    View Prescription
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-medium">Create Prescription</h3>
                      <p className="text-sm text-gray-500">
                        Add your diagnosis and prescription details
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        icon={<Upload size={16} />}
                      >
                        Upload Prescription
                      </Button>
                      <Button
                        onClick={() => setActiveTab('prescription')}
                      >
                        Create Prescription
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {prescription ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Diagnosis Information</h3>
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
                    <h3 className="text-lg font-medium">Medicines ({prescription.medicines.length})</h3>
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
              ) : (
                <PrescriptionForm patientId={id || ''} onSuccess={handleSuccess} />
              )}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}