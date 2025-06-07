import clsx from 'clsx';
import React from 'react';
import Link from 'next/link';

import Spinner from '@/components/spinner';

const Button = ({ 
  children, className, isLoading, isDisabled, type = 'button', variant = 'light', link, ...props
} : {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  link?: string;
  onClick?: any;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark';
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) => {
  const variantClassNames = {
    primary: 'bg-primary text-primaryTextColor hover:bg-primary/90 focus-visible:ring-primary-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    secondary: 'bg-white text-primary-600 hover:bg-gray-50 focus-visible:ring-primary-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:ring-yellow-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    info: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    light: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus-visible:ring-gray-500 disabled:bg-gray-200 disabled:text-gray-700 disabled:cursor-not-allowed',
  };
  return link ? (
      <Link
          {...props}
          href={link}
          className={clsx([
            'px-4 py-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            variantClassNames[variant], className,
          ])}
      >
          {isLoading && <Spinner /> }
          {children}
      </Link>
  ) : (
      <button
          {...props}
          type={type}
          disabled={isDisabled || isLoading}
          className={clsx([
            'px-4 py-3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            variantClassNames[variant], className,
          ])}
      >
          {isLoading && <Spinner /> }
          {children}
      </button>
  );
};

export default Button;