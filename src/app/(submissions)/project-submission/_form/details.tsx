import React from 'react';
import { FileText } from 'lucide-react';

import FormSection, { IFormSection } from '@/app/(submissions)/project-submission/_form/_section';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormItem from '@/app/(submissions)/project-submission/_form/_item';

type DetailsFieldsSectionProps = {
  projectCategory: string
} & IFormSection;

const CATEGORIES = [
  'Drug Awareness',
  'Cybersecurity Awareness',
  'Health and Wellbeing',
  'Indian Culture and Heritage',
  'Skill Building',
  'Other',
];

const DetailsFieldsSection = ({ control, errors, projectCategory }: DetailsFieldsSectionProps) => (
    <FormSection
        control={control}
        Icon={FileText}
        title="Project Details"
        description="Enter your project details below."
        items={[
          {
            name: 'projectTitle',
            renderer: ({ field }) => (
                <FormItem title="Project Title" error={errors?.projectTitle}>
                    <Input {...field} placeholder="Enter your project title" />
                </FormItem>
            ),
          },
          // {
          //   name: 'projectDescription',
          //   renderer: ({ field }) => (
          //       <FormItem title="Project Description" error={errors?.projectDescription} titleClassname="md:mb-16">
          //           <Textarea {...field} placeholder="Describe your project" className="h-32" />
          //       </FormItem>
          //   ),
          // },
          {
            name: 'projectCategory',
            renderer: ({ field }) => (
                <FormItem title="Project Category" error={errors?.projectCategory}>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select project category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(category => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            ),
          }, 
          {
            name: 'otherCategory',
            isHidden: projectCategory !== 'Other',
            renderer: ({ field }) => (
                <FormItem title="Specify Other Category" error={errors?.otherCategory}>
                    <Input {...field} placeholder="Enter category name" />
                </FormItem>
            ),
          },
        ]}
    />
);

export default DetailsFieldsSection;