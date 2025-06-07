import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Logo = () => (
    <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-primary">
        <Image priority className="object-contain mr-4" src="/logo.png" alt="logo" width="120" height="100" />
        <div className="whitespace-nowrap">SSR Connect</div>
    </Link>
);

export default Logo;