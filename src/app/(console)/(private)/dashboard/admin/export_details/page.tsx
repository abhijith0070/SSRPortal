'use client';

import React, { useState } from 'react';
import { Download, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const ExportPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus('idle');
      setErrorMessage('');

      const response = await fetch('/api/admin/export');

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get filename from response header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : `teams-export-${new Date().toISOString().split('T')[0]}.csv`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setExportStatus('success');
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Export Team Data</h1>
          <p className="mt-2 text-gray-600">
            Download all team information including members, mentors, and project details in CSV format
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Export Info Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FileText className="h-12 w-12 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  CSV Export
                </h2>
                <p className="text-gray-600 mb-4">
                  The exported file will include the following information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Team Details</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Team Number & Status</li>
                      <li>• Project Title & Pillar</li>
                      <li>• Batch Information</li>
                      <li>• Creation & Update Dates</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">People & Projects</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Mentor & Lead Details</li>
                      <li>• Team Members & Roles</li>
                      <li>• Project Information</li>
                      <li>• Proposal Status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {exportStatus === 'success' && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-sm text-green-700">
                  Export completed successfully! Your file has been downloaded.
                </p>
              </div>
            </div>
          )}

          {exportStatus === 'error' && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <p className="text-sm text-red-700 font-medium">
                    Export failed
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Ready to export?</p>
                <p className="mt-1">Click the button to download all team data</p>
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="-ml-1 mr-2 h-5 w-5" />
                    Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Important Notes
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>The export includes all teams visible to administrators</li>
                  <li>File format: CSV (Comma Separated Values)</li>
                  <li>Compatible with Excel, Google Sheets, and other spreadsheet software</li>
                  <li>Filename includes the current date for easy tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Preview (Optional) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Export Format</p>
                <p className="text-2xl font-bold text-gray-900">CSV</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">File Size</p>
                <p className="text-2xl font-bold text-gray-900">~KB</p>
              </div>
              <Download className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Fields</p>
                <p className="text-2xl font-bold text-gray-900">22+</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;
