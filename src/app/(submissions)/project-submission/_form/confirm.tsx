import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ProjectSubmissionConfirm = ({ isOpen, onCancel, team, onNext }) => {
  return (
      <Dialog open={isOpen} onOpenChange={onCancel}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Confirm Submission</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                  <p>Are you sure you want to submit your project?</p>
                  <p className="text-sm text-gray-500 mt-2">
                      This action cannot be undone. Please verify all your information before confirming.
                  </p>
              </div>
              <div>
                  <div className="text-lg font-bold">Team ID:</div>
                  <div className="text-gray-700">{team?.code.slice(0, -3) + '-' + team?.code.slice(-3)}</div>
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
                      onClick={onCancel}
                  >
                      Cancel
                  </Button>
                  <Button
                      onClick={onNext}
                  >
                      Confirm Submission
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
};

export default ProjectSubmissionConfirm;