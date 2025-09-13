'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { proposalSchema } from '@/lib/validation/proposal';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Extended schema with UI-specific fields
const projectSchema = proposalSchema.extend({
  file: z.any().optional(),
  category: z.string().min(1, 'Please select a category'),
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

// Status message type for better UI feedback
type StatusMessage = {
  type: 'success' | 'error' | 'info';
  message: string;
};

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

interface ExistingProposal {
  id: number;
  title: string;
  description: string;
  content: string;
  attachment?: string;
  link?: string;
  // Add metadata fields if they exist
  metadata?: {
    category?: string;
    locationMode?: string;
    state?: string;
    district?: string;
    city?: string;
    placeVisited?: string;
    travelTime?: string;
    executionTime?: string;
    completionDate?: string;
  };
}

interface ProjectFormProps {
  existingProposal?: ExistingProposal;
  onEditMode?: (isEdit: boolean) => void;
}

export default function ProjectForm({ existingProposal, onEditMode }: ProjectFormProps) {
  const [selectedState, setSelectedState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('Files selected:', files);
    
    if (files) {
      const fileArray = Array.from(files);
      console.log('File array created:', fileArray.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      // Validate files before adding
      const validFiles = fileArray.filter(file => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'video/mp4',
          'video/quicktime',
          'video/x-msvideo',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          console.warn(`Invalid file type: ${file.type} for file: ${file.name}`);
          return false;
        }
        
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
          console.warn(`File too large: ${file.size} bytes for file: ${file.name}`);
          return false;
        }
        
        return true;
      });
      
      console.log('Valid files:', validFiles.map(f => f.name));
      setSelectedFiles(prev => [...prev, ...validFiles]);
      
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload files to server
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Uploading file ${i + 1}/${files.length}: ${file.name} (${file.size} bytes, ${file.type})`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        console.log(`Upload response status for ${file.name}:`, uploadResponse.status);
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log(`Upload successful for ${file.name}:`, uploadResult);
          
          if (uploadResult.success && uploadResult.url) {
            uploadedUrls.push(uploadResult.url);
          } else {
            console.error(`Upload API returned success=false for ${file.name}:`, uploadResult);
            throw new Error(`Failed to upload ${file.name}: ${uploadResult.error || 'Unknown error'}`);
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error(`Failed to upload file ${file.name}:`, errorText);
          throw new Error(`Failed to upload ${file.name}: ${errorText}`);
        }
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error; // Re-throw to stop the process
      }
    }
    
    console.log(`Successfully uploaded ${uploadedUrls.length} files:`, uploadedUrls);
    return uploadedUrls;
  };

  // Pre-fill form with existing proposal data if editing
  useEffect(() => {
    if (existingProposal) {
      // Notify parent that we're in edit mode
      onEditMode?.(true);
      
      // Set basic fields
      setValue('title', existingProposal.title);
      setValue('description', existingProposal.description);
      setValue('content', existingProposal.content);
      
      // Set metadata fields if they exist
      if (existingProposal.metadata) {
        setValue('category', existingProposal.metadata.category || '');
        setValue('locationMode', 'Offline');
        setValue('state', existingProposal.metadata.state || '');
        setValue('district', existingProposal.metadata.district || '');
        setValue('city', existingProposal.metadata.city || '');
        setValue('placeVisited', existingProposal.metadata.placeVisited || '');
        setValue('travelTime', existingProposal.metadata.travelTime || '');
        setValue('executionTime', existingProposal.metadata.executionTime || '');
        setValue('completionDate', existingProposal.metadata.completionDate || '');
        
        // Set selected state for district dropdown
        if (existingProposal.metadata.state) {
          setSelectedState(existingProposal.metadata.state);
        }
      }
    } else {
      // Notify parent that we're in create mode
      onEditMode?.(false);
    }
  }, [existingProposal, setValue, onEditMode]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    console.log('Form submitted with data:', data);
    console.log('Form validation passed - proceeding with submission');
    
    try {
      // Check if user is logged in and has a team
      try {
        const authCheck = await fetch('/api/test/auth');
        if (!authCheck.ok) {
          const authError = await authCheck.json();
          console.error('Auth check failed:', authError);
          throw new Error(authError.message || 'Authentication failed. Please try logging in again.');
        }
        
        const authData = await authCheck.json();
        console.log('Auth check succeeded:', authData);
        
        if (!authData.success) {
          throw new Error('Authentication error');
        }
        
        if (!authData.data.hasTeam) {
          throw new Error('You must be part of a team to submit a proposal. Please join or create a team first.');
        }
      } catch (e) {
        console.error('Auth error:', e);
        throw new Error(e.message || 'Authentication error. Please try logging in again.');
      }
      
      // Upload files if any are selected
      let uploadedFileUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setStatusMessage({
          type: 'info',
          message: `Uploading ${selectedFiles.length} file(s)...`
        });
        
        console.log('Starting file upload for files:', selectedFiles.map(f => f.name));
        
        try {
          uploadedFileUrls = await uploadFiles(selectedFiles);
          console.log('File upload completed. URLs:', uploadedFileUrls);
          
          if (uploadedFileUrls.length === 0) {
            throw new Error('Failed to upload files');
          }
          
          if (uploadedFileUrls.length < selectedFiles.length) {
            console.warn(`Only ${uploadedFileUrls.length} of ${selectedFiles.length} files uploaded successfully`);
          }
          
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          throw new Error('Failed to upload files. Please try again.');
        }
      }
      
      // Only include fields that match the API schema
      const payload = {
        title: data.title,
        description: data.description,
        content: data.content,
        // Optional fields
        attachment: uploadedFileUrls.length > 0 ? uploadedFileUrls.join(',') : '',  // Store multiple file URLs as comma-separated string
        link: '',        // We'll add link field later
        
        // Extra metadata fields (these won't be used by the API validation
        // but will be available in the raw request body)
        _metadata: {
          category: data.category,
          locationMode: data.locationMode,
          state: data.state || '',
          district: data.district || '',
          city: data.city || '',
          placeVisited: data.placeVisited || '',
          travelTime: data.travelTime || '',
          executionTime: data.executionTime || '',
          completionDate: data.completionDate || '',
        }
      };

      console.log('Submitting payload:', payload);
      console.log('Payload validation check:');
      console.log('- title:', data.title?.length, 'chars');
      console.log('- description:', data.description?.length, 'chars');
      console.log('- content:', data.content?.length, 'chars');
      console.log('- attachment:', payload.attachment);
      console.log('- uploadedFileUrls:', uploadedFileUrls);

      // Use PUT method if editing existing proposal, POST for new proposal
      const apiUrl = existingProposal 
        ? `/api/student/proposals/${existingProposal.id}` 
        : '/api/student/proposals';
      
      const method = existingProposal ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        // Try to parse as JSON first
        let errorData;
        try {
          errorData = await response.json();
          console.error('Server error (JSON):', errorData);
        } catch (e) {
          // If not JSON, get as text
          const errorText = await response.text();
          console.error('Server error (Text):', errorText);
        }
        
        if (errorData?.error === 'Team not found') {
          throw new Error(`Your team information could not be found. Please make sure you have joined or created a team.`);
        } else if (errorData?.error === 'Proposal exists') {
          throw new Error(`You already have a proposal submitted. ${errorData.message || ''}`);
        } else if (errorData?.error === 'Validation failed') {
          console.error('Validation details:', errorData.details);
          const validationMessages = errorData.details?.map((detail: any) => 
            `${detail.path?.join('.') || 'field'}: ${detail.message}`
          ).join(', ') || 'Unknown validation error';
          throw new Error(`Form validation failed: ${validationMessages}`);
        } else {
          throw new Error(`Failed to submit form (${response.status}): ${errorData?.error || 'Unknown error'}`);
        }
      }

      const result = await response.json();
      console.log('Server response:', result);
      
      if (result.success) {
        const message = existingProposal 
          ? 'Proposal updated successfully! Redirecting to proposals page...'
          : 'Form submitted successfully! Redirecting to proposals page...';
          
        setStatusMessage({
          type: 'success',
          message: message
        });
        
        // Redirect to proposals page after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard/student/proposals';
        }, 2000);
      } else {
        // This shouldn't happen since we check !response.ok above, but just in case
        throw new Error(result.error || 'Unknown error occurred');
      }
      
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatusMessage({
        type: 'error',
        message: err.message || 'An unknown error occurred while submitting your form.'
      });
    } finally {
      setIsSubmitting(false);
      // Scroll to top to show the status message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-6 p-4 rounded-md ${
          statusMessage.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          statusMessage.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <div className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <p>{statusMessage.message}</p>
          </div>
        </div>
      )}
      
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

      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Supporting Files (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Drop files here or click to upload
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI, JPG, PNG, GIF
                </p>
                <p className="text-xs text-gray-500">
                  Maximum file size: 50MB per file
                </p>
              </div>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {file.type.startsWith('image/') ? (
                          <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        ) : file.type === 'application/pdf' ? (
                          <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        ) : file.type.startsWith('video/') ? (
                          <svg className="h-8 w-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        ) : (
                          <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-3 text-red-400 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {isSubmitting ? (existingProposal ? 'Updating...' : 'Submitting...') : (existingProposal ? 'Update Proposal' : 'Submit')}
        </button>
      </div>
    </form>
    </div>
  );
}