import { useState } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";

export default function ResumeRefiner() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobListing, setJobListing] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleGenerate = () => {
    if (!resumeFile || !jobListing) {
      alert("Please upload a resume and enter a job listing");
      return;
    }

    // TODO: Add your generation logic here
    console.log("Generating with:", resumeFile.name, jobListing);
    alert("Generate functionality - ready to implement!");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="rounded-2xl p-8 bg-white/60 dark:bg-[#142d4c]/80 border border-[#385170]/10 dark:border-[#385170]/30">
        <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#385170] to-[#142d4c]">
          Resume Refiner
        </h1>
        <p className="text-lg text-[#385170]/70 dark:text-[#9fd3c7]/80 mb-10">
          Upload your resume and paste a job listing to get started
        </p>

        {/* Resume Upload Section */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-[#142d4c] dark:text-[#9fd3c7] mb-3">
            Upload Resume (PDF)
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
              isDragging
                ? "border-[#9fd3c7] bg-[#9fd3c7]/10 dark:bg-[#9fd3c7]/10"
                : resumeFile
                  ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                  : "border-[#385170]/20 dark:border-[#385170]/40 hover:border-[#9fd3c7] dark:hover:border-[#9fd3c7]"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="text-center pointer-events-none">
              {resumeFile ? (
                <>
                  <FileText className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <p className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                    {resumeFile.name}
                  </p>
                  <p className="text-sm text-[#385170]/60 dark:text-[#9fd3c7]/60">
                    Click or drag to replace
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-16 h-16 mx-auto mb-4 text-[#385170] dark:text-[#9fd3c7]" />
                  <p className="text-xl font-semibold text-[#142d4c] dark:text-[#9fd3c7] mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-sm text-[#385170]/60 dark:text-[#9fd3c7]/60">
                    or click to browse (PDF only)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Job Listing Section */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-[#142d4c] dark:text-[#9fd3c7] mb-3">
            Job Listing
          </label>

          <textarea
            value={jobListing}
            onChange={(e) => setJobListing(e.target.value)}
            placeholder="Paste the job listing here..."
            className="w-full h-64 p-4 rounded-xl border-2 border-[#385170]/20 dark:border-[#385170]/40 bg-white/80 dark:bg-[#142d4c]/50 text-[#142d4c] dark:text-[#ececec] placeholder:text-[#385170]/40 dark:placeholder:text-[#9fd3c7]/40 focus:outline-none focus:border-[#9fd3c7] dark:focus:border-[#9fd3c7] transition-colors resize-none"
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={!resumeFile || !jobListing}
            className="group relative px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#9fd3c7] to-[#385170] hover:from-[#385170] hover:to-[#142d4c] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center gap-3"
          >
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Generate!
          </button>
        </div>
      </div>
    </div>
  );
}
