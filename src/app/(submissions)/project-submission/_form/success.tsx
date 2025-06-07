import React from 'react';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import SuccessLottie from '@/lottie/success';
import Button from '@/components/button';


const ProjectSubmissionSuccess = ({ isOpen }) => {
    
  const router = useRouter();
    
  return (
      <Dialog open={!!isOpen} onOpenChange={() => router.push('/projects')}>
          <DialogContent>
              <div className="flex flex-col items-center">
                  <SuccessLottie className="!w-56 !h-56 mb-4" />
                  <div className="text-green-500 text-center font-bold text-xl">
                      Project Submitted 🎉
                      <br />
                      Happy SSRing!
                  </div>
                  <div className="text-gray-600 text-sm text-center mt-2">
                      <p>Your team has successfully submitted the SSR project.</p>
                      <p>Good luck with the evaluation process!</p>
                  </div>
                  <div className="flex justify-center mt-6">
                      <Button variant="primary" link="/projects">
                          View Past Projects
                      </Button>
                  </div>
              </div>
          </DialogContent>
      </Dialog>
  );
};

export default ProjectSubmissionSuccess;