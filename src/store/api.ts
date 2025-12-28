import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../lib/supabase';
// import { Hospital, Doctor, Patient, Prescription } from '../types';
import { Hospital, Doctor, Patient, Prescription, PetParent, Dog, DogRecord, Reminder, VisitHistory } from '../types';

export const api = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Hospital', 'Doctor', 'Patient', 'Prescription', 'PetParent', 'Dog', 'DogRecord', 'Reminder', 'VisitHistory'],
  endpoints: (builder) => ({
    getHospital: builder.query<Hospital | null, string>({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Hospital'],
    }),
    
    createHospital: builder.mutation<Hospital, Partial<Hospital>>({
      queryFn: async (hospital) => {
        const { data, error } = await supabase
          .from('hospitals')
          .insert(hospital)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Hospital'],
    }),
    
    getDoctor: builder.query<Doctor | null, string>({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Doctor'],
    }),
    
    createDoctor: builder.mutation<Doctor, Partial<Doctor>>({
      queryFn: async (doctor) => {
        const { data, error } = await supabase
          .from('doctors')
          .insert(doctor)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Doctor'],
    }),
    
    getDoctorsByHospital: builder.query<Doctor[], string>({
      queryFn: async (hospitalId) => {
        // if (!hospitalId) {
        //   return { data: [] };
        // }
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('hospital_id', hospitalId);
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Doctor'],
    }),
    
    getPatients: builder.query<Patient[], { hospitalId?: string; doctorId?: string; status?: string }>({
      queryFn: async ({ hospitalId, doctorId, status }) => {
        let query = supabase.from('patients').select('*');
        
        if (hospitalId) {
          query = query.eq('hospital_id', hospitalId);
        }
        
        if (doctorId) {
          query = query.eq('doctor_id', doctorId);
        }
        
        if (status) {
          query = query.eq('status', status);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Patient'],
    }),
    
    createPatient: builder.mutation<Patient, Partial<Patient>>({
      queryFn: async (patient) => {
        const { data, error } = await supabase
          .from('patients')
          .insert(patient)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Patient'],
    }),
    
    getPatientById: builder.query<Patient, string>({
      queryFn: async (patientId) => {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Patient'],
    }),
    
    getPrescription: builder.query<Prescription | null, string>({
      queryFn: async (patientId) => {
        const { data, error } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('patient_id', patientId)
          .single();
        
        if (error && error.code !== 'PGRST116') { // No rows returned
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data: data || null };
      },
      providesTags: ['Prescription'],
    }),
    
    createPrescription: builder.mutation<Prescription, Partial<Prescription>>({
      queryFn: async (prescription) => {
        const { data, error } = await supabase
          .from('prescriptions')
          .insert(prescription)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        // Update patient status to completed
        await supabase
          .from('patients')
          .update({ status: 'completed' })
          .eq('id', prescription.patient_id);
        
        return { data };
      },
      invalidatesTags: ['Prescription', 'Patient'],
    }),
     // Pet Parent endpoints
    getPetParent: builder.query<PetParent | null, string>({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('pet_parents')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['PetParent'],
    }),

    createPetParent: builder.mutation<PetParent, Partial<PetParent>>({
      queryFn: async (petParent) => {
        const { data, error } = await supabase
          .from('pet_parents')
          .insert(petParent)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['PetParent'],
    }),

    // Dog endpoints
    getDogs: builder.query<Dog[], string>({
      queryFn: async (petParentId) => {
        const { data, error } = await supabase
          .from('dogs')
          .select('*')
          .eq('pet_parent_id', petParentId)
          .order('created_at', { ascending: false });
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Dog'],
    }),

    createDog: builder.mutation<Dog, Partial<Dog>>({
      queryFn: async (dog) => {
        const { data, error } = await supabase
          .from('dogs')
          .insert(dog)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Dog'],
    }),

    updateDog: builder.mutation<Dog, { id: string; updates: Partial<Dog> }>({
      queryFn: async ({ id, updates }) => {
        const { data, error } = await supabase
          .from('dogs')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Dog'],
    }),

    deleteDog: builder.mutation<void, string>({
      queryFn: async (dogId) => {
        const { error } = await supabase
          .from('dogs')
          .delete()
          .eq('id', dogId);
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data: undefined };
      },
      invalidatesTags: ['Dog', 'DogRecord', 'Reminder'],
    }),

    // Dog Records endpoints
    getDogRecords: builder.query<DogRecord[], string>({
      queryFn: async (dogId) => {
        const { data, error } = await supabase
          .from('dog_records')
          .select('*')
          .eq('dog_id', dogId)
          .order('date', { ascending: false });
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['DogRecord'],
    }),

    createDogRecord: builder.mutation<DogRecord, Partial<DogRecord>>({
      queryFn: async (record) => {
        const { data, error } = await supabase
          .from('dog_records')
          .insert(record)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['DogRecord'],
    }),

    updateDogRecord: builder.mutation<DogRecord, { id: string; updates: Partial<DogRecord> }>({
      queryFn: async ({ id, updates }) => {
        const { data, error } = await supabase
          .from('dog_records')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['DogRecord'],
    }),

    deleteDogRecord: builder.mutation<void, string>({
      queryFn: async (recordId) => {
        const { error } = await supabase
          .from('dog_records')
          .delete()
          .eq('id', recordId);
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data: undefined };
      },
      invalidatesTags: ['DogRecord'],
    }),

    // Reminders endpoints
    getReminders: builder.query<Reminder[], string>({
      queryFn: async (petParentId) => {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('pet_parent_id', petParentId)
          .order('reminder_date', { ascending: true });
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['Reminder'],
    }),

    createReminder: builder.mutation<Reminder, Partial<Reminder>>({
      queryFn: async (reminder) => {
        const { data, error } = await supabase
          .from('reminders')
          .insert(reminder)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Reminder'],
    }),

    updateReminder: builder.mutation<Reminder, { id: string; updates: Partial<Reminder> }>({
      queryFn: async ({ id, updates }) => {
        const { data, error } = await supabase
          .from('reminders')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      invalidatesTags: ['Reminder'],
    }),

    deleteReminder: builder.mutation<void, string>({
      queryFn: async (reminderId) => {
        const { error } = await supabase
          .from('reminders')
          .delete()
          .eq('id', reminderId);
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data: undefined };
      },
      invalidatesTags: ['Reminder'],
    }),

    // Visit History endpoints
    getVisitHistory: builder.query<VisitHistory[], { petParentId: string; phone: string }>({
      queryFn: async ({ petParentId, phone }) => {
        // First verify the phone number belongs to the pet parent
        const { data: petParent, error: petParentError } = await supabase
          .from('pet_parents')
          .select('phone')
          .eq('id', petParentId)
          .single();
        
        if (petParentError || petParent.phone !== phone) {
          return { error: { status: 'UNAUTHORIZED', data: 'Phone number verification failed' } };
        }

        const { data, error } = await supabase
          .from('visit_history')
          .select('*')
          .eq('pet_parent_id', petParentId)
          .order('visit_date', { ascending: false });
        
        if (error) {
          return { error: { status: error.code, data: error.message } };
        }
        
        return { data };
      },
      providesTags: ['VisitHistory'],
    }),
  }),
});

export const {
  useGetHospitalQuery,
  useCreateHospitalMutation,
  useGetDoctorQuery,
  useCreateDoctorMutation,
  useGetDoctorsByHospitalQuery,
  useGetPatientsQuery,
  useCreatePatientMutation,
  useGetPatientByIdQuery,
  useGetPrescriptionQuery,
  useCreatePrescriptionMutation,
   // Pet Parent hooks
  useGetPetParentQuery,
  useCreatePetParentMutation,
  // Dog hooks
  useGetDogsQuery,
  useCreateDogMutation,
  useUpdateDogMutation,
  useDeleteDogMutation,
  // Dog Records hooks
  useGetDogRecordsQuery,
  useCreateDogRecordMutation,
  useUpdateDogRecordMutation,
  useDeleteDogRecordMutation,
  // Reminders hooks
  useGetRemindersQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  // Visit History hooks
  useGetVisitHistoryQuery,
} = api;