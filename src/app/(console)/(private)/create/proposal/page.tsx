'use client';


import { useSession } from 'next-auth/react';

import SuccessLottie from '@/lottie/success';
const CreateProposalPage = () => {

  // return (
  //     <div className="p-5 flex-grow flex items-center justify-center flex-col gap-4">
  //         <div className="bg-white max-w-[600px] md:min-w-[400px] rounded-lg pt-6 pb-4 px-4">
  //             <div className="pb-4 mb-4 border-b flex justify-between items-center">
  //                 <h1 className="text-2xl text-primary font-bold">Submit Proposal</h1>
  //                 <button className="pr-4">
  //                     <XIcon />
  //                 </button>
  //             </div>
  //             <div className="grid grid-cols-1 gap-4">
  //                 <InputField
  //                     required
  //                     label="Title"
  //                     value={null}
  //                     onChange={(e) => {
  //                       console.log(e.target.value);
  //                     }}
  //                 />
  //                 <div className="flex flex-col gap-2">
  //                     <label htmlFor="attachment" className="text-sm font-medium text-gray-700">
  //                         Proposal
  //                         <span className="text-red-700">*</span>
  //                         <span className="text-xs ml-2 text-gray-400">(PDF Only)</span>
  //                     </label>
  //                     <input 
  //                         type="file"
  //                         id="attachment"
  //                         accept="application/pdf"
  //                         className="border bg-gray-50 border-gray-300 rounded-lg p-2"
  //                     />
  //                 </div>
  //                 <div className="flex flex-col gap-2">
  //                     <label htmlFor="description" className="text-sm flex justify-between -mb-1 font-medium text-gray-700">
  //                         Description
  //                         <span className="text-xs text-gray-400">0/1000</span>
  //                     </label>
  //                     <textarea
  //                         id="description"
  //                         maxLength={1000}
  //                         rows={5}
  //                         className="border border-gray-300 rounded-lg p-2 bg-gray-50"
  //                     />
  //                 </div>
  //                 <div className="flex justify-end">
  //                     <Button variant="primary">
  //                         Submit Proposal
  //                     </Button>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  // )

  const { data: session } = useSession();
  console.log('Client Session', session);
  return <pre>{JSON.stringify(session)}</pre>;


  return (
      <div className="p-5 flex-grow flex items-center justify-center flex-col gap-4">
          <SuccessLottie className="!w-56 !h-56" />
          <div className="-mt-16 flex flex-col justify-center items-center">
              <div className="text-2xl text-primary font-bold">Proposal Submitted</div>
              <div className="text-gray-500 text-sm text-center max-w-[350px] mt-2">
                  Your proposal has been submitted successfully. Your mentor will review it and get back to you soon.
              </div>
              <div className="mt-4 text-gray-700">
                  Redirecting...
              </div>
          </div>
      </div>
  );
};

export default CreateProposalPage;