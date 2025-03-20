'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const path = usePathname();
    const [navTitle, setNavTitle] = useState("");
    const pages = [
        {
            name: "Kodu",
            url: "/",
        },
        {
            name: "Mängi",
            url: "/email-please",
        },
    ];
    const [links, setLinks] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        const newLinks: React.ReactNode[] = [];
        pages.forEach((page) => {
            if (page.url === path) {
                newLinks.push(
                    <div
                        className="text-blue-200"
                        key={page.url}
                    >
                        {page.name}
                    </div>
                );
            } else {
                newLinks.push(
                    <Link
                        key={page.url}
                        href={page.url}
                        className="text-gray-500 hover:text-gray-300"
                    >
                        {page.name}
                    </Link>
                );
            }
        });
        

        setLinks(newLinks);

        switch (path) {
            case "/":
                document.title = "Kodu | Email Please";
                setNavTitle("Kodu");
                break;
            case "/email-please":
                document.title = "Mäng | Email Please";
                setNavTitle("Mäng");
                break;
            default:
                document.title = "Lehte pole | Email Please";
                setNavTitle("Lehte pole");
                break;
        }
    }, [path]);

    return (
        <div className="w-64 bg-gray-800 text-white h-screen">
            <div className="flex justify-center items-center py-4 font-bold text-2xl border-4 border-gray-700">
                {navTitle}
            </div>
            <div className="flex flex-col justify-around items-center py-6 px-3 h-1/3 min-h-50 font-bold text-xl border-4 border-gray-700">
                {links.map((link) => link)}
            </div>
        </div>
    );
};
export default Sidebar;
