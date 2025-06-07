'use client';
import { DownloadIcon } from 'lucide-react';
import React from 'react';

const downloadPDF = (url, code) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = code + '_' + url.split('/').pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const DownloadButton = ({ url, code }) => (
    <button
        onClick={() => downloadPDF(process.env.NEXT_PUBLIC_CF_R2_ENDPOINT + '/' + url, code)}
        className="text-primary border duration-100 hover:border-primary/40 group bg-blue-50 px-4 flex items-center justify-center rounded-lg gap-1 py-1 w-max"
    >
        Download
        <DownloadIcon size="18" className="opacity-70 group-hover:opacity-100" />
    </button>
);

export default DownloadButton;