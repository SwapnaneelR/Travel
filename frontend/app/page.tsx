import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import Button from "@/components/ui/Button";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import TopButton from "@/components/ui/TopButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-auto">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={0.6}
        gap={30}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
    
      <div className="mt-50 w-full">
        <TopButton/>
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
          AI Travel Guide 
        </h2>
        <h2 className="relative z-10 mt-2 mx-auto max-w-4xl text-center text-xl font-bold text-neutral-700  md:text-3xl lg:text-7xl dark:text-neutral-200">
           Personalized Tour Planner
        </h2>
        <p className=" relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-400">
          Create itenaries for your trips with the help of AI. Just enter your
          destination and interests, and get a customized plan!
        </p>
        <div className="flex align-center justify-center gap-x-5 mt-5 left-50">
          <Button data={"Plan your trip now"}></Button>
          <Button data={" Visit precurated itineraries"}></Button>
        </div>
      </div>
    </div>
  );
}
