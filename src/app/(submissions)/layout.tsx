
const SubmissionLayout = ({ children }) => {
  return (
      <div className="bg-gray-200 min-h-screen w-screen">
          <div>{children}</div>
          <footer className="w-full text-center text-sm text-gray-500 pb-6">
              ©
              {' '}
              {new Date().getFullYear()}
              {' '}
              SSRConnect. All Rights Reserved.
          </footer>
      </div>
  );
};

export default SubmissionLayout;