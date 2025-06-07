'use client';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronRightIcon } from 'lucide-react';

import MobileNavBar from '@/app/(landing)/_appview/mobile-nav';

export const MENU_ITEMS = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'About us',
    href: '/about',
  },
  // {
  //   name: 'Testimonials',
  //   href: '/testimonials',
  // },
  {
    name: 'Projects',
    href: '/projects',
  },
  {
    name: 'Contact us',
    href: '/contact',
  },
];

const Header = ({ scrollEffect = true, variant } : { scrollEffect: boolean, variant: 'shadow' | 'line' }) => {
  
  const [scrolled, setScrolled] = useState(!scrollEffect);
  const pathname = usePathname();

  useEffect(() => {
    if(!scrollEffect) return;
    const onScroll = () => setScrolled(window.scrollY > 0);
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
      <header
          className={clsx([
            !scrollEffect && 'bg-white',
            scrolled ? 'bg-white' : 'bg-transparent',
            (!scrollEffect || (scrollEffect && scrolled)) && (variant === 'line' ? 'border-b' : 'shadow-lg'),
            'transition-all duration-300 ease-in-out fixed w-full z-50',
          ])}
      >
          <div
              className={clsx([
                'flex flex-wrap p-5 flex-row items-center justify-between',
                !scrolled ? 'lg:px-16' : 'container mx-auto',
              ])}
          >
              {scrolled && <Link href="/" className="flex title-font font-bold items-center text-primary my-2">
                  {/*<svg*/}
                  {/*    xmlns="http://www.w3.org/2000/svg"*/}
                  {/*    fill="none"*/}
                  {/*    stroke="currentColor"*/}
                  {/*    strokeLinecap="round"*/}
                  {/*    strokeLinejoin="round"*/}
                  {/*    strokeWidth="2"*/}
                  {/*    className="w-10 h-10 text-white p-2 bg-primary rounded-full"*/}
                  {/*    viewBox="0 0 24 24"*/}
                  {/*>*/}
                  {/*    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />*/}
                  {/*</svg>*/}
                  {/*<span className="ml-3 text-xl">SSR Connect</span>*/}
                  <Image src="/logo.png" alt="logo" width={200} height={60} />
              </Link>}
              {scrolled && <div className="block md:hidden"><MobileNavBar /></div>}
              <div className="hidden md:flex justify-between flex-grow">
                  <nav
                      className={clsx([
                        'flex gap-6 flex-wrap items-center justify-center mr-6 text-color',
                        scrolled && 'md:ml-auto',
                      ])}
                  >
                      {MENU_ITEMS.map((item) => (
                          <Link
                              key={item.name}
                              href={item.href}
                              className={clsx([
                                !scrolled && 'text-white hover:!text-white',
                                'hover:text-primary group mx-2 cursor-pointer text-base',
                                'transition-all duration-300 ease-in-out',
                                item.href === pathname && 'text-primary',
                              ])}
                          >
                              {item.name}
                              <div
                                  className={clsx([
                                    'h-0.5 w-0 group-hover:w-full bg-white transition-all duration-300 ease-in-out',
                                    item.href === pathname && 'bg-primary',
                                  ])}
                              />
                          </Link>
                      ))}
                  </nav>
                  <Link
                      href="/portal"
                      className="hidden md:inline-flex items-center justify-between bg-background transition-colors text-primary border-0 py-2 px-4 hover:bg-background/80 rounded-lg text-base font-semibold"
                  >
                      <div>Member Portal</div>
                      <ChevronRightIcon className="ml-2" size={20} />
                  </Link>
              </div>
          </div>
      </header>
  );
};

export default Header;
