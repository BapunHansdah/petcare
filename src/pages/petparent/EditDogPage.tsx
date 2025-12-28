import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useGetDogsQuery, useUpdateDogMutation } from '../../store/api';
import { useGetPetParentQuery } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Upload, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Dog } from '../../types';

interface FormData {
  name: string;
  age: number;
  breed: string;
  weight: number;
  avatar_url?: string | null | undefined;
}



export function EditDogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [] } = useGetDogsQuery(petParent?.id || '');
  const [updateDog, { isLoading }] = useUpdateDogMutation();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const dog = dogs.find(d => d.id === id);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  
  useEffect(() => {
    if (dog) {
      setValue('name', dog.name);
      setValue('age', dog.age);
      setValue('breed', dog.breed);
      setValue('weight', dog.weight);
      setAvatarPreview(dog.avatar_url || null);
    }
  }, [dog, setValue]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!id) return;
    
    try {
      const updates : Partial<Dog> = {
        name: data.name,
        age: data.age,
        breed: data.breed,
        weight: data.weight,
      };
      
      // If a new avatar was selected, update the avatar URL
      if (selectedFile) {
        updates.avatar_url = avatarPreview;
      }
      
      await updateDog({
        id,
        updates,
      }).unwrap();
      
      navigate(`/pet-parent/dogs/${id}`);
    } catch (error) {
      console.error('Error updating dog:', error);
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
          <h1 className="text-2xl font-bold">Edit {dog.name}</h1>
          <p className="text-gray-600">Update your dog's information</p>
        </div>
      </div>
      
      <Card>
        <Card.Content className="p-6">
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
                onClick={() => navigate(`/pet-parent/dogs/${id}`)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="flex-1"
              >
                Update Dog
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}