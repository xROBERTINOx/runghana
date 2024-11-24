"use client";
import { useRouter } from 'next/navigation';
import homescreenImage from '@/assets/homescreen.png';
import playButtonImage from '@/assets/resume.png';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative [image-rendering:pixelated]">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: `url(${homescreenImage.src})`,
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Play button */}
      <button
        onClick={() => router.push('/game')}
        className="absolute bottom right-9 transform transition-transform hover:scale-110 focus:outline-none"
        style={{ zIndex: 10 }}
      >
        <img 
          src={playButtonImage.src} 
          alt="Start Game" 
          className="w-48 h-auto cursor-pointer"
        />
      </button>
    </div>
  );
};