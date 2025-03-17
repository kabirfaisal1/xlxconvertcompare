import Image from "next/image";

export default function Hero ()
{
	return (

		<section className="flex flex-col items-center text-center gap-6 p-10 sm:p-16 lg:p-24 bg-gradient-to-b ">
			{/* Hero Content */}
			<div className="max-w-2xl">
				<Image
					className="dark:invert rounded-lg mx-auto"
					src="/excel.svg"
					alt="Excel Mate Logo"
					width={335}
					height={210}
					priority
				/>
				<h3 className="text-4xl sm:text-4xl">
					A Friendly Tool for Excel Data Conversion and Comparison
				</h3>
				<h4 className="mt-5 text-base sm:text-xl text-gray-500 italic">
					Simplify your workflow by converting Excel files into various formats and comparing Excel data with ease.
				</h4>
			</div>

			<div className="flex items-center">
				<ol className="flex flex-col gap-3 text-lg text-gray-700 list-none">
					<li className="flex items-center gap-2 before:content-['*'] before:text-xl before:text-gray-600">
						<a href="/excelConverter" className="hover:text-[#3A7D44]">
							Convert Excel to:
							<code className="bg-gray-200 px-2 py-1 rounded font-semibold ml-1">
								{"{ Javascript, Typescript, JSON, Python, C# }"}
							</code>
						</a>
					</li>
					<li className="flex items-center gap-2 before:content-['*'] before:text-xl before:text-gray-600">
						<a href="/excelComparison" className="hover:text-[#3A7D44]">
							Compare Excel to Excel
						</a>
					</li>
					<li className="flex items-center gap-2 before:content-['*'] before:text-xl before:text-gray-600">
						<a href="/jsonConverter" className="hover:text-[#3A7D44]">
							Convert
							<code className="bg-gray-200 px-2 py-1 rounded font-semibold ml-1">
								{"{ JSON }"}
							</code>
							to Excel
						</a>
					</li>
				</ol>
			</div>
		</section>

	);
}
