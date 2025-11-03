"use client";
import DottedGlowBackground from '@/components/ui/dotted-glow-background';
import Home from '@/components/ui/Home';
import { FloatingNavDemo } from '@/components/ui/Navbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useEffect } from 'react'
const BE_URL = "http://localhost:5000";
const page = () => {
  const [itineraries, setItineraries] = React.useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    
    // Fetch itineraries from backend API
    const fetchItineraries = async () => {
      try {
        const res = await axios.get(`${BE_URL}/api/get-trips`);
        setItineraries(res.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div className="w-full p-5 overflow-auto relative min-h-screen">
     <DottedGlowBackground
               className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-100"
               opacity={0.6}
               gap={30}
               radius={2}
               colorLightVar="--color-neutral-500"
               glowColorLightVar="--color-neutral-600"
               colorDarkVar="--color-neutral-500"
               glowColorDarkVar="--color-sky-800"
               backgroundOpacity={0}
               speedMin={0.3}
               speedMax={1.6}
               speedScale={1}
             />
  <h1 className="text-4xl font-bold mb-8 dark:text-white mt-5 ">
    Saved Itineraries
  </h1>
    <FloatingNavDemo/>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {itineraries.map((itinerary) => (
      <div
        key={itinerary._id}
        className="p-6 rounded-2xl bg-white/60 dark:bg-neutral-900/50
                   backdrop-blur-lg border border-white/20 
                   shadow-md hover:shadow-xl transition duration-300
                   hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push(`/itineraries/${itinerary._id}`)}
      >
        <h2 className="text-2xl font-semibold mb-2 dark:text-white">
          {itinerary.title} Trip
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {itinerary.duration} days
        </p>

        <button
          className="px-5 py-2 rounded-xl text-sm font-medium
                     bg-black text-white dark:bg-white dark:text-black
                     hover:opacity-80 transition">
          Expand →
        </button>
      </div>
    ))}
  </div>
</div>

  )
}

export default page