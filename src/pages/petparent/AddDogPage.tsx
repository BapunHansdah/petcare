import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useGetPetParentQuery, useCreateDogMutation } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Upload, ArrowLeft } from 'lucide-react';

interface FormData {
  name: string;
  age: number;
  breed: string;
  weight: number;
}

export function AddDogPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const [createDog, { isLoading }] = useCreateDogMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!petParent) return;
    
    try {
      // In a real app, we would upload the avatar to Supabase Storage
      const avatarUrl = avatarPreview || undefined;
      
      await createDog({
        pet_parent_id: petParent.id,
        name: data.name,
        age: data.age,
        breed: data.breed,
        weight: data.weight,
        avatar_url: avatarUrl,
      }).unwrap();
      
      navigate('/pet-parent/dogs');
    } catch (error) {
      console.error('Error creating dog:', error);
    }
  };
  
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
          <h1 className="text-2xl font-bold">Add New Dog</h1>
          <p className="text-gray-600">Add your furry family member</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div
                className={`w-32 h-32 rounded-full overflow-hidden border-2 border-dashed ${
                  avatarPreview ? 'border-transparent' : 'border-gray-300'
                } flex items-center justify-center bg-gray-50`}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Dog avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <label
                htmlFor="avatar"
                className="cursor-pointer inline-flex items-center space-x-2 text-sm font-medium text-pink-600 hover:text-pink-500"
              >
                <span>{avatarPreview ? 'Change photo' : 'Upload photo'}</span>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Dog's Name"
                id="name"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Dog name is required',
                })}
              />
              
              <Input
                label="Age (years)"
                id="age"
                type="number"
                min={0}
                step="0.1"
                error={errors.age?.message}
                {...register('age', {
                  required: 'Age is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Age cannot be negative' },
                })}
              />
              
              <Input
                label="Breed"
                id="breed"
                error={errors.breed?.message}
                {...register('breed', {
                  required: 'Breed is required',
                })}
              />
              
              <Input
                label="Weight (kg)"
                id="weight"
                type="number"
                min={0}
                step="0.1"
                error={errors.weight?.message}
                {...register('weight', {
                  required: 'Weight is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Weight cannot be negative' },
                })}
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                Add Dog
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}