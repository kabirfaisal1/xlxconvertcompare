import Image from "next/image";
import { Linkedin } from 'lucide-react';

export default function Footer ()
{
    return (
        <footer className="w-full bg-[#BCCCDC] py-4 mt-auto">
            <div className="flex flex-wrap justify-center gap-6 items-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://www.linkedin.com/in/kabirfaisal89/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Linkedin aria-hidden width={16} height={16} />
                    Linkedin
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
            </div>
        </footer>
    );
}
