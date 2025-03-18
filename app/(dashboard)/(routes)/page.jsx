import Hero from '@/components/ui/hero';

import Image from "next/image";


export default function Home ()
{
  return (
    <div className="bg-gradient-to-b relative to-[#8cb89a] flex flex-col items-center justify-center min-h-screen">

      {/* Hero Content */}
      <Hero />

      {/* About Section */}
      <section className="justify-center max-w-5xl flex-1 gap-8">

        <div className="flex-1">
          {/* About This Tool */}
          <div className="flex items-center gap-4">
            <Image
              src="/aboutTool.png"
              alt="About This Tool Icon"
              width={100}
              height={50}
            />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Effortless Excel Conversion & Comparison
            </h2>
          </div>

          <p className="text-gray-600 mt-2 text-lg">
            Designed for QA professionals, analysts, and data enthusiasts, this tool simplifies Excel-to-code conversions and Excel sheet comparisons—eliminating tedious manual work.
            Whether you're developing applications, automating workflows, or handling massive datasets, streamline your process and focus on what truly matters.
          </p>

          {/* The Challenge */}
          <div className="flex items-center gap-4 mt-8">
            <Image
              src="/problemToSolve.png"
              alt="Problem Solve Icon"
              width={100}
              height={200}
            />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              The Problem I Solved
            </h2>
          </div>

          <p className="text-gray-600 mt-2 text-lg">
            QA professionals and developers often need to compare Excel files and transform data into code-friendly formats—especially for automation.
            Without native file imports in tools like Bruno API, this meant manually processing thousands of data points, wasting valuable time.
          </p>

          <p className="text-gray-600 mt-2 text-lg">
            My tool automates this process, instantly converting and comparing Excel files so you can focus on testing—not tedious data prep.
          </p>
        </div>

      </section>


    </div>
  );
}
