"use client";

import { redirect } from "next/navigation";
import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/navigation-menu/navbar";

export default function DashboardLayout ( { children } )
{
  return (
    <>
      <Navbar />

      {children}

    </>
  );
}
