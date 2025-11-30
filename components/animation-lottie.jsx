"use client"

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const AnimationLottie = ({ animationPath, width }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: '100%',
      height: '100%'
    }
  };

  return (
    <Lottie {...defaultOptions} />
  );
};

export default AnimationLottie;