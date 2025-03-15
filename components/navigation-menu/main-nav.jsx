"use client";

// Global imports
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Local imports
import
{
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function MainNav ( { className, ...props } )
{
  const pathname = usePathname(); // Directly use usePathname() to prevent hydration issues

  /**
   * Navigation routes for the application
   */
  const routes = [
    {
      href: `/excelConverter`, // Ensure lowercase for consistency
      label: "Convert Excel to Code",
      active: pathname === `/excelConverter`, // Match the exact path
      id: "excel_Converter",
    },
    {
      href: `/jsonConverter`, // Ensure lowercase for consistency
      label: "Convert JSON to Excel",
      active: pathname === `/jsonConverter`, // Match the exact path
      id: "json_Converter",
    },
  ];

  return (
    <NavigationMenu
      className={cn( "flex items-center space-x-2", className )}
      data-testid="main-NavigationMenu"
      {...props}
    >
      <NavigationMenuList className="flex space-x-2">
        {routes.map( ( route ) => (
          <NavigationMenuLink
            key={route.href}
            href={route.href}
            data-testid={route.id}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors rounded-t-lg border-b-2 border-transparent bg-gray-100 dark:bg-gray-800",
              route.active
                ? "bg-white dark:bg-gray-900 border-b-white dark:border-b-gray-900 text-black dark:text-white shadow-[0px_4px_10px_#8B5DFF]"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {route.label}
          </NavigationMenuLink>
        ) )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
