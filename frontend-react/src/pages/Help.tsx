import { useMemo, useState } from "react";
import { Mail, Phone, Ticket, Sparkles, Send, CheckCircle2 } from "lucide-react";

type TicketItem = {
  id: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
  createdAt: string;
};

const PLACEHOLDER_TICKETS: TicketItem[] = [
  { id: "MP-1021", subject: "Resume upload stuck on parsing", status: "Resolved", priority: "Medium", createdAt: "Today" },
  { id: "MP-1014", subject: "LLM suggestions not showing", status: "In Progress", priority: "High", createdAt: "Yesterday" },
  { id: "MP-1009", subject: "Listing Finder search feels slow", status: "Open", priority: "Low", createdAt: "2 days ago" },
];

function Pill({ text, tone }: { text: string; tone: "gray" | "green" | "yellow" | "red" }) {
  const cls =
    tone === "green"
      ? "bg-green-100 text-green-800 border-green-200"
      : tone === "yellow"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : tone === "red"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-gray-100 text-gray-800 border-gray-200";

  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>{text}</span>;
}

export default function Help() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Resume Refiner");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [desc, setDesc] = useState("");

  const canSubmit = useMemo(() => subject.trim().length > 2 && desc.trim().length > 10, [subject, desc]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // placeholder: clear fields like a “real” submit
    setSubject("");
    setDesc("");
    setCategory("Resume Refiner");
    setPriority("Medium");
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-8 animate-[fadeInUp_500ms_ease-out]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-[#385170]" />
              Help & Support
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#142d4c]">
              Need help?
            </h1>
            <p className="mt-2 text-gray-600">
              Submit a support ticket or contact us directly. (All placeholder info for demo.)
            </p>
          </div>

          {/* Contact card */}
          <div className="w-full md:w-[420px] rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="font-semibold text-[#142d4c] mb-3">Contact us</div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#385170]" />
                <span className="font-semibold">Phone:</span> (555) 123-4567
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#385170]" />
                <span className="font-semibold">Email:</span> support@mploy.dev
              </div>
              <div className="text-xs text-gray-500">
                Typical response time: 1–2 business days (placeholder).
              </div>
            </div>
          </div>
        </div>

        {/* Form + Ticket list */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ticket form */}
          <form onSubmit={onSubmit} className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-[#385170]" />
              <div className="font-semibold text-[#142d4c]">Submit a ticket</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#142d4c]">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#385170]/25 transition"
                  placeholder="e.g., Resume parsing stuck on upload"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#142d4c]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#385170]/25 transition"
                  >
                    <option>Resume Refiner</option>
                    <option>Listing Finder</option>
                    <option>Account</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#142d4c]">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-2 w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#385170]/25 transition"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-[#142d4c]">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="mt-2 w-full min-h-[140px] px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#385170]/25 transition"
                  placeholder="Describe what happened, what you expected, and any details…"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Tip: include the role link + what file you uploaded (placeholder).
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#142d4c] text-white font-semibold hover:bg-[#0f223a] disabled:opacity-50 transition shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </button>

                {submitted && (
                  <div className="inline-flex items-center gap-2 text-green-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Submitted!
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Ticket list */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <div className="font-semibold text-[#142d4c] mb-4">Recent tickets (placeholder)</div>

            <div className="space-y-3">
              {PLACEHOLDER_TICKETS.map((t) => (
                <div key={t.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500">{t.id} • {t.createdAt}</div>
                      <div className="font-semibold text-[#142d4c]">{t.subject}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Pill
                        text={t.status}
                        tone={t.status === "Resolved" ? "green" : t.status === "In Progress" ? "yellow" : "gray"}
                      />
                      <Pill
                        text={`${t.priority} priority`}
                        tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "yellow" : "gray"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-semibold text-[#142d4c] hover:bg-gray-50 transition">
              View all tickets (placeholder)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}