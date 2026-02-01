import type { Route } from "./+types/home";
import { Link } from "react-router";
import { FileText, Briefcase } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NPloy - Home" },
    { name: "description", content: "Find your next opportunity" },
  ];
}

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#385170] to-[#142d4c] dark:text-[#ececec] dark:bg-none">
          Welcome to MPloy
        </h1>
        <p className="text-xl text-[#385170]/70 dark:text-[#9fd3c7]">
          Where you will get MPloyed
        </p>
      </div>

      {/* Two Clickable Boxes */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {/* Resume Refiner Box */}
        <Link
          to="/resume-finder"
          className="group relative w-full md:w-[35%] aspect-square rounded-2xl bg-white/60 dark:bg-[#142d4c]/80 border border-[#385170]/10 dark:border-[#385170]/30 hover:border-[#9fd3c7] dark:hover:border-[#9fd3c7] transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#9fd3c7]/10 to-[#385170]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9fd3c7] to-[#385170] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-white" strokeWidth={2} />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-[#142d4c] dark:text-[#9fd3c7] group-hover:text-[#385170] dark:group-hover:text-[#9fd3c7]/80 transition-colors">
              Resume Refiner
            </h2>

            <p className="text-center text-[#385170]/60 dark:text-[#9fd3c7]/70">
              Search and discover top talent resumes
            </p>
          </div>
        </Link>

        {/* Listing finder Box */}
        <Link
          to="/listing-finder"
          className="group relative w-full md:w-[35%] aspect-square rounded-2xl bg-white/60 dark:bg-[#142d4c]/80 border border-[#385170]/10 dark:border-[#385170]/30 hover:border-[#9fd3c7] dark:hover:border-[#9fd3c7] transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#9fd3c7]/10 to-[#385170]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#385170] to-[#142d4c] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-10 h-10 text-white" strokeWidth={2} />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-[#142d4c] dark:text-[#9fd3c7] group-hover:text-[#385170] dark:group-hover:text-[#9fd3c7]/80 transition-colors">
              Listing Finder
            </h2>

            <p className="text-center text-[#385170]/60 dark:text-[#9fd3c7]/70">
              Browse and find job opportunities
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
