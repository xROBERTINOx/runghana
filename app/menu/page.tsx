'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css'; // Import the CSS module
import Cookies from 'js-cookie';

export default function LevelMenu() {
    const router = useRouter();

    const handleLevelSelect = (level: number) => {
        Cookies.set('currentLevel', level.toString());
        router.push('/game');
    };

    const levels = [1, 2, 3, 4, 5];

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8">
            <h1 className="text-4xl font-bold text-purple-500 mb-12">Select Level</h1>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                {levels.map((level) => (
                    <button
                        key={level}
                        onClick={() => handleLevelSelect(level)}
                        className="relative group transition-transform hover:scale-105 duration-300 w-full md:w-auto"
                    >
                        <div className="relative w-full aspect-video">
                            <Image
                                src={`/images/level-${level}.png`}
                                alt={`Level ${level}`}
                                fill
                                className={`rounded-xl  
                                         shadow-lg transition-all duration-300 object-contain 
                                         group-hover:border-purple-400 group-hover:shadow-purple-500/25 ${styles.crispImage}`} // Add the custom CSS class
                            />
                        </div>
                        <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/40 
                                      rounded-xl transition-all duration-300 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white opacity-0 
                                           group-hover:opacity-100 transition-opacity duration-300">
                                Level {level}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}