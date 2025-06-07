'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from 'next/image';


const TestimonialItem = ({ content, avatar, name, designation }: any) => {
  return (
      <section className="p-6">
          <div className="container max-w-2xl mx-auto">
              <div className="flex flex-col items-center w-full p-6 space-y-8 rounded-md lg:h-full lg:p-8 dark:bg-gray-900 dark:text-gray-100">
                  <Image
                      src={avatar}
                      alt={name}
                      width={200}
                      height={200}
                      className="w-20 h-20 rounded-full object-cover object-start"
                  />
                  <blockquote className="max-w-lg text-lg italic font-medium text-center">
                      "
                      {content}
                      "
                  </blockquote>
                  <div className="text-center dark:text-gray-400">
                      <h4 className="text-lg font-semibold">{name}</h4>
                      <p className="text-sm">{designation}</p>
                  </div>
                  <div className="flex space-x-2">
                      <button
                          type="button"
                          aria-label="Page 1"
                          className="w-2 h-2 rounded-full dark:bg-gray-50"
                      ></button>
                      <button
                          type="button"
                          aria-label="Page 2"
                          className="w-2 h-2 rounded-full dark:bg-gray-600"
                      ></button>
                      <button
                          type="button"
                          aria-label="Page 3"
                          className="w-2 h-2 rounded-full dark:bg-gray-600"
                      ></button>
                      <button
                          type="button"
                          aria-label="Page 4"
                          className="w-2 h-2 rounded-full dark:bg-gray-600"
                      ></button>
                  </div>
              </div>
          </div>
      </section>
        
  );
};

const TESTIMONIALS = [
  {
    content: 'I see this project as a tool to move from selfishness to selflessness to the maximum capacity one can.It is a great feeling to witness the joy that my students feel when they were able to uplift the society through self-initiated projects. Last but not the least, as AMMA has said "Be a Giver not a Taker". This project is a fine example of that.',
    name: 'Jayakumaran A',
    designation: 'Mentor',
    avatar: '/assets/avatar/jayakumaran.webp',
  },
  {
    content: 'Student Social Responsibility (SSR) is a credit-based academic program, where we inspire and mentor the youth to run real-time community projects and come up with state-of-the-art solutions in order to address social issues, thereby evolve oneself altruistically and set an example for others to follow',
    name: 'Deepa H',
    designation: 'Mentor',
    avatar: '/assets/avatar/deepa.webp',
  },
  {
    content: 'SSR project taps into the goodness that is innate in each one of us, students and mentors! It is a wonderful initiative to translate Amma\'s message of \'Love and Serve\' into concrete action that benefits society in a small but meaningful way! It also fosters teamwork and enhances the organizational skills of students, which are valuable assets for their careers.',
    name: 'Sriram',
    designation: 'Mentor',
    avatar: '/assets/avatar/sriram.webp',
  },
];

const Testimonials = () => {
  return (
      <section className="text-gray-600 body-font w-full">
          <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col text-center w-full mb-14">
                  <h1 className="text-lg font-bold title-font mb-2 text-primary tracking-widest">Testimonials</h1>
                  <p className="lg:w-2/3 mx-auto leading-relaxed opacity-75 text-sm">
                      See what our faculty, students, and alumni have to say about their experience with the program.
                  </p>
              </div>
              <div className="flex flex-wrap -m-4 w-full">
                  <Swiper
                      spaceBetween={30}
                      pagination={{ clickable: true }}
                      navigation
                      centeredSlides
                      mousewheel
                      keyboard
                      className="w-full mySwiper"
                      autoplay={{ pauseOnMouseEnter: true }}
                      modules={[Pagination, Navigation, Autoplay]}
                  >
                      {TESTIMONIALS.map((testimonial, index) => (
                          <SwiperSlide key={index}>
                              <TestimonialItem {...testimonial} />
                          </SwiperSlide>
                      ))}
                  </Swiper>
              </div>
          </div>
      </section>
  );
};

export default Testimonials;