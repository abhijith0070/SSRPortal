import React from 'react';

const Footer = () => {
  return (
      <footer className="text-gray-600 body-font">
          <div className="bg-white">
              <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
                  <p className="text-gray-500 text-sm text-center sm:text-left">
                      ©
                      {' '}
                      {new Date().getFullYear()}
                      {' '}
                      SSR Connect
                  </p>
                  <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">

                  </span>
              </div>
          </div>
      </footer>
  );
};

export default Footer;