import React from 'react';
import clsx from 'clsx';

const FormItem = ({ children, error, title, containerClassname = null, titleClassname = null }: {
  error?: any | null
  title: string,
  children: React.ReactNode,
  containerClassname?: string,
  titleClassname?: string
}) => {
    
  return (
      <div className={clsx('space-y-2 items-center gap-2 grid grid-cols-1 md:grid-cols-3', containerClassname)}>
          <label className={clsx('block text-sm font-medium whitespace-nowrap', titleClassname)}>{title}</label>
          <div className="col-span-2">
              {children}
              {error && (
                  <p className="text-red-500 text-sm">{error?.message}</p>
              )}
          </div>
      </div>
  );
};

export default FormItem;