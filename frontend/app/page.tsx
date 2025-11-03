"use client"; 
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import Button from "@/components/ui/Button";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import { FloatingNavDemo } from "@/components/ui/Navbar";
import TopButton from "@/components/ui/TopButton";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 md:px-12">

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

      <TopButton  />
    <FloatingNavDemo />
      <div className="relative z-10 mt-0 flex flex-col items-center justify-center space-y-8">
        <h2 className="text-center text-2xl font-bold text-neutral-800 md:text-5xl lg:text-9xl dark:text-neutral-300">
          Sathi Yatri AI
        </h2>
        <h2 className="text-center text-xl font-semibold text-neutral-700 md:text-3xl lg:text-5xl dark:text-neutral-300">
          Personalized Tour Planner
        </h2>
        <p className="max-w-4xl text-center text-neutral-800 dark:text-neutral-400 text-xl leading-relaxed">
          Create itineraries for your trips with the help of AI. Just enter your
          destination and interests, and get a customized plan!
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-5">
          <button
            onClick={() => router.push("/plan")}
            className="px-8 py-6 text-lg font-semibold rounded-3xl border border-neutral-600 bg-white/80 text-black hover:scale-[1.04] transition duration-200 shadow-sm"
          >
            Plan your trip now
          </button>
          <button
            onClick={() => router.push("/itineraries")}
            className="px-8 py-6 text-lg font-semibold rounded-3xl border border-neutral-600 bg-white/80 text-black hover:scale-[1.04] transition duration-200 shadow-sm"
          >
            Precurated itineraries
          </button>
        </div>
      </div>
    </div>
  );
}
