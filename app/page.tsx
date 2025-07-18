"use client";

import SplashCursor from "../components/SplashCursor";
import BlurText from "../components/BlurText";
import DecryptedText from "../components/DecryptedText";
import { useRouter } from "next/navigation";
import RotatingText from "../components/RotatingText";
import ScrollVelocity from "../components/ScrollVelocity";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <BlurText
        text="Isn't this so cool?!"
        delay={450}
        animateBy="words"
        direction="top"
        className="text-9xl mb-8"
      />
      <div className="mt-16 flex justify-center">
        <p className="max-w-3xl text-center text-2xl text-gray-100 font-semibold leading-relaxed">
          <DecryptedText
            text="CodeMuse is an intelligent web application built with Next.js, designed to automate and enhance the code review process using the power of AI. It acts as a virtual code reviewer that provides real-time feedback, detects bugs, suggests best practices, and ensures cleaner, more maintainable code — all from your browser."
            animateOn="view"
            revealDirection="center"
            className="inline"
          />
        </p>
      </div>
      <RotatingText
        texts={["React", "Bits", "Is", "Cool!"]}
        mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
        staggerFrom={"last"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />
      <ScrollVelocity
        texts={["React Bits", "Scroll Down"]}
        velocity={100}
        className="custom-scroll-text"
      />
      <SplashCursor />
    </div>
  );
}
