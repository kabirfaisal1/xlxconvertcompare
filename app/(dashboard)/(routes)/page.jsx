import Image from "next/image";

export default function Home ()
{
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#dfe7df]">

      {/* Hero Section */}
      <section className="text-center flex flex-col items-center gap-8 p-10 sm:p-16 lg:p-24 w-full max-w-5xl">
        <div className="max-w-3xl">
          <Image
            className="dark:invert rounded-lg mx-auto"
            src="/excel.svg"
            alt="Excel Mate Logo"
            width={335}
            height={210}
            priority
          />
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mt-4">
            Effortless Excel Conversion & Comparison
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 italic">
            Convert and compare Excel data instantly—no manual effort required.
          </p>
        </div>

        {/* Feature List */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-3xl w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-center gap-3">
              ✅ <a href="/excelConverter" className="hover:text-[#3A7D44] font-medium">
                Convert Excel to:
                <code className="bg-gray-200 px-2 py-1 rounded font-semibold ml-1">
                  {"{ JS, TS, JSON, Python, C# }"}
                </code>
              </a>
            </li>
            <li className="flex items-center gap-3">
              ✅ <a href="/excelComparison" className="hover:text-[#3A7D44] font-medium">
                Compare Excel Sheets Effortlessly
              </a>
            </li>
            <li className="flex items-center gap-3">
              ✅ <a href="/jsonConverter" className="hover:text-[#3A7D44] font-medium">
                Convert <code className="bg-gray-200 px-2 py-1 rounded font-semibold ml-1">{"{ JSON }"}</code> to Excel
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* About Section with Proper Bottom Spacing */}
      <section className="flex flex-col lg:flex-row justify-between items-center max-w-5xl w-full p-10 sm:p-16 lg:p-24 gap-10 bg-white shadow-md rounded-lg mb-16">
        {/* About Image */}
        <div className="flex-1">
          <Image
            src="/aboutTool.png"
            alt="About This Tool Icon"
            width={120}
            height={120}
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Why Choose This Tool?
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Built for QA professionals, developers, and data analysts, this tool eliminates manual work when dealing with Excel conversions and comparisons. Focus on innovation, not data formatting.
          </p>
        </div>

        {/* Problem Solved */}
        <div className="flex-1">
          <Image
            src="/problemToSolve.png"
            alt="Problem Solve Icon"
            width={120}
            height={120}
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            The Problem It Solves
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Automating Excel file comparison and conversions saves hours of work. This tool ensures accuracy and efficiency, making manual formatting a thing of the past.
          </p>
        </div>
      </section>

    </div>
  );
}
