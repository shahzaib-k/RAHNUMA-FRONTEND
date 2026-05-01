import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const AtsChecker = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/ats/upload-resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        // Redirection to profile where the dynamic ATS score dashboard lives!
        navigate('/profile');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to analyze resume');
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("An error occurred during analyzing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 font-sans text-white">
      <div className="w-full max-w-2xl px-2">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/resume-builder")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="mr-2 mb-2 text-lg">←</span> Back to Resume Builder
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            ATS Score <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#d946ef]">Checker</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Upload your resume to check its Applicant Tracking System (ATS) compatibility and discover how to optimize it for your target role.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#ffffff0a] border border-[#ffffff15] backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center">
          
          <div className="w-full border-2 border-dashed border-[#ffffff30] rounded-2xl p-10 hover:border-[#a855f7] transition-all bg-[#ffffff05] group">
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#ffffff10] flex items-center justify-center group-hover:bg-[#a855f7]/20 transition-all">
                <svg className="w-8 h-8 text-gray-300 group-hover:text-[#a855f7] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              </div>
              <div className="text-lg font-medium text-gray-200">
                {file ? file.name : "Click to upload or drag and drop"}
              </div>
              <div className="text-sm text-gray-500">
                PDF or TXT (Max 5MB)
              </div>
            </label>
          </div>

          <button 
            disabled={!file || loading}
            onClick={handleAnalyze}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${!file || loading ? 'bg-[#ffffff10] text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#d946ef] text-white hover:opacity-90 active:scale-[0.99] transform'}`}
          >
            {loading ? 'Analyzing with AI...' : 'Analyze Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtsChecker;
