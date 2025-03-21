"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// This sidebar is the main navigation for the application. It is used to navigate between the different pages.
const Sidebar = () => {
  // Where are we now?
  const path = usePathname();

  // Title at the top of the sidebar.
  const [navTitle, setNavTitle] = useState("");

  // Available pages.
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

  // Links in the sidebar.
  const [links, setLinks] = useState<React.ReactNode[]>([]);

  // Initialize the links and title. Set the title to the current page. Redo when the URL changes.
  useEffect(() => {
    const newLinks: React.ReactNode[] = [];
    pages.forEach((page) => {
      if (page.url === path) {
        newLinks.push(
          <div className="text-blue-200" key={page.url}>
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
        setNavTitle("Email Please");
        break;
      default:
        document.title = "Lehte pole | Email Please";
        setNavTitle("Lehte pole");
        break;
    }
  }, [path]);

  // Render the sidebar.
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
