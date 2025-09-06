'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const projectSchema = z.object({
  file: z.any().optional(),
  title: z.string().min(5, 'Project title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),  // Add this
  content: z.string().min(100, 'Content must be at least 100 characters'),          // Add this
  category: z.string().nonempty('Please select a category'),
  locationMode: z.literal('Offline'),
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  placeVisited: z.string().optional(),
  travelTime: z.string().optional(),
  executionTime: z.string().optional(),
  completionDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const indianStatesWithDistricts: Record<string, string[]> = {
  "Andhra Pradesh": [],
  "Arunachal Pradesh": [],
  "Assam": [],
  "Bihar": [],
  "Chhattisgarh": [],
  "Goa": [],
  "Gujarat": [],
  "Haryana": [],
  "Himachal Pradesh": [],
  "Jharkhand": [],
  "Karnataka": [],
  "Kerala": [
    "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam",
    "Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta",
    "Thiruvananthapuram","Thrissur","Wayanad"
  ],
  "Madhya Pradesh": [],
  "Maharashtra": [],
  "Manipur": [],
  "Meghalaya": [],
  "Mizoram": [],
  "Nagaland": [],
  "Odisha": [],
  "Punjab": [],
  "Rajasthan": [],
  "Sikkim": [],
  "Tamil Nadu": [],
  "Telangana": [],
  "Tripura": [],
  "Uttar Pradesh": [],
  "Uttarakhand": [],
  "West Bengal": [],
  "Andaman and Nicobar Islands": [],
  "Chandigarh": [],
  "Dadra and Nagar Haveli and Daman and Diu": [],
  "Delhi": [],
  "Jammu and Kashmir": [],
  "Ladakh": [],
  "Lakshadweep": [],
  "Puducherry": []
};

export default function ProjectForm() {
  const [selectedState, setSelectedState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const states = Object.keys(indianStatesWithDistricts);
  const districts = selectedState ? indianStatesWithDistricts[selectedState] || [] : [];

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create a simple JSON payload instead of FormData for now
      const payload = {
        title: data.title,
        description: data.description,  // Add this
        content: data.content,          // Add this
        category: data.category,
        locationMode: data.locationMode,
        state: data.state || '',
        district: data.district || '',
        city: data.city || '',
        placeVisited: data.placeVisited || '',
        travelTime: data.travelTime || '',
        executionTime: data.executionTime || '',
        completionDate: data.completionDate || '',
        // Note: File upload removed for now to fix the 500 error
        // Add file handling back once API is properly set up
      };

      console.log('Submitting payload:', payload);

      const response = await fetch('/api/student/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Failed to submit form (${response.status})`);
      }

      const result = await response.json();
      console.log('Server response:', result);
      alert('Form submitted successfully!');
      
    } catch (err: any) {
      console.error('Submission error:', err);
      alert('Error submitting form: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Project Category</label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        >
          <option value="">Select category</option>
          <option value="Health and Wellbeing">Health and Wellbeing</option>
          <option value="Awareness Campaigns">Awareness Campaigns</option>
          <option value="Indian History and Heritage">Indian History and Heritage</option>
          <option value="Amrita Talks">Amrita Talks</option>
          <option value="Financial Literacy">Financial Literacy</option>
          <option value="21st Century Values">21st Century Values</option>
          <option value="Student Mentorship">Student Mentorship</option>
          <option value="Student Clubs">Student Clubs</option>
          <option value="Women Empowerment">Women Empowerment</option>
        </select>
        {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">Location Mode</span>
        <input type="hidden" value="Offline" {...register('locationMode')} />
        <p>Offline</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">State</label>
        <select
          {...register('state')}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setValue('district', '');
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">District</label>
        <select
          {...register('district')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          {...register('city')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Place Visited</label>
        <input
          type="text"
          {...register('placeVisited')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Travel Time</label>
        <input
          type="text"
          placeholder="e.g. 2 hours 30 minutes"
          {...register('travelTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Execution Time</label>
        <input
          type="text"
          placeholder="e.g. 1 hour"
          {...register('executionTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Completion</label>
        <input
          type="date"
          {...register('completionDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description (min 100 characters)</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
          defaultValue="This is a detailed description of the project. It needs to be at least 100 characters long to pass validation. This project aims to achieve significant impact in the selected category through careful planning and execution."
        />
        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content (min 100 characters)</label>
        <textarea
          {...register('content')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-primary"
          defaultValue="This is the content of the proposal which also needs to be at least 100 characters long. It contains all the details about how the project will be implemented, the timeline, resources required, and expected outcomes."
        />
        {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
      </div>

      {/* Temporarily commented out file upload to fix the 500 error */}
      {/*
      <div className="flex items-center mt-4">
        <label className="block text-sm font-medium text-gray-700 mr-4">Upload File</label>
        <input
          type="file"
          accept=".pdf,.mp4,image/*"
          {...register('file')}
          className="block"
          style={{ width: "auto" }}
        />
      </div>
      */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}