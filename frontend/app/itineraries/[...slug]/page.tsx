"use client";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import { FloatingNavDemo } from "@/components/ui/Navbar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

const page = () => {
  const id = useParams().slug;
  const [itinerary, setItinerary] = useState<any>(null);
  const BE_URL = "http://localhost:5000";
  
  useEffect(() => {
    // Fetch itinerary details from backend API
    const fetchItinerary = async () => {
      const response = await fetch(`${BE_URL}/api/get-trip/${id}`);
      const data = await response.json();
      setItinerary(data);
    };
    fetchItinerary();
  }, [id]);
  
  return (
    <div className="relative min-h-screen w-full">
      <FloatingNavDemo/>
      <DottedGlowBackground
        className="pointer-events-none absolute inset-0 min-h-full opacity-20 dark:opacity-100"
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
       
      <div className="relative z-10 mt-4 p-6 rounded-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Trip to {itinerary ? itinerary.title : "Loading..."}
        </h2>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          for {itinerary ? itinerary.duration : "Loading..."} days
        </h2>
        <div className="p-7 prose prose-lg dark:prose-invert max-w-none tracking-wide !leading-loose">
          <Markdown>{itinerary ? itinerary.description : ""}</Markdown>
        </div>
      </div>
    </div>
  );
};

export default page;