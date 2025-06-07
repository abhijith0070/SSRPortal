import React from 'react';
import { Control, Controller, DeepRequired, FieldErrorsImpl, FieldValues, GlobalError } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TProjectSubmissionForm } from '@/app/(submissions)/project-submission/form-type';

export interface IFormSection {
  control?: Control<TProjectSubmissionForm, any>
  errors?: Partial<FieldErrorsImpl<DeepRequired<FieldValues>>> & { root?: Record<string, GlobalError> & GlobalError }
}

type FormSectionProps = {
  Icon: LucideIcon
  title: string
  description?: string
  customFooterRender?: (() => React.ReactNode) | null
  items: {
    name: string
    isHidden?: boolean
    label?: string
    placeholder?: string
    renderer: ({ field, fieldState, formState } : {
      field: any
      fieldState: any
      formState: any
    }) => React.ReactElement
  }[]
} & IFormSection;

const FormSection = ({ control, Icon, title, description = null, items, customFooterRender = null }: FormSectionProps) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
                {Icon && <Icon className="h-5 w-5" />}
                {title}
            </CardTitle>
            {description && (
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}
        </CardHeader>
        <CardContent className="space-y-6">
            {items.filter(i => !i?.isHidden).map(item => (
                <Controller
                    key={item.name}
                    name={item.name as any}
                    control={control}
                    render={item.renderer}
                />
            ))}
        </CardContent>
        {customFooterRender && (
            <CardFooter>
                {customFooterRender()}
            </CardFooter>
        )}
    </Card>
);

export default FormSection;