'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TeamFieldsSection from '@/app/(submissions)/project-submission/_form/team';
import DetailsFieldsSection from '@/app/(submissions)/project-submission/_form/details';
import LocationFieldsSection from '@/app/(submissions)/project-submission/_form/location';
import FileFieldsSection from '@/app/(submissions)/project-submission/_form/files';
import Logo from '@/components/Logo';
import ProjectSubmissionConfirm from '@/app/(submissions)/project-submission/_form/confirm';
import ProjectSubmissionUploading from '@/app/(submissions)/project-submission/_form/uploading';
import ProjectSubmissionSuccess from '@/app/(submissions)/project-submission/_form/success';
import { TProjectSubmissionForm } from '@/app/(submissions)/project-submission/form-type';

const generateTeamIDs = () => {
  const currentYear = "24";
  return Array.from({ length: 150 }, (_, index) =>
    `SSR${currentYear}-${String(index + 1).padStart(3, '0')}`,
  );
};

const submissionSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  projectTitle: z.string().min(3, 'Project title must be at least 3 characters'),
  // projectDescription: z.string().min(10, 'Project description must be at least 10 characters').optional(),
  projectLocation: z.object({
    type: z.enum(['online', 'offline']),
    location: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
  projectCategory: z.string().min(1, 'Project category is required'),
  otherCategory: z.string().optional(),
  report: z.any().refine(file => file.type === 'application/pdf', 'Only PDF files allowed'),
  presentation: z.any().refine(file =>
    ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type),
  'Only PDF or PPT files allowed',
  ),
  video: z.any().refine(file => file.type.startsWith('video/'), 'Only video files allowed'),
  poster: z.any().refine(file => file.type.startsWith('image/'), 'Only image files allowed'),
});

const ProjectSubmissionForm = () => {

  // 0: Yet to start, 1: uploading, 8: Project Submission Failed, 9: Project Submitted
  const [isUploading, setIsUploading] = useState<0 | 1 | 8 | 9>(0);

  const [team, setTeam] = useState(null);
  const [currentUploadFile, setCurrentUploadFile] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const {
    control,
    watch,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<TProjectSubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      teamId: '',
      projectTitle: '',
      projectDescription: '',
      projectCategory: '',
      otherCategory: '',
      projectLocation: {
        type: 'online',
        location: '',
        city: '',
        state: '',
      },
      photos: [],
      report: null,
      video: null,
      poster: null,
      presentation: null,
    },
  });

  // @ts-ignore
  const projectLocationType = watch('projectLocation.type');

  // @ts-ignore
  const projectCategory = watch('projectCategory');

  const uploadFile = async (file, key, teamId) => {
    const extension = file.name.split('.').pop();
    const fileName = `${teamId.replace('-', '')}/${key}.${extension}`;

    const presignedUrlResponse = await axios.post('/api/generate-presigned-url', {
      fileName,
      fileType: file.type,
    });

    await axios.put(presignedUrlResponse.data.presignedUrl, file, {
      headers: { 'Content-Type': file.type },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(prev => ({ ...prev, [key]: percentCompleted }));
      },
    });

    return presignedUrlResponse.data.key;
  };

  const handleTeamSelection = async (selectedTeam) => {
    if(selectedTeam?.project?.id) {
      setError('teamId', {
        type: 'manual',
        message: 'This team has already submitted a project. Make sure you have selected the correct team.',
      });
      return false;
    }
    setError('teamId', null);
    setTeam(selectedTeam);
    return true;
  };

  const onConfirmSubmit = async () => {
    setIsConfirmDialogOpen(false);
    setIsUploading(1);

    try {
      const data = getValues();
      const uploadResults = {
        photos: [],
        video: null,
        report: null,
        poster: null,
        presentation: null,
      };

      // Upload required files
      const requiredFiles = ['report', 'presentation', 'video', 'poster'];
      for(const key of requiredFiles) {
        setCurrentUploadFile(key);
        uploadResults[key] = await uploadFile(data[key], key, data.teamId);
      }

      // Upload photo gallery
      if(data.photos?.length > 0) {
        const photoResults = await Promise.all(
          Array.from(data.photos).map((file, index) => {
            setCurrentUploadFile(`photo-${index}`);
            return uploadFile(file, `photo-${index}`, data.teamId);
          }),
        );
        uploadResults.photos = photoResults;
      }

      // Submit to database
      await axios.post('/api/submit-project', {
        ssrID: data.teamId,
        projectTitle: data.projectTitle,
        projectCategory: data.projectCategory,
        otherCategory: data.otherCategory,
        projectDescription: data.projectDescription,
        projectLocation: data.projectLocation,
        ...uploadResults,
      });

      toast.success('Project submitted successfully!');
      setIsUploading(9);
    } catch (error) {
      console.error('Submission failed', error);
      toast.error('Failed to submit project. Please try again.');
      setIsUploading(8);
    }
  };

  return (
      <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
              <div className="mx-auto flex justify-center mb-6"><Logo /></div>
              <Card className="mb-8">
                  <CardHeader>
                      <CardTitle className="text-2xl font-bold text-primary flex justify-between">
                          Project Submission Form
                      </CardTitle>
                      <CardDescription>
                          Share your completed project with all required documentation and media files.
                      </CardDescription>
                  </CardHeader>
              </Card>

              <form onSubmit={handleSubmit(() => setIsConfirmDialogOpen(true))} className="space-y-6">
                  <TeamFieldsSection
                      control={control}
                      teamIDs={generateTeamIDs()}
                      team={team}
                      setTeam={setTeam}
                      onTeamSelect={handleTeamSelection}
                      errors={errors}
                  />
                  <DetailsFieldsSection control={control} errors={errors} projectCategory={projectCategory} />
                  <LocationFieldsSection control={control} errors={errors} projectLocationType={projectLocationType} />
                  <FileFieldsSection control={control} errors={errors} uploadProgress={uploadProgress} />

                  <div className="flex items-center justify-center">
                      <Button
                          type="submit"
                          disabled={false}
                          className="w-full bg-primary hover:bg-primary/90 max-w-[300px] h-16 font-bold"
                      >
                          Submit Project
                      </Button>
                  </div>
              </form>

              <ProjectSubmissionConfirm
                  isOpen={isConfirmDialogOpen}
                  team={team}
                  onCancel={() => setIsConfirmDialogOpen(false)}
                  onNext={onConfirmSubmit}
              />

              <ProjectSubmissionUploading
                  isOpen={isUploading === 1}
                  uploadProgress={uploadProgress}
                  currentUploadFile={currentUploadFile}
              />

              <ProjectSubmissionSuccess
                  isOpen={isUploading === 9}
              />

              {isUploading === 1 && (
              <div className="text-white fixed bottom-4 text-center z-[101] text-sm max-w-3xl w-full">
                  Do not close the window until all operations are completed.
              </div>
              )}
          </div>
      </div>
  );
};

export default ProjectSubmissionForm;