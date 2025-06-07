import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

const ProjectSubmissionUploading = ({ isOpen, uploadProgress, currentUploadFile }) => {
  return (
      <Dialog open={!!isOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Uploading Files</DialogTitle>
                  <p className="text-sm text-gray-500">
                      Uploading
                      {' '}
                      {currentUploadFile}
                      ...
                  </p>
              </DialogHeader>
              <div className="py-4">
                  <div className="space-y-4">
                      {Object.entries(uploadProgress).map(([file, progress]) => (
                          <div key={file}>
                              <div className="flex justify-between text-sm mb-1">
                                  <span className="capitalize">{file}</span>
                                  <span>
                                      {progress as number}
                                      %
                                  </span>
                              </div>
                              <Progress value={progress as number} className="h-2" />
                          </div>
                      ))}
                  </div>
              </div>
          </DialogContent>
      </Dialog>
  );
};

export default ProjectSubmissionUploading;