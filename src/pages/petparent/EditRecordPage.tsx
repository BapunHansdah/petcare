import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Camera, FileText, Stethoscope } from 'lucide-react';
import { useGetDogRecordsQuery, useUpdateDogRecordMutation } from '../../store/api';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DogRecord } from '../../types';

interface FormData {
  title: string;
  type: 'image' | 'xray' | 'prescription' | 'document';
  date: string;
  notes?: string;
}

export function EditRecordPage() {
  const { dogId, recordId } = useParams<{ dogId: string; recordId: string }>();
  const navigate = useNavigate();
  const { data: records = [] } = useGetDogRecordsQuery(dogId || '');
  const [updateDogRecord, { isLoading }] = useUpdateDogRecordMutation();
  
  const [filePreview, setFilePreview] = useState<string | null | undefined>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const record = records.find(r => r.id === recordId);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  
  const recordType = watch('type');
  
  useEffect(() => {
    if (record) {
      setValue('title', record.title);
      setValue('type', record.type);
      setValue('date', record.date);
      setValue('notes', record.notes || '');
      setFilePreview(record.file_url);
    }
  }, [record, setValue]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!recordId) return;
    
    try {
      const updates: Partial<DogRecord> = {
        title: data.title,
        type: data.type,
        date: data.date,
        notes: data.notes,
      };
      
      // If a new file was selected, update the file URL
      if (selectedFile) {
        updates.file_url = filePreview;
      }
      
      await updateDogRecord({
        id: recordId,
        updates,
      }).unwrap();
      
      navigate(`/pet-parent/dogs/${dogId}`);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };
  
  const recordTypeOptions = [
    { value: 'image', label: 'Photo' },
    { value: 'xray', label: 'X-Ray' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'document', label: 'Document' },
  ];
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'image': return <Camera size={24} className="text-blue-500" />;
      case 'xray': return <Stethoscope size={24} className="text-green-500" />;
      case 'prescription': return <FileText size={24} className="text-purple-500" />;
      default: return <FileText size={24} className="text-orange-500" />;
    }
  };
  
  if (!record) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Record not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate(`/pet-parent/dogs/${dogId}`)}
        >
          Back to Dog Details
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
          onClick={() => navigate(`/pet-parent/dogs/${dogId}`)}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Medical Record</h1>
          <p className="text-gray-600">Update record details</p>
        </div>
      </div>
      
      <Card>
        <Card.Content className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Record Title"
                id="title"
                placeholder="e.g., Annual Checkup, Vaccination Record"
                error={errors.title?.message}
                {...register('title', {
                  required: 'Title is required',
                })}
              />
              
              <Select
                label="Record Type"
                id="type"
                options={recordTypeOptions}
                error={errors.type?.message}
                {...register('type', {
                  required: 'Type is required',
                })}
              />
            </div>
            
            <Input
              label="Date"
              id="date"
              type="date"
              error={errors.date?.message}
              {...register('date', {
                required: 'Date is required',
              })}
            />
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Current File
              </label>
              
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {filePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                        {getRecordIcon(recordType)}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Click to change file
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
            <Textarea
              label="Notes (Optional)"
              id="notes"
              placeholder="Add any additional notes about this record..."
              {...register('notes')}
            />
            
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/pet-parent/dogs/${dogId}`)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                Update Record
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}