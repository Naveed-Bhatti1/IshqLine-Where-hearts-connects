"use client";
import React, { useState, useEffect } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const maxScroll = 200;
  const opacity = Math.max(0, 1 - scrollY / maxScroll);
  const translateY = Math.min(scrollY / 5, 40); 

  return (
    <>
      <section className="relative h-[80vh] w-full">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/cover.jpg')",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 bg-opacity-70" />

        {/* Content container */}
        <div
          className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto px-6 md:px-16 text-white font-['Roboto','Noto_Sans',sans-serif]"
          style={{
            opacity,
            transform: `translateY(-${translateY}px)`,
            transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-medium mb-6 leading-tight drop-shadow-lg">
            IshqLine — Where Hearts Connect
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-lg drop-shadow-md opacity-90">
            Discover meaningful connections around you. Find your perfect match,
            share stories, and create memories.
          </p>

          <div className="flex space-x-6">
            <a
              href="/signup"
              className="bg-[#6A5AE0] hover:bg-[#5644c0] px-8 py-4 rounded-[24px] font-semibold shadow-lg transition duration-300"
            >
              Get Started
            </a>
            <a
              href="/learn-more"
              className="bg-transparent border border-[#FF5A7A] hover:bg-[#FF5A7A] hover:text-white text-[#FF5A7A] px-8 py-4 rounded-[24px] font-semibold shadow-lg transition duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
