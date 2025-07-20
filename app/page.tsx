"use client";
import ASCIIText from "@/components/ASCIIText";
import SplashCursor from "@/components/SplashCursor";
import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center">
      <ASCIIText text="CodeMuse" enableWaves={true} asciiFontSize={8} />
      <SplashCursor />
      <Button className="-mt-22 bg-white text-black hover:bg-gray-200">
        Get Started
      </Button>
    </div>
  );
};

export default page;
