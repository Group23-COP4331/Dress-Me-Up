import { useEffect } from "react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

export default function DashboardPage(){
    const previews = [
        {title: 'My Closet'},
        {title: 'Outfit of the Day'},
        {title: 'Explore'}
    ];
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
                {previews.map((item, index) => (
                    <DashboardCard key={index} {...item} />
                ))} 
            </section>
        </main>
    );
}