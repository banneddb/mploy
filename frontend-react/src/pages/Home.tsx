import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  FileText,
  Briefcase,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/**
 * Simple IntersectionObserver hook for scroll-triggered animations
 */
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options ?? { threshold: 0.25 });

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

function FeatureCard({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm hover:shadow-md transition backdrop-blur"
    >
      <div className="w-12 h-12 rounded-xl bg-[#385170]/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-4 text-xl font-bold text-[#142d4c]">{title}</div>
      <div className="mt-2 text-gray-600">{desc}</div>
      <div className="mt-4 inline-flex items-center gap-2 text-[#385170] font-semibold">
        Open
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
      </div>
    </Link>
  );
}

function StepTimeline() {
  const steps = [
    {
      n: 1,
      title: "Upload your resume",
      desc: "Drop your PDF and we extract the real text on the backend — no copy/paste.",
      icon: <FileText className="w-5 h-5 text-[#385170]" />,
    },
    {
      n: 2,
      title: "Paste a job description",
      desc: "We pull the real skills from the JD (not the fluff) so your match is believable.",
      icon: <Briefcase className="w-5 h-5 text-[#385170]" />,
    },
    {
      n: 3,
      title: "Get a plan",
      desc: "See match score, missing skills, and AI suggestions focused on your gaps.",
      icon: <Zap className="w-5 h-5 text-[#385170]" />,
    },
  ];

  return (
    <div className="mt-8 relative">
      {/* vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

      <div className="space-y-6">
        {steps.map((s) => (
          <StepCard key={s.n} step={s} />
        ))}
      </div>
    </div>
  );
}

function StepCard({
  step,
}: {
  step: {
    n: number;
    title: string;
    desc: string;
    icon: React.ReactNode;
  };
}) {
  const { ref, inView } = useInView({ threshold: 0.25 });

  return (
    <div ref={ref} className="relative pl-16">
      {/* number bubble */}
      <div className="absolute left-0 top-5 w-10 h-10 rounded-full bg-[#385170]/10 flex items-center justify-center border border-gray-200">
        <span className="font-bold text-[#142d4c]">{step.n}</span>
      </div>

      {/* animated card */}
      <div
        className={[
          "rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-700",
          inView
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.98]",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#385170]/10 flex items-center justify-center">
            {step.icon}
          </div>
          <div className="text-lg font-semibold text-[#142d4c]">
            {step.title}
          </div>
        </div>

        <div className="mt-2 text-gray-600 leading-relaxed">{step.desc}</div>

        <div className="mt-4 text-sm font-semibold text-[#385170]">
          Step {step.n} ✓
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#9fd3c7]/35 blur-3xl" />
        <div className="absolute top-32 -right-24 h-80 w-80 rounded-full bg-[#385170]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#142d4c]/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        {/* HERO */}
        <div className="rounded-3xl border border-gray-200 bg-white/90 shadow-sm p-10 backdrop-blur">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
                <Sparkles className="w-4 h-4 text-[#385170]" />
                Built for students • deterministic match + AI advice
              </div>

              <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#142d4c]">
                Get a reality check{" "}
                <span className="text-[#385170]">before</span> you apply.
              </h1>

              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                Upload your resume. Paste a job description. We’ll tell you what
                you match, what you’re missing, and what to do next — in plain
                English.
              </p>

              <div className="mt-6 space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#385170]" />
                  No black box scoring — see matched vs missing skills.
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#385170]" />
                  AI suggestions focus on gaps (not stuff you already have).
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#385170]" />
                  Still works if AI goes down (deterministic fallback).
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/resume-refiner"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#142d4c] px-5 py-3 font-semibold text-white hover:bg-[#0f223a] transition shadow-sm hover:shadow-md"
                >
                  Analyze Resume
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition" />
                </Link>

                <Link
                  to="/listing-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-[#142d4c] hover:bg-gray-50 transition"
                >
                  Find Listings
                </Link>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Made at a hackathon. Built with{" "}
                <span className="text-[#385170] font-semibold">care</span> (and
                way too much coffee).
              </div>
            </div>

            {/* Example card */}
            <div className="w-full lg:w-[360px]">
              <div className="rounded-2xl bg-gradient-to-br from-[#142d4c] to-[#385170] p-6 text-white shadow-sm">
                <div className="text-sm opacity-85 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Example output
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <div className="text-5xl font-bold">86%</div>
                  <div className="pb-2 opacity-80">match</div>
                </div>

                <div className="mt-5">
                  <div className="text-xs opacity-70 mb-2">Missing</div>
                  <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm">
                    AWS
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-xs opacity-70 mb-2">AI suggestion</div>
                  <div className="text-sm leading-relaxed opacity-95">
                    Deploy a Node project to AWS (EC2/S3) and add a bullet showing
                    impact.
                  </div>
                </div>

                <div className="mt-6 text-xs opacity-75">
                  Tip: focus on the top 1–2 missing skills, not 20.
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                <div className="text-sm text-gray-700">
                  “This saved me from applying blind. I fixed 2 missing skills
                  and my resume instantly looked stronger.”
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  — every student the night before a deadline
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS — interactive vertical guide */}
        <div className="mt-10 rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#142d4c]">How it works</h2>
              <p className="mt-1 text-gray-600">
                Step-by-step. Scroll to follow the flow.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                <Sparkles className="w-4 h-4 text-[#385170]" />
                fast • explainable • useful
              </span>
            </div>
          </div>

          <StepTimeline />
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            to="/resume-refiner"
            icon={<FileText className="w-6 h-6 text-[#385170]" />}
            title="Resume Refiner"
            desc="Match %, missing skills, and actionable advice."
          />
          <FeatureCard
            to="/listing-finder"
            icon={<Briefcase className="w-6 h-6 text-[#385170]" />}
            title="Listing Finder"
            desc="Quickly test roles and see what you’re missing."
          />
          <FeatureCard
            to="/help"
            icon={<Users className="w-6 h-6 text-[#385170]" />}
            title="Help"
            desc="Need assistance? Contact us for general inquries."
          />
        </div>

        <div className="mt-10 text-center text-xs text-gray-500">
          MPloy • Fastify + FastAPI • deterministic scoring + LLM advice
        </div>
      </div>
    </div>
  );
}