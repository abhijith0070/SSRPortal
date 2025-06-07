'use client';
import React, {useEffect} from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import toast from "react-hot-toast";
import {CloseFilledIcon} from '@nextui-org/shared-icons';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Spinner from "@/components/spinner";
import SuccessLottie from "@/lottie/success";
import { useRouter } from "next/navigation";

const AcceptButton = ({ team }) => {

  const router = useRouter();

  // 0: closed, 1: decline, 2: approve, 3: loading, 4: done
  const [isOpen, setIsOpen] = React.useState<0|1|2|3|4>(0);

  const handleApproval = () => {
    setIsOpen(3)
    fetch(`/api/approve/${team.code}`).then((res) => res.json()).then((data) => {
        if(data.success) toast.success('Project Approved');
        else {
            console.error(data?.error);
            toast.error(data?.error);
        }
    }).finally(() => setIsOpen(4));
  };
  
  const handleDecline = () => {
    setIsOpen(3)
    fetch(`/api/reject/${team.code}`).then((res) => res.json()).then((data) => {
        if(data.success) toast.success('Project Rejected. The team will have to resubmit their project.');
      else {
        console.error(data?.error);
        toast(data?.error);
      }
    }).finally(() => setIsOpen(0));
  };

  useEffect(() => {
    if(isOpen === 4) setTimeout(() => router.refresh(), 3000);
  }, [isOpen]);

  return (
      <>
          <div className="flex gap-2">
              <Button onClick={() => setIsOpen(1)} variant="default" className="h-full bg-red-200 hover:bg-red-500 text-red-400 hover:text-white rounded-lg p-4 flex items-center justify-center gap-4 max-w-[240px] w-full">
                  <div className="font-bold text-center text-2xl flex gap-2 items-center">
                      Decline
                      <CloseFilledIcon />
                  </div>
              </Button>
              <Button onClick={() => setIsOpen(2)} variant="default" className="h-full bg-primary rounded-lg p-4 flex items-center justify-center gap-4 max-w-[240px] w-full">
                  <div className="text-white font-bold text-center text-2xl flex gap-2 items-center">
                      Approve
                      <CheckCircle2Icon />
                  </div>
              </Button>
          </div>
          <Dialog open={isOpen !== 0} onOpenChange={() => setIsOpen(0)}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle className={isOpen === 1 ? 'text-red-500' : 'text-primary'}>
                          {isOpen === 2 ? 'Confirm Project Approval' : 'Confirm Project Rejection'}
                      </DialogTitle>
                  </DialogHeader>
                  {isOpen === 4 ? (
                      <div className="flex flex-col items-center">
                          <SuccessLottie className="!w-56 !h-56 mb-4" />
                          <div className="text-green-500 text-center font-bold text-xl">
                              Project Approved 🎉
                          </div>
                          <div className="text-gray-600 text-sm text-center mt-2">
                              <p> The project has been successfully approved. </p>
                              <p> The project will now be visible to the public. </p>
                          </div>
                          <div className="flex justify-center mt-6">
                              <Button onClick={() => setIsOpen(0)}>
                                  Close
                              </Button>
                          </div>
                      </div>
                      ) : isOpen === 3 ? (
                      <div className="p-8">
                          <div className="flex flex-col items-center justify-center">
                              <Spinner />
                              <div className="text-center mt-4">Processing... Please wait</div>
                          </div>
                      </div>
                  ) : (
                      <>
                          <div className="py-4">
                              <p>
                                  Are you sure you want to
                                  {isOpen === 2 ? ' approve ' : ' reject '}
                                  the submission of this project?
                              </p>
                              <p className="text-sm text-gray-500 mt-2">
                                  This action cannot be undone. Please verify all your information before confirming.
                              </p>
                              {isOpen === 1 && (
                              <p className="text-sm text-red-500 mt-2 font-semibold opacity-60">
                                  This action will delete the project from the system.
                                  {' '}
                                  <br />
                                  {' '}
                                  The team will have to resubmit their project.
                              </p>
                              )}
                          </div>
                          <div>
                              <div className="text-lg font-bold">Team ID:</div>
                              <div className="text-gray-700">{team?.code}</div>
                          </div>
                          {team?.members && (
                              <div>
                                  <div className="text-lg font-bold">Members:</div>
                                  <div className="text-gray-700">
                                      {team?.members.map((member, index) => (
                                          <div key={index}>{member.name}</div>
                                      ))}
                                  </div>
                              </div>
                          )}
                          <DialogFooter>
                              <Button
                                  variant="outline"
                                  onClick={() => setIsOpen(0)}
                              >
                                  Cancel
                              </Button>
                              {isOpen === 1 ? (
                                  <Button
                                      className="bg-red-500 hover:bg-red-600 text-white"
                                      onClick={() => handleDecline()}
                                  >
                                      Reject Submission
                                  </Button>
                                ) : (
                                    <Button onClick={() => handleApproval()}>
                                        Approve Submission
                                    </Button>
                                )}
                          </DialogFooter>
                      </>
                  )}
              </DialogContent>
          </Dialog>
      </>
  );
};

export default AcceptButton;