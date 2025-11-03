"use client";

import React, { useState } from "react";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import axios from "axios";
import Markdown from "react-markdown";
import { flushSync } from "react-dom";
import toast from "react-hot-toast";
import Home from "@/components/ui/Home";
import { FloatingNavDemo } from "@/components/ui/Navbar";

const Page = () => {
  const BE_URL = "http://localhost:5000";
  const WEATHER_API = process.env.NEXT_PUBLIC_WEATHER_API;

  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(0);
  const [interests, setInterests] = useState("");
  const [response, setResponse] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [errors, setErrors] = useState<{ destination?: string; duration?: string }>({});
  const [loading, setLoading] = useState(false);
  const [currentDisplay,setCurrentDisplay]=useState<string>("none");
  const AI : string= "ai";
  const WEATHER : string = "weather";

  // Save plan
  const handlePostPlan = async () => {
    try {
      const res = await axios.post(`${BE_URL}/api/post-trip`, {
        title: destination,
        duration,
        description: response,
      });
      if(res.data.status=="ok"){
          toast.success("Saved")
      }
    } catch (err) {
      console.error("Failed to save plan:", err);
    }
  };

  // Fetch weather
  const getWeatherForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentDisplay("weather");
    setLoading(true);
    try {
      const res = await axios.get(
        `${WEATHER_API}&q=${destination}&days=${duration}&aqi=no&alerts=no`
      );
      setWeatherData(res.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gemini Streaming
  const handleAIStreaming = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setCurrentDisplay("ai");
    try {
      const res = await fetch(`${BE_URL}/api/plan-trip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, duration, interests }),
      });

      if (!res.body) throw new Error("No response body found");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
 
        flushSync(() => {
          setResponse((prev) => prev + chunk);
        });
      }

      decoder.decode(); // flush remaining characters
    } catch (error) {
      console.error("Streaming error:", error);
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full px-10 py-10 gap-10">
      <DottedGlowBackground
        className="pointer-events-none overflow-auto absolute inset-0 opacity-20 dark:opacity-100"
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
        <FloatingNavDemo/>

      {/* LEFT SIDE - FORM */}
      <div className="flex flex-col justify-center w-1/3">
        <form className="backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col gap-8">
          <h2 className="text-5xl font-bold dark:text-white">Plan Your Trip</h2>

          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter your destination"
            className="px-3 py-4 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-3xl focus:ring-2 focus:ring-blue-400 dark:text-white outline-none w-full"
          />
          {errors.destination && (
            <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
          )}

          <input
            type="number"
            required
            value={duration === 0 ? "" : duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="Enter duration (in days)"
            className="px-3 py-4 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-3xl focus:ring-2 focus:ring-blue-400 dark:text-white outline-none w-full"
            min={0}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}

          <textarea
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Enter your interests (e.g. adventure, culture, food)"
            className="px-3 py-4 h-24 rounded-3xl border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-400 dark:text-white outline-none w-full resize-none"
          />

          <div className="flex gap-x-8">
            <button
              disabled={loading}
              onClick={handleAIStreaming}
              className={`px-6 bg-white text-lg font-semibold py-4 z-20 border border-neutral-600 text-black rounded-3xl transition-all ${
                loading ? "cursor-not-allowed opacity-50 bg-white" : "hover:scale-105"
              }`}
            >
              {loading ? "AI is thinking..." : "Generate Itinerary"}
            </button>

            <button
              disabled={loading}
              onClick={getWeatherForecast}
              className={`px-6 bg-white text-lg font-semibold py-4 z-20 border border-neutral-600 text-black rounded-3xl transition-all ${
                loading ? "cursor-not-allowed opacity-50 bg-white" : "hover:scale-105"
              }`}
            >
              {loading ? "Fetching Updates..." : "Weather Forecast"}
            </button>
          </div>
        </form>
      </div> 
      {/* RIGHT SIDE - RESPONSE */}
      <div className="w-2/3 h-[90vh]   pr-5 flex items-center justify-center flex-col">

        {!response && !weatherData && (
          <div className="mt-4 p-6 rounded-xl bg-white/50 dark:bg-neutral-900/40 shadow-lg border border-white/20">
            Your Itinerary / Weather forecast will appear here once it's generated.
          </div>
        )}

        {response && currentDisplay===AI && (
          <div className="mt-4 p-6 overflow-y-auto rounded-xl bg-white/50 dark:bg-neutral-900/40 backdrop-blur-lg shadow-lg border border-white/20 w-full">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Your Itinerary</h2>
            <div className="p-7 prose prose-lg dark:prose-invert max-w-none tracking-wide !leading-loose">
              <Markdown>{response}</Markdown>
            </div>
          </div>
        )}

        {!loading && weatherData && currentDisplay==WEATHER && (
          <div className="mt-4 p-6 w-full rounded-xl bg-white/50 dark:bg-neutral-900/40 backdrop-blur-lg shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Weather Forecast</h2>
            <div>
              <h2 className="text-white/80 text-xl">Location</h2>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold text-center dark:text-white">
                  {weatherData.location?.name}, {weatherData.location?.region}{" "}
                  {weatherData.location?.country}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-white/80 text-xl mt-4">
                Forecast for the next {duration} days
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {weatherData.forecast.forecastday.map((day: any, index: number) => (
                  <div
                    key={index}
                    className="mt-4 p-4 rounded-lg bg-white/30 dark:bg-neutral-800/30 backdrop-blur-md shadow-md border border-white/10"
                  >
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">
                      {day.date}
                    </h3>
                    <div className="flex items-center gap-4">
                      <img src={day.day.condition.icon} alt={day.day.condition.text} />
                      <p className="text-lg font-semibold dark:text-white">
                        {day.day.condition.text}
                      </p>
                    </div>
                    <p className="mt-2 text-white/80">
                      Avg Temperature: {day.day.avgtemp_c}°C
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {!loading && response && currentDisplay===AI&& (
        <button
          onClick={handlePostPlan}
          className="fixed top-5 right-5 bg-white p-3 px-4 rounded-xl cursor-pointer text-black backdrop-blur-lg shadow-lg"
        >
           Save
        </button>
      )}
    </div>
  );
};

export default Page;
