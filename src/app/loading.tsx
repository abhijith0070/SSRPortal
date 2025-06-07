const LoadingPage = () => {
  return (
      <div className="bg-background h-screen flex items-center justify-center w-full">
          <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
          />
          <div className="uppercase font-light ml-4 text-primary text-xl">
              Loading
          </div>
      </div>
  );
};

export default LoadingPage;