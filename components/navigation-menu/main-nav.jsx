"use client";

// Global imports
import { cn } from "@/lib/utils";
import { usePathname, useParams } from "next/navigation";

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
  const params = useParams();

  /**
   * Navigation routes for the application
   */
  const routes = [
    {
      href: `/excelConverter`,
      label: "Excel Converter",
      active: pathname === `/excelConverter`,
      id: "excel_Converter",
    },
  ];

  return (
    <NavigationMenu
      className={cn( "flex items-center space-x-4", className )}
      data-testid="main-NavigationMenu"
      {...props}
    >
      <NavigationMenuList className="flex space-x-4">
        {routes.map( ( route ) => (
          <NavigationMenuLink
            key={route.href}
            href={route.href}
            data-testid={route.id}
            className={cn(
              "pt-4 text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </NavigationMenuLink>
        ) )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
