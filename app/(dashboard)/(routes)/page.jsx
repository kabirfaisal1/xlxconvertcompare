import Image from "next/image";
import { Linkedin, Github } from 'lucide-react';

export default function Home ()
{
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert rounded-lg"
          src="/excel.svg"
          alt="excel mate logo"
          width={335}  // Bank card width
          height={210} // Bank card height
          priority
        />

        <h1 className="text-lg sm:text-xl font-medium tracking-[-.01em] text-center sm:text-left text-gray-600">
          A friendly tool for Excel data conversion and comparison.
        </h1>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            <a href="/excelConverter">

              Convert Excel to :
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                {"{ Javascript, Typescript, JSON, Python or C#}"}
              </code>
              .
            </a>

          </li>
          <li className="tracking-[-.01em]">
            <a href="/excelComparison">
              Compare Excel to Excel
            </a>
          </li>
          <li className="tracking-[-.01em]">
            <a href="/jsonConverter">
              Convert
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
                {"{ JSON }"}
              </code>
              to : Excel
            </a>

          </li>
        </ol>


      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/kabirfaisal89/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin
            aria-hidden
            width={16}
            height={16}
          />
          Linkedin
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/kabirfaisal1/xlxconvertcompare.git"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github
            aria-hidden
            width={16}
            height={16}
          />
          Github
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://kabirfaisal1.github.io/myReactProtfolio/#/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to Portfolio →
        </a>
      </footer>
    </div >
  );
}
