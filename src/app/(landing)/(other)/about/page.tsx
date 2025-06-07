'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import React from 'react';
import Image from 'next/image';
import { Autoplay, Pagination } from 'swiper/modules';

import Stats from '@/app/(landing)/(main)/stats';

const IMAGES = [
  '/assets/carousel/1.webp',
  '/assets/carousel/2.webp',
  '/assets/carousel/3.webp',
];

const AboutPage = () => {
  return (
      <section className="text-gray-600 body-font h-full flex items-center">
          <div className="container mx-auto py-24 flex justify-center grid grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
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
                  <Stats />
              </div>
              <div>
                  <Swiper
                      autoplay={{
                        pauseOnMouseEnter: true,
                        delay: 1500,
                      }}
                      slidesPerView={1}
                      pagination
                      modules={[Autoplay, Pagination]}
                  >
                      {IMAGES.map((image, index) => (
                          <SwiperSlide key={index}>
                              <Image src={image} alt="About us" width={500} height={300} className="object-cover object-center w-full rounded-lg" />
                          </SwiperSlide>
                      ))}
                  </Swiper>
              </div>
          </div>
      </section>
  );
};

export default AboutPage;