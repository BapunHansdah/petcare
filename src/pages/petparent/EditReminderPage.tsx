import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ArrowLeft, Bell } from 'lucide-react';
import { useGetPetParentQuery, useGetDogsQuery, useGetRemindersQuery, useUpdateReminderMutation } from '../../store/api';
import { RootState } from '../../store';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface FormData {
  title: string;
  type: 'food' | 'tablet' | 'vet_visit' | 'vaccination' | 'other';
  dog_id?: string;
  reminder_date: string;
  reminder_time: string;
  is_recurring: boolean;
  recurring_interval?: 'daily' | 'weekly' | 'monthly';
  notes?: string;
}

export function EditReminderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: petParent } = useGetPetParentQuery(user?.id || '');
  const { data: dogs = [] } = useGetDogsQuery(petParent?.id || '');
  const { data: reminders = [] } = useGetRemindersQuery(petParent?.id || '');
  const [updateReminder, { isLoading }] = useUpdateReminderMutation();
  
  const reminder = reminders.find(r => r.id === id);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  
  const isRecurring = watch('is_recurring');
  
  useEffect(() => {
    if (reminder) {
      setValue('title', reminder.title);
      setValue('type', reminder.type);
      setValue('dog_id', reminder.dog_id || '');
      setValue('reminder_date', reminder.reminder_date);
      setValue('reminder_time', reminder.reminder_time);
      setValue('is_recurring', reminder.is_recurring);
      setValue('recurring_interval', reminder.recurring_interval || undefined);
      setValue('notes', reminder.notes || '');
    }
  }, [reminder, setValue]);
  
  const onSubmit = async (data: FormData) => {
    if (!id) return;

    
    try {
      await updateReminder({
        id,
        updates: {
          title: data.title,
          type: data.type,
          dog_id: data.dog_id,
          reminder_date: data.reminder_date,
          reminder_time: data.reminder_time,
          is_recurring: data.is_recurring,
          recurring_interval: data.is_recurring ? data.recurring_interval : undefined,
          notes: data.notes,
        },
      }).unwrap();
      
      navigate('/pet-parent/reminders');
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };
  
  const typeOptions = [
    { value: 'food', label: '🍽️ Food' },
    { value: 'tablet', label: '💊 Tablet/Medicine' },
    { value: 'vet_visit', label: '🏥 Vet Visit' },
    { value: 'vaccination', label: '💉 Vaccination' },
    { value: 'other', label: '📋 Other' },
  ];
  
  const dogOptions = [
    { value: '', label: 'All Dogs' },
    ...dogs.map(dog => ({
      value: dog.id,
      label: dog.name,
    })),
  ];
  
  const recurringOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];
  
  if (!reminder) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Reminder not found</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => navigate('/pet-parent/reminders')}
        >
          Back to Reminders
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
          onClick={() => navigate('/pet-parent/reminders')}
        >
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Reminder</h1>
          <p className="text-gray-600">Update your reminder details</p>
        </div>
      </div>
      
      <Card>
        <Card.Content className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Reminder Title"
              id="title"
              placeholder="e.g., Give morning medication, Vet checkup"
              error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
              })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Reminder Type"
                id="type"
                options={typeOptions}
                error={errors.type?.message}
                {...register('type', {
                  required: 'Type is required',
                })}
              />
              
              <Select
                label="For Dog (Optional)"
                id="dog_id"
                options={dogOptions}
                {...register('dog_id')}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Date"
                id="reminder_date"
                type="date"
                error={errors.reminder_date?.message}
                {...register('reminder_date', {
                  required: 'Date is required',
                })}
              />
              
              <Input
                label="Time"
                id="reminder_time"
                type="time"
                error={errors.reminder_time?.message}
                {...register('reminder_time', {
                  required: 'Time is required',
                })}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_recurring"
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  {...register('is_recurring')}
                />
                <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700">
                  Make this a recurring reminder
                </label>
              </div>
              
              {isRecurring && (
                <Select
                  label="Repeat Interval"
                  id="recurring_interval"
                  options={recurringOptions}
                  error={errors.recurring_interval?.message}
                  {...register('recurring_interval', {
                    required: isRecurring ? 'Recurring interval is required' : false,
                  })}
                />
              )}
            </div>
            
            <Textarea
              label="Notes (Optional)"
              id="notes"
              placeholder="Add any additional notes or instructions..."
              {...register('notes')}
            />
            
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/pet-parent/reminders')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                icon={<Bell size={16} />}
                className="flex-1"
              >
                Update Reminder
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}