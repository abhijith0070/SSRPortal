'use client';
import Lottie from 'lottie-react';
import clsx from 'clsx';

import animationData from './success.json';

const SuccessLottie = ({ className, loop = false } : {
  className?: string;
  loop?: boolean;
}) => (
    <Lottie
        loop={loop}
        animationData={animationData}
        className={clsx(['w-full h-full', className])}
    />
);

export default SuccessLottie;