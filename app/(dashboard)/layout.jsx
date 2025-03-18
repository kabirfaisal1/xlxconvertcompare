"use client";

import { redirect } from "next/navigation";
import React from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/navigation-menu/navbar";
import Footer from "@/components/ui/footer";


export default function DashboardLayout ( { children } )
{
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>


    </>
  );
}
