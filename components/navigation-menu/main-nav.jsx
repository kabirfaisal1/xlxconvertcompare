"use client";

// Global imports
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Local imports
import
{
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function MainNav ( { className, ...props } )
{
  const pathname = usePathname();

  /**
   * Navigation routes for the application excelComparison
   */
  const routes = [
    {
      href: "/excelConverter",
      label: "Convert Excel to Code",
      id: "excel_converter",
    },
    {
      href: "/excelComparison",
      label: "Compare Excel Files",
      id: "excel_comparison",
    },
    {
      href: "/jsonConverter",
      label: "Convert JSON to Excel",
      id: "json_converter",
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
            data-testid={route.id} // ✅ Ensure consistency in test IDs
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors rounded-t-lg border-b-2 border-transparent",
              pathname === route.href
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
