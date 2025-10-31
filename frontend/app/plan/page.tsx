"use client";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const Page = () => {
  const BE_URL = "http://localhost:5000";
  const WEATHER_API = process.env.NEXT_PUBLIC_WEATHER_API;

  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(0);
  const [interests, setInterests] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [errors, setErrors] = useState<{
    destination?: string;
    duration?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const handlePostPlan = async () => {
    const res = await axios.post(`${BE_URL}/api/post-trip`, {
      title: destination,
      duration: duration,
      description: response,
    });
  };
  const getWeatherForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get(
        `${WEATHER_API}&q=${destination}&days=${duration}&aqi=no&alerts=no`
      );
      setWeatherData(res.data);
      console.log("Weather Data:", res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    // const res = await axios.get(WEATHER_API);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      if (!destination || duration <= 0) {
        toast.error("Please fill in all required fields correctly.");
        return;
      }
      const res = await axios.post(`${BE_URL}/api/plan-trip`, {
        destination,
        duration,
        interests,
      });
      setResponse(res.data);
    } catch (error) {
      setResponse("Something went wrong. Please try again.");
    }

    setLoading(false);
  };
  return (
    <div className="relative flex min-h-screen w-full px-10 py-10 gap-10">
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

      {/* LEFT SIDE - FORM */}
      <div className="flex flex-col justify-center w-1/3">
        <form
          // onSubmit={handleSubmit}
          className="backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col gap-8"
        >
          <h2 className="text-5xl font-bold dark:text-white">Plan Your Trip</h2>

          <div>
            <input
              type="text"
              required={true}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter your destination"
              className="px-3  py-4 border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-3xl focus:ring-2 focus:ring-blue-400 dark:text-white outline-none w-full"
            />
            {errors.destination && (
              <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
            )}
          </div>

          <div>
            <input
              type="number"
              required={true}
              value={duration === 0 ? "" : duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              placeholder="Enter duration (in days)"
              className="px-3  py-4  border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 rounded-3xl focus:ring-2 focus:ring-blue-400 dark:text-white outline-none w-full"
              min={0}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>

          <textarea
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Enter your interests (eg : adventure, culture, food)"
            className="px-3  py-4 h-24 rounded-3xl border border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 focus:ring-2 focus:ring-blue-400 dark:text-white outline-none w-full resize-none"
          />
          <div className="flex gap-x-8">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className={`px-6 bg-white text-lg font-semibold py-4 z-20 border border-neutral-600 text-black rounded-3xl transition-all
    ${loading ? "cursor-not-allowed opacity-50 bg-white" : "hover:scale-105"}
  `}
            >
              {loading ? "AI is thinking..." : "Generate Itinerary"}
            </button>
            <button
              disabled={loading}
              onClick={getWeatherForecast}
              className={`px-6 bg-white text-lg font-semibold py-4 z-20 border border-neutral-600 text-black rounded-3xl transition-all              46 z-20 border border-neutral-600 text-black rounded-3xl transition-all
    ${loading ? "cursor-not-allowed opacity-50 bg-white" : "hover:scale-105"}
  `}
            >
              {loading ? "Fetching Updates..." : "Weather Forecast"}
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT SIDE - RESPONSE */}
      <div className="w-2/3 h-[90vh] overflow-y-auto pr-5 flex items-center justify-center flex-col">
        {loading && (
          <div className="flex justify-center items-center text-lg mt-10 dark:text-neutral-200">
            ⏳ AI is thinking...
          </div>
        )}
        {!response  && !weatherData && (
          <div className="mt-4 p-6 rounded-xl bg-white/50 dark:bg-neutral-900/40  shadow-lg border border-white/20">
            Your Itinerary/Weather forecast will appear here once it's
            generated.
          </div>
        )}
        {!loading && response && (
          <div className="mt-4 p-6 rounded-xl bg-white/50 dark:bg-neutral-900/40 backdrop-blur-lg shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Your Itinerary
            </h2>
            <div className="p-7 prose prose-lg dark:prose-invert max-w-none tracking-wide !leading-loose">
              <Markdown>{response}</Markdown>
            </div>
          </div>
        )}
      <div>
        {!loading && weatherData && (
          <div className="mt-4 p-6 w-full items-center rounded-xl bg-white/50 dark:bg-neutral-900/40 backdrop-blur-lg shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Weather Forecast
            </h2>
            <div >
              <h2 className="text-white/80 text-xl">
                Location
              </h2>
              <div className="flex flex-col items-center">

               
                <p className="text-lg font-semibold text-center dark:text-white">
                  {weatherData.location?.name}, {weatherData.location?.region} {" "}
                  {weatherData.location?.country}
                </p>
                </div>
            </div>
            <div>
              <h2 className="text-white/80 text-xl  mt-4">
                Forecast for the next {duration} days
            </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {
              weatherData.forecast.forecastday.map((day: any, index: number) => (
                <div key={index} className="mt-4 p-4 rounded-lg  bg-white/30 dark:bg-neutral-800/30 backdrop-blur-md shadow-md border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    {day.date}
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={day.day.condition.icon}
                      alt={day.day.condition.text}
                    />
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
      </div>
      {!loading && response && (
        <button
          onClick={handlePostPlan}
          className="top-0 right-4 bg-white p-3 rounded-xl cursor-pointer  text-black backdrop-blur-lg h-fit shadow-lg  "
        >
          Save!
        </button>
      )}
    </div>
  );
};

export default Page;
