import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetDoctorsByHospitalQuery, useCreatePatientMutation } from '../../store/api';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Patient } from '../../types';

interface AddPatientFormProps {
  hospitalId: string;
  onSuccess: () => void;
}

type FormData = Omit<Patient, 'id' | 'hospital_id' | 'status' | 'created_at'>;

export function AddPatientForm({ hospitalId, onSuccess }: AddPatientFormProps) {
  const { data: doctors = [] } = useGetDoctorsByHospitalQuery(hospitalId);
  const [createPatient, { isLoading }] = useCreatePatientMutation();
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    try {
      await createPatient({
        ...data,
        hospital_id: hospitalId,
        status: 'pending',
      }).unwrap();
      
      setSuccessMessage('Patient added successfully');
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };
  
  const customerTypeOptions = [
    { value: 'new', label: 'New Customer' },
    { value: 'returning', label: 'Returning Customer' },
  ];
  
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];
  
  const issueTypeOptions = [
    { value: 'checkup', label: 'Regular Checkup' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'illness', label: 'Illness' },
    { value: 'injury', label: 'Injury' },
    { value: 'surgery', label: 'Surgery' },
  ];
  
  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id,
    label: doctor.name,
  }));
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Pet Owner's Name"
        id="owner_name"
        error={errors.owner_name?.message}
        {...register('owner_name', {
          required: 'Owner name is required',
        })}
      />
      
      <Input
        label="Phone Number"
        id="phone"
        type="tel"
        error={errors.phone?.message}
        {...register('phone', {
          required: 'Phone number is required',
          pattern: {
            value: /^\d{10}$/,
            message: 'Please enter a valid 10-digit phone number',
          },
        })}
      />
      
      <Select
        label="Customer Type"
        id="customer_type"
        options={customerTypeOptions}
        error={errors.customer_type?.message}
        {...register('customer_type', {
          required: 'Customer type is required',
        })}
      />
      
      <Input
        label="Dog Breed"
        id="breed"
        error={errors.breed?.message}
        {...register('breed', {
          required: 'Breed is required',
        })}
      />
      
      <Select
        label="Dog Gender"
        id="gender"
        options={genderOptions}
        error={errors.gender?.message}
        {...register('gender', {
          required: 'Gender is required',
        })}
      />
      
      <Select
        label="Issue Type"
        id="issue_type"
        options={issueTypeOptions}
        error={errors.issue_type?.message}
        {...register('issue_type', {
          required: 'Issue type is required',
        })}
      />
      
      <Textarea
        label="Issue Description"
        id="issue_description"
        error={errors.issue_description?.message}
        {...register('issue_description', {
          required: 'Issue description is required',
        })}
      />
      
      <Select
        label="Select Doctor"
        id="doctor_id"
        options={[
          { value: '', label: 'Select a doctor' },
          ...doctorOptions,
        ]}
        error={errors.doctor_id?.message}
        {...register('doctor_id', {
          required: 'Doctor is required',
        })}
      />
      
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3">
          <div className="flex">
            <div className="text-sm text-green-700">{successMessage}</div>
          </div>
        </div>
      )}
      
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        Add Patient
      </Button>
    </form>
  );
}