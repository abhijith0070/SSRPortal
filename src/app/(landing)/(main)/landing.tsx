import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';

const Landing = () => (
    <div className="min-h-screen relative w-full flex flex-col md:flex-row justify-end items-end">
        <Image src="/assets/amma.jpeg" alt="background" fill className="object-cover object-top hidden md:block z-0" />
        <Image src="/assets/bgi.png" alt="background" fill className="object-cover object-right-top block md:hidden z-0" />
        <div className="absolute inset-0 bg-gradient-to-t z-20 from-black to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b z-10 from-black/50 to-transparent" />
        <div className="relative w-full h-full z-30 mb-14 md:mb-20 p-4">
            <div
                className="md:absolute md:bottom-16 md:right-16 flex flex-col max-w-[450px] items-start justify-center text-gray-200 mb-6 md:mb-0"
            >
                <div>
                    Amrita’s flagship community outreach program that exposes students to the realities of life. It
                    offers them a unique opportunity to make a real difference in the world outside and practice
                    humanity in their own little ways
                </div>
                <div>
                    <div className="text-sm opacity-50 mt-5">In assocaition with</div>
                    <Image src="/amrita-logo.png" alt="Amrita Vishwa Vidyapeetham" width={200} height={100} />
                </div>
            </div>
            <div
                className="md:absolute left-0 bottom-16 flex items-center justify-center bg-primary p-8 md:pl-16 rounded mb-6 md:mb-0"
            >
                <Image src="/logo-light.png" alt="logo" width={500} height={100} />
            </div>
            <div className="grid md:hidden grid-cols-2 gap-2">
                <Link
                    href="/projects"
                    className="inline-flex md:hidden items-center justify-between bg-background transition-colors text-primary border-0 py-3 px-4 hover:bg-background/80 rounded text-base font-semibold"
                >
                    <div>Explore Projects</div>
                    <ChevronRightIcon className="ml-2" size={20} />
                </Link>
                <Link
                    href="/about"
                    className="inline-flex md:hidden items-center justify-between bg-transparent transition-colors text-white border py-3 px-4 hover:bg-white/30 rounded text-base"
                >
                    <div>About us</div>
                    <ChevronRightIcon className="ml-2" size={20} />
                </Link>

            </div>
        </div>
    </div>
);

export default Landing;