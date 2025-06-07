// @ts-ignore
import React from 'react';
import { MapPinIcon } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection, { IFormSection } from '@/app/(submissions)/project-submission/_form/_section';
import FormItem from '@/app/(submissions)/project-submission/_form/_item';
import { Input } from '@/components/ui/input';

type LocationFieldsSectionProps = {
  projectLocationType: string
} & IFormSection;

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const LocationFieldsSection = ({ control, projectLocationType, errors }: LocationFieldsSectionProps) => (
    <FormSection
        control={control}
        Icon={MapPinIcon}
        title="Project Location"
        description="Enter details about your project location."
        items={[
          {
            name: 'projectLocation.type',
            renderer: ({ field }) => (
                <FormItem title="Location Type" error={errors?.projectLocation}>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            ),
          },
          {
            name: 'projectLocation.location',
            isHidden: projectLocationType === 'online',
            renderer: ({ field }) => (
                <FormItem title="Location" error={errors?.projectLocation}>
                    <Input {...field} placeholder="Enter location" />
                </FormItem>
            ),
          },
          {
            name: 'projectLocation.city',
            isHidden: projectLocationType === 'online',
            renderer: ({ field }) => (
                <FormItem title="City" error={errors?.projectLocation}>
                    <Input {...field} placeholder="Enter city" />
                </FormItem>
            ),
          },
          {
            name: 'projectLocation.state',
            isHidden: projectLocationType === 'online',
            renderer: ({ field }) => (
                <FormItem title="State" error={errors?.projectLocation}>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                            {STATES.map((state) => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormItem>
            ),
          },
        ]}
    />
);

export default LocationFieldsSection;