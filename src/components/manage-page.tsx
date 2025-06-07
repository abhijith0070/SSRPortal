import React, { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type TManageWrapper = {
  breadcrumbs: {
    title: string;
    route: string;
  }[];
  title: string;
  children: ReactNode;    
  className?: string;
};


const ManageWrapper = ({ breadcrumbs, title, children, className = '' } : TManageWrapper) => {
  return (
      <div className="p-4 flex-grow flex flex-col container mx-auto">
          <div>
              <div className="text-base mb-2 font-medium text-gray-900">
                  {breadcrumbs.map((breadcrumb, index) => (
                      <span key={index}>
                          <Link href={breadcrumb.route} className="text-gray-500 hover:text-primary">
                              {breadcrumb.title}
                          </Link>
                          {index !== breadcrumbs.length - 1 ? <span className="text-gray-500 mx-2">/</span> : null}
                      </span>
                  ))}
              </div>
              <div className="text-3xl font-bold text-gray-900">
                  {title}
              </div>
          </div>
          <div className={clsx(['flex-grow', className])}>
              {children}
          </div>
      </div>
  );
};

export default ManageWrapper;