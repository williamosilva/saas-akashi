"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { jetbrainsMono, montserrat } from "@/styles/fonts";
import { fadeInUpVariants } from "@/animations/variation";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  autoPlayInterval?: number;
}

export function FeatureSteps({
  features,
  className,
  autoPlayInterval = 6000,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      <div className={cn("p-8 md:p-12 z-[1] relative", className)}>
        <div className="max-w-7xl mx-auto w-full  ">
          <motion.div
            custom={0}
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-3xl mx-auto mb-8 sm:mb-12 text-center"
          >
            <h2
              className={cn(
                "text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tighter",
                jetbrainsMono.className
              )}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500">
                Your Journey Starts Here
              </span>
            </h2>
          </motion.div>

          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10">
            <div className="order-2 md:order-1 space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-6 md:gap-8"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2",
                      index === currentFeature
                        ? "bg-emerald-500 border-emerald-500 text-zinc-900 scale-110"
                        : "bg-zinc-800 border-emerald-500/20 text-zinc-400"
                    )}
                  >
                    {index <= currentFeature ? (
                      <span className="text-lg font-bold">✓</span>
                    ) : (
                      <span className="text-lg font-semibold">{index + 1}</span>
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-xl md:text-2xl font-semibold text-zinc-100",
                        montserrat.className
                      )}
                    >
                      {feature.title || feature.step}
                    </h3>
                    <p className="text-sm md:text-lg text-zinc-500 font-montserrat">
                      {feature.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className={cn(
                "order-1 md:order-2 relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden rounded-lg"
              )}
            >
              <AnimatePresence mode="wait">
                {features.map(
                  (feature, index) =>
                    index === currentFeature && (
                      <motion.div
                        key={index}
                        className="absolute inset-0 rounded-lg overflow-hidden"
                        initial={{ y: 100, opacity: 0, rotateX: -20 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: -100, opacity: 0, rotateX: 20 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <Image
                          src={feature.image}
                          alt={feature.step}
                          className="w-full h-full object-cover transition-transform transform"
                          width={1440}
                          height={900}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center rounded-full border border-emerald-500/20 bg-zinc-800/50 p-2 shadow shadow-black/5 mt-14">
        <div className="flex -space-x-2.5">
          <img
            className="rounded-full ring-2 ring-zinc-900"
            src="https://i.pravatar.cc/32?img=11"
            width={32}
            height={32}
            alt="Avatar 01"
          />
          <img
            className="rounded-full ring-2 ring-zinc-900"
            src="https://i.pravatar.cc/32?img=20"
            width={32}
            height={32}
            alt="Avatar 02"
          />
          <img
            className="rounded-full ring-2 ring-zinc-900"
            src="https://i.pravatar.cc/32?img=47"
            width={32}
            height={32}
            alt="Avatar 03"
          />
          <img
            className="rounded-full ring-2 ring-zinc-900"
            src="https://i.pravatar.cc/32?img=58"
            width={32}
            height={32}
            alt="Avatar 04"
          />
        </div>
        <p className="px-3 text-sm text-zinc-400">
          Trusted by{" "}
          <strong className="font-medium text-emerald-300">100+</strong>{" "}
          developers.
        </p>
      </div>
      <div className="absolute z-[0] inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
