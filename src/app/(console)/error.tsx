'use client';
import Link from 'next/link';
import Image from 'next/image';

import Footer from '@/app/(landing)/_appview/footer';

export default function ErrorPage() {
  return (
      <div className="h-screen flex flex-col justify-between w-full">
          <div className="flex flex-col items-center justify-center flex-grow bg-gradient-to-br from-[#f6faff] to-[#f2f6fc] relative">
              <Image
                  src="/assets/not-found.svg"
                  alt="Not Found"
                  width={500}
                  height={500}
                  className="opacity-80 absolute right-56"
              />
              <div className="text-6xl font-bold text-primary">Not Found</div>
              <div className="mt-2 text-gray-400 text-sm">The page you are looking for does not exist.</div>
              <Link
                  href="/"
                  className="mt-8 px-8 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all duration-200 z-50"
              >
                  Return Home
              </Link>
          </div>
          <Footer />
      </div>
  );
}