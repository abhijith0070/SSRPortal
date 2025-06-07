import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';

import Stats from '@/app/(landing)/(main)/stats';

const About = () => {
  return (
      <section className="text-gray-600 body-font bg-white w-full">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
              <div className="flex flex-wrap -m-4 w-full">
                  <div className="p-4 lg:w-2/3 md:w-full">
                      <div className="text-sm font-semibold text-primary">About us</div>
                      <h1 className="title-font text-4xl font-bold text-gray-900 mb-4">
                          Developing a stronger youth
                      </h1>
                      <p className="leading-relaxed max-w-[600px]">
                          Giving back to the society whatever little we can, this is the small thought that led to
                          this massive community service program that we call SSR (Student Social Responsibility).
                          The aim of this student driven program is nothing but the well-being of the society through
                          various projects. Being able to interact with people and bring about solutions for the
                          various problems in their daily life is something that the students of Amrita have mastered
                          at this young age.
                      </p>
                      <Link href="/about" className="text-primary inline-flex items-center mt-4">
                          Learn more
                          <ArrowRightIcon className="ml-2" size={16} />
                      </Link>
                      <Stats />
                  </div>
                  <div className="p-4 lg:w-1/3 md:w-full flex gap-2 justify-center items-end flex-col">
                      <Image
                          src="/assets/gallery/1.png"
                          alt="SSR16-028"
                          height={300}
                          width={500}
                          className="border rounded-lg border-gray-200 border-opacity-50 max-h-[200px] object-cover object-right"
                      />
                      <Image
                          src="/assets/gallery/2.png"
                          alt="SSR16-063"
                          height={300}
                          width={500}
                          className="border rounded-lg border-gray-200 border-opacity-50 max-h-[200px] object-cover object-right mr-10"
                      />
                  </div>
              </div>
          </div>
      </section>
  );
};
        
export default About;