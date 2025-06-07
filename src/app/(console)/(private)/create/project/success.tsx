import SuccessLottie from '@/lottie/success';

const ProjectCreated = () => {
  return (
      <div className="p-5 flex-grow flex items-center justify-center flex-col gap-4">
          <SuccessLottie className="!w-56 !h-56" />
          <div className="-mt-16 flex flex-col justify-center items-center">
              <div className="text-2xl text-primary font-bold">Project Created</div>
              <div className="text-gray-500 text-sm text-center max-w-[450px] mt-2">
                  Your project has been successfully created. You can update your project status once in a while to keep your mentor updated.
                  <br />
                  <br />
                  All the best!
              </div>
              <div className="mt-4 text-gray-700">
                  Redirecting...
              </div>
          </div>
      </div>
  );
};

export default ProjectCreated;