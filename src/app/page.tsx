"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevents hydration mismatch

  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-grow">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to Utamu Wetu
          </h1>
          <p className="text-gray-500 mt-4">
            Building your professional organic food store...
          </p>
        </div>
      </section>
    </main>
  );
}
