import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function DashboardPage(){

    const previewClass = `
        bg-themeGray
        w-full 
        h-[700px] 
        rounded-lg
    `;


    // Removes default padding and width opon rendering
    useEffect(() => {
        document.getElementById("root")?.classList.add("dashboard");
    
        return () => {
            document.getElementById("root")?.classList.remove("dashboard");
        };
    }, []);

    return (
        <main>
            <Navbar />
            <section 
            className="
                flex flex-row items-center 
                justify-center gap-12 
                h-[100svh] w-full px-12 pb-16">
                <div className={previewClass}></div>
                <div className={previewClass}></div>
                <div className={previewClass}></div>
            </section>
        </main>
    );
}