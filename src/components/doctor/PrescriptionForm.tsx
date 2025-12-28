import { useForm, useFieldArray } from 'react-hook-form';
import { useCreatePrescriptionMutation } from '../../store/api';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Plus, Trash } from 'lucide-react';
import { Prescription } from '../../types';
import { useState } from 'react';

interface PrescriptionFormProps {
  patientId: string;
  onSuccess: () => void;
}

type FormData = Omit<Prescription, 'id' | 'created_at'>;

export function PrescriptionForm({ patientId, onSuccess }: PrescriptionFormProps) {
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      patient_id: patientId,
      diagnosis: '',
      description: '',
      medicines: [{ name: '', type: 'tablet', timing: 'after_food', duration: 7 }],
      pricing: 0,
      follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines',
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      await createPrescription(data).unwrap();
      setSuccessMessage('Prescription added successfully');
      onSuccess();
    } catch (error) {
      console.error('Error adding prescription:', error);
    }
  };
  
  const medicineTypeOptions = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'syrup', label: 'Syrup' },
  ];
  
  const timingOptions = [
    { value: 'before_food', label: 'Before Food' },
    { value: 'after_food', label: 'After Food' },
  ];
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Diagnosis Information</h3>
        
        <Input
          label="Diagnosis"
          id="diagnosis"
          error={errors.diagnosis?.message}
          {...register('diagnosis', {
            required: 'Diagnosis is required',
          })}
        />
        
        <Textarea
          label="Description"
          id="description"
          error={errors.description?.message}
          {...register('description', {
            required: 'Description is required',
          })}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Medicines</h3>
          <Button
            type="button"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => append({ name: '', type: 'tablet', timing: 'after_food', duration: 7 })}
          >
            Add Medicine
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Medicine {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                icon={<Trash size={16} />}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
            
            <Input
              label="Medicine Name"
              id={`medicines.${index}.name`}
              error={errors.medicines?.[index]?.name?.message}
              {...register(`medicines.${index}.name` as const, {
                required: 'Medicine name is required',
              })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Type"
                id={`medicines.${index}.type`}
                options={medicineTypeOptions}
                {...register(`medicines.${index}.type` as const)}
              />
              
              <Select
                label="Timing"
                id={`medicines.${index}.timing`}
                options={timingOptions}
                {...register(`medicines.${index}.timing` as const)}
              />
              
              <Input
                label="Duration (days)"
                id={`medicines.${index}.duration`}
                type="number"
                min={1}
                error={errors.medicines?.[index]?.duration?.message}
                {...register(`medicines.${index}.duration` as const, {
                  required: 'Duration is required',
                  min: { value: 1, message: 'Minimum duration is 1 day' },
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Information</h3>
        
        <Input
          label="Pricing (in $)"
          id="pricing"
          type="number"
          min={0}
          step="0.01"
          error={errors.pricing?.message}
          {...register('pricing', {
            required: 'Pricing is required',
            min: { value: 0, message: 'Minimum price is $0' },
            valueAsNumber: true,
          })}
        />
        
        <Input
          label="Follow-up Date"
          id="follow_up_date"
          type="date"
          error={errors.follow_up_date?.message}
          {...register('follow_up_date', {
            required: 'Follow-up date is required',
          })}
        />
      </div>
      
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
        Submit Prescription
      </Button>
    </form>
  );
}