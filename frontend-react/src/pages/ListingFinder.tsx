import React, { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, MapPin, Building2, Search, Filter, Sparkles } from "lucide-react";

/** IntersectionObserver hook that tracks ENTER + LEAVE (so it can disappear too) */
function useInViewToggle(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options ?? { threshold: 0.25 }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Intern" | "New Grad" | "Part-time";
  tags: string[];
  blurb: string;
};

const PLACEHOLDER_JOBS: Job[] = [
  {
    id: "1",
    title: "Software Engineering Intern",
    company: "CFC (Placeholder)",
    location: "Philadelphia, PA (Hybrid)",
    type: "Intern",
    tags: ["React", "Node.js", "SQL", "AWS"],
    blurb:
      "Build internal tools and ship user-facing features. Work with a mentor and deliver a scoped project end-to-end.",
  },
  {
    id: "2",
    title: "Backend Intern — Platform",
    company: "Mercury-ish (Placeholder)",
    location: "Remote (US)",
    type: "Intern",
    tags: ["Node.js", "REST APIs", "Postgres", "Docker"],
    blurb:
      "Design and implement API endpoints, improve reliability, and write tests. Bonus if you’ve deployed services before.",
  },
  {
    id: "3",
    title: "Full-Stack Intern",
    company: "Startup (Placeholder)",
    location: "Tokyo (Onsite)",
    type: "Intern",
    tags: ["TypeScript", "React", "Fastify", "MySQL"],
    blurb:
      "Own a feature from UI to API to database. You’ll ship fast and learn a lot — perfect hackathon energy.",
  },
  {
    id: "4",
    title: "Data / Analytics Intern",
    company: "FinTech (Placeholder)",
    location: "New York, NY (Hybrid)",
    type: "Intern",
    tags: ["Python", "pandas", "SQL", "Tableau"],
    blurb:
      "Analyze product metrics, build dashboards, and write SQL queries to power business decisions.",
  },
  {
    id: "5",
    title: "Systems Intern",
    company: "Defense (Placeholder)",
    location: "Colorado Springs, CO",
    type: "Intern",
    tags: ["C/C++", "Linux", "Networking", "Git"],
    blurb:
      "Work close to the metal: performance, reliability, and systems-level debugging in a large codebase.",
  },
];

function Tag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#385170]/10 text-[#142d4c] border border-gray-200">
      {text}
    </span>
  );
}

function JobCard({ job }: { job: Job }) {
  const { ref, inView } = useInViewToggle({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={[
        "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700 will-change-transform",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold text-[#142d4c]">{job.title}</div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#385170]" />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#385170]" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#385170]" />
              {job.type}
            </span>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-[#142d4c] text-white font-semibold hover:bg-[#0f223a] transition shadow-sm hover:shadow-md">
          View
        </button>
      </div>

      <p className="mt-4 text-gray-600 leading-relaxed">{job.blurb}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map((t) => (
          <Tag key={t} text={t} />
        ))}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 bg-white font-semibold text-[#142d4c] hover:bg-gray-50 transition">
          Save
        </button>
        <button className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-200 bg-white font-semibold text-[#142d4c] hover:bg-gray-50 transition">
          Run Resume Check
        </button>
      </div>
    </div>
  );
}

export default function ListingFinder() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"All" | Job["type"]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return PLACEHOLDER_JOBS.filter((j) => {
      const matchesType = type === "All" ? true : j.type === type;
      const matchesQuery =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.tags.some((t) => t.toLowerCase().includes(q));
      return matchesType && matchesQuery;
    });
  }, [query, type]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8 animate-[fadeInUp_500ms_ease-out]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-[#385170]" />
              Listing Finder
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#142d4c]">
              Listing Finder
            </h1>
            <p className="mt-2 text-gray-600">
              Placeholder job board for the demo. Scroll to see cards animate in/out.
            </p>
          </div>

          {/* Search + filter */}
          <div className="w-full md:w-[420px] space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, company, location, skills…"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#385170]/25 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#142d4c]">
                <Filter className="w-4 h-4 text-[#385170]" />
                Type
              </div>

              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#142d4c] focus:outline-none focus:ring-2 focus:ring-[#385170]/25 transition"
              >
                <option value="All">All</option>
                <option value="Intern">Intern</option>
                <option value="New Grad">New Grad</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job list */}
      <div className="mt-8 space-y-5">
        {filtered.length ? (
          filtered.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            No results. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
}