import { MainNav } from "@/components/navigation-menu/main-nav";

const Navbar = () =>
{
  return (
    <div className="border-b sticky top-0 w-full z-50">
      <div className="flex h-16 items-center px-4" style={{ background: "#BCCCDC" }}>
        <MainNav className="mx-6 absolute left-1/2 transform -translate-x-1/2 flex justify-center" />
      </div>
    </div>
  );
};

export default Navbar;
