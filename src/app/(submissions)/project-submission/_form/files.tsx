import React from 'react';
import { UploadIcon } from 'lucide-react';

import FormSection, { IFormSection } from '@/app/(submissions)/project-submission/_form/_section';
import FormItem from '@/app/(submissions)/project-submission/_form/_item';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

type FileFieldsSectionProps = { uploadProgress: any } & IFormSection;


const FileFieldsSection = ({ control, errors, uploadProgress }: FileFieldsSectionProps) => {
    
  const FILE_SECTION_ITEMS = ['report', 'presentation', 'video', 'poster', 'photos'].map((fileType) => ({
    name: fileType,
    renderer: ({ field: { onChange } }) => (
        <FormItem title={fileType.charAt(0).toUpperCase() + fileType.slice(1)} error={errors?.[fileType]}>
            <Input
                type="file"
                onChange={(e) => {
                  if(fileType === 'photos') onChange(e.target.files);
                  else onChange(e.target.files?.[0]);
                }}
                accept={fileType === 'report' ? '.pdf' :
                  fileType === 'presentation' ? '.pdf,.ppt,.pptx' :
                    fileType === 'video' ? 'video/mp4' :
                      'image/*'
                }
                multiple={fileType === 'photos'}
                className="cursor-pointer"
                required
            />
            {uploadProgress[fileType] > 0 && (
                <Progress value={uploadProgress[fileType]} className="h-2" /> 
            )}
        </FormItem>
    ),
  }));

  return (
      <FormSection
          control={control}
          Icon={UploadIcon}
          title="Project Files"
          description="Upload your project files below."
          items={FILE_SECTION_ITEMS}
      />
  );
};

export default FileFieldsSection;