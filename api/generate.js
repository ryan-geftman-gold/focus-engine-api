"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function DietitianFocusEngine() {
  const [food, setFood] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [flare, setFlare] = useState(false); // new: for gentle ripple

  useEffect(() => {
    const timer = setTimeout(() => setCardVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async () => {
    if (!food.trim()) return;
    setLoading(true);
    setResult("");

    // Trigger 200ms light flare
    setFlare(true);
    setTimeout(() => setFlare(false), 200);

    try {
      const response = await fetch(
        `/api/analyze?food=${encodeURIComponent(food)}`
      );
      const data = await response.json();
      setResult(data.text || "No result available.");
    } catch (error) {
      console.error(error);
      setResult("There was an error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${inter.className} min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-4 sm:px-6`}
    >
      <AnimatePresence>
        {cardVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white shadow-2xl rounded-3xl p-6 sm:p-10 max-w-md w-full border border-transparent bg-clip-padding backdrop-blur-md bg-opacity-90 text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center justify-center gap-2"
            >
              🍎 Dietitian&apos;s Focus Engine
            </motion.h1>

            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Find the one, most basic health benefit of any food — explained clearly.
            </p>

            <div className="mt-6 space-y-4 sm:space-y-5">
              <input
                type="text"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="Enter a food..."
                className="w-full border border-gray-300 rounded-xl p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 transition-shadow duration-200"
              />

              {/* Analyze Button with shimmer + heartbeat + flare */}
              <motion.button
                onClick={handleAnalyze}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                animate={{
                  scale: loading ? 1 : [1, 1.012, 1],
                  boxShadow: loading
                    ? "0px 0px 0px rgba(0,0,0,0)"
                    : [
                        "0 0 0px rgba(59,130,246,0.0)",
                        "0 0 10px rgba(59,130,246,0.25)",
                        "0 0 0px rgba(59,130,246,0.0)",
                      ],
                }}
                transition={{
                  scale: {
                    duration: 4.5, // calm heartbeat
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  boxShadow: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className={`relative overflow-hidden w-full ${
                  loading
                    ? "bg-blue-400"
                    : "bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700"
                } text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95`}
              >
                {/* Gradient shimmer sweep (soft green/blue) */}
                {!loading && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/25 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 4.5, // slow shimmer
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* NEW: gentle flare effect when clicked */}
                {flare && (
                  <motion.span
                    className="absolute inset-0 bg-white/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.7, 0] }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}

                <span className="relative z-10">
                  {loading ? "Analyzing..." : "Analyze Food"}
                </span>
              </motion.button>
            </div>

            <div className="mt-8 text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Nutritional Focus:
              </h2>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    key={result}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 shadow-sm"
                  >
                    <p className="text-base sm:text-lg leading-relaxed">
                      🍽 {result}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 text-xs sm:text-sm text-gray-400"
            >
              Made for learning, not medical advice.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
