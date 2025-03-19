import { useState } from "react";
import Navbar from "../components/Navbar";

export default function DashboardPage(){

    return (
        <main className="p-6">
            <Navbar />
            <section 
            className="
                flex flex-row items-center 
                justify-center gap-12 
                h-screen w-full">
                <div className="bg-themeGray w-full h-[75%] rounded-md"></div>
                <div className="bg-themeGray w-full h-[75%] rounded-md"></div>
                <div className="bg-themeGray w-full h-[75%] rounded-md"></div>
            </section>
        </main>
    );
}