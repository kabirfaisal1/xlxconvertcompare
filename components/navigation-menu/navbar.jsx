import { MainNav } from "@/components/navigation-menu/main-nav";
import Image from "next/image";
import Link from "next/link";

const Navbar = () =>
{
  return (
    <div className="border-b sticky top-0 w-full z-50">
      <div className="flex h-16 items-center px-4" style={{ background: "#BCCCDC" }}>

        <Link href="/" className="flex items-center">
          <Image
            src="/excel.svg"
            alt="Home"
            width={100}
            height={100}
            className="mr-2"
          />
        </Link>
        <MainNav className="mx-6 absolute left-1/2 transform -translate-x-1/2 flex justify-center" />
      </div>
    </div>
  );
};

export default Navbar;
