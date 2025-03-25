import { useEffect } from "react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import closetImage from "../assets/Dashboard/mycloset.jpg";
import calendarImage from "../assets/Dashboard/mycloset.jpg";

export default function DashboardPage(){
    const previews = [
        {title: 'My Closet', desc: 'Your wardrobe, reimagined. Organize, favorite, and style your outfits effortlessly.', pic: closetImage},
        {title: 'Outfit of the Day', desc:'Stay ahead of the forecast and seamlessly plan outfits for every occasion.', pic: closetImage}
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
                justify-center gap-32
                h-[100svh] w-full pb-16">
                {previews.map((item, index) => (
                    <DashboardCard key={index} {...item} />
                ))} 
            </section>
        </main>
    );
}