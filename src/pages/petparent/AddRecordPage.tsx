import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ArrowLeft, Upload, Camera, FileText, Stethoscope } from 'lucide-react';
import { useGetDogsQuery, useCreateDogRecordMutation } from '../../store/api';
import { useGetPetParentQuery } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface FormData {
  title: string;
  type: 'image' | 'xray' | 'prescription' | 'document';
  date: string;
  notes?: string;
}

export function AddRecordPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [] } = useGetDogsQuery(petParent?.id || '');
  const [createDogRecord, { isLoading }] = useCreateDogRecordMutation();
  
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const dog = dogs.find(d => d.id === id);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'image',
    },
  });
  
  const recordType = watch('type');
  
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
    if (!id || !selectedFile) return;
    
    try {
      // In a real app, we would upload the file to Supabase Storage
      // For this demo, we'll use a placeholder URL
      const fileUrl = filePreview || 'https://via.placeholder.com/400';
      
      await createDogRecord({
        dog_id: id,
        title: data.title,
        type: data.type,
        file_url: fileUrl,
        date: data.date,
        notes: data.notes,
      }).unwrap();
      
      navigate(`/pet-parent/dogs/${id}`);
    } catch (error) {
      console.error('Error creating record:', error);
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
  
  if (!dog) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Dog not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate('/pet-parent/dogs')}
        >
          Back to Dogs
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
          onClick={() => navigate(`/pet-parent/dogs/${id}`)}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Medical Record</h1>
          <p className="text-gray-600">Add a new record for {dog.name}</p>
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
                Upload File
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
                    required
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
                onClick={() => navigate(`/pet-parent/dogs/${id}`)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!selectedFile}
                className="flex-1"
              >
                Add Record
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}