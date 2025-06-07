import React from 'react';
import Link from 'next/link';

import { THEMES } from '@/lib/db/theme';

const ThemesSection = () => {
  return (
      <section className="text-gray-600 body-font w-full">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
              <div className="flex w-full justify-center">
                  <div className="max-w-xl text-center">
                      <div className="text-sm font-semibold text-primary mb-1">SSR Themes</div>
                      <h1 className="title-font text-3xl font-bold text-gray-900 mb-2">
                          Pillars of our projects
                      </h1>
                      <p className="leading-relaxed text-xs text-center opacity-75 max-w-[600px]">
                          Constantly evolving, we have a wide range of themes that we work on.
                      </p>
                  </div>
              </div>
              <div className="w-full mt-8 grid flex-wrap grid-cols-5 gap-4">
                  {THEMES.map(({ label, id }, index: number) => (
                      <Link
                          className="flex text-sm hover:font-semibold hover:text-primary items-center justify-center text-center flex-wrap gap-2 group w-full px-2 py-2 md:px-8 md:py-8 bg-white rounded border hover:border-primary shadow-background hover:shadow duration-200 cursor-pointer"
                          href={`/projects?theme=${id}`}
                          key={index}
                      >
                          {label}
                      </Link>
                  ))}
              </div>
          </div>
      </section>
  );
};

export default ThemesSection;