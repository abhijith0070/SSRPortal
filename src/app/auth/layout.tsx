import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


const BG_IMAGE = [
  {
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1',
    src: 'e-imPaYqV1s',
    credit: {
      username: 'fabianwiktor',
      name: 'Fabian Wiktor',
    },
  },
  {
    url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e',
    src: '9K9ipjhDdks',
    credit: {
      username: 'sotti',
      name: 'Shifaaz shamoon',
    },
  },
  {
    url: 'https://images.unsplash.com/photo-1455218873509-8097305ee378',
    src: 'JoH60FhTp50',
    credit: {
      username: 'thkelley',
      name: 'Thomas Kelley',
    },
  },
  {
    url: 'https://images.unsplash.com/photo-1636739613648-3c6c6f7ec966',
    src: 'ZszNSUL2J8U',
    credit: {
      username: 'iprefermike',
      name: 'Mike Cox',
    },
  },
  {
    url: 'https://images.unsplash.com/photo-1562676907-cf2155921949',
    src: 'jtvfXZ2n38Q',
    credit: {
      username: 'davidmonje',
      name: 'David Monje',
    },
  },
];

const getBgImage = () => {
  return BG_IMAGE[Math.floor(Math.random() * BG_IMAGE.length)];
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

  const { url, credit, src } = getBgImage();

  return (
      <section className="min-h-screen flex items-stretch text-white ">
          <div className="lg:flex w-1/4 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center bg-center">
              <Image src={url} alt="background" fill priority className="object-cover" />
              <div className="absolute bg-white bottom-2 left-2 rounded py-1 px-4 w-max text-xs text-gray-500">
                  {/* Camera icon */}
                  Photo by
                  <Link href={`https://unsplash.com/@${credit.username}`} className="text-primary">
                      {` ${credit.name} `}
                  </Link>
                  on
                  <Link href={`https://unsplash.com/photos/${src}`} className="text-primary">
                      {' '}
                      Unsplash
                  </Link>
              </div>
          </div>
          <div className="lg:w-3/4 w-full flex items-center justify-center text-color text-center md:px-16 px-0 z-0 relative">
              <div className="flex flex-col items-center justify-center md:px-6 md:py-8 mx-auto md:h-screen lg:py-0">
                  <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-primary absolute top-4 left-4">
                      <Image className="object-contain mr-4" src="/logo.png" alt="logo" width="120" height="100" />
                      SSR Connect
                  </Link>
                  {children}
              </div>
          </div>
      </section>
  );
};

export default AuthLayout;