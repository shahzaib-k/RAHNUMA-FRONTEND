import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    skills: '',
    experience: '',
    targetRole: '',
    jobDescription: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!formData.name || !formData.skills || !formData.targetRole || !formData.education) {
      alert("Please fill in Name, Target Role, Education, and Skills at minimum.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('token');
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim())
        })
      });

      const data = await res.json();
      if (res.ok && data.resumeData) {
        navigate('/resume-editor', { state: { resumeData: data.resumeData, resumeId: data.resumeId } });
      } else {
        alert(data.error || 'Failed to generate resume');
      }
    } catch (error) {
      console.error(error);
      alert('Error generating resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] flex flex-col items-center p-4 font-sans text-white py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-6">
         <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="mr-2 mb-2 text-lg">←</span> Back to Home
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-8 tracking-tight">AI Resume Builder</h1>

        <div className="bg-[#ffffff0a] border border-[#ffffff15] backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Personal details & Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name (e.g. John Doe)"
                className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500"
              />
              <input
                type="text"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="Target Role (e.g. Frontend Developer)"
                className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500"
              />
            </div>
            
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Education (e.g. BSc Computer Science, XYZ University, 2020)"
              rows={2}
              className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg px-4 py-3 mb-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500 resize-none"
            />
            
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated, e.g. React, Node.js, Python)"
              rows={2}
              className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg px-4 py-3 mb-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500 resize-none"
            />
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-6">Experience & Target Job</h2>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Work Experience (Briefly list your prev roles & responsibilities)"
              rows={4}
              className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg px-4 py-3 mb-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500 resize-none"
            />

            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Optional: Paste the Job Description here for AI optimization"
              rows={4}
              className="w-full bg-[#ffffff0d] border border-[#ffffff1a] rounded-lg px-4 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="cursor-pointer flex-1 py-4 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#d946ef] font-bold text-lg shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity active:scale-[0.99] transform"
            >
              {loading ? "Generating Resume..." : "Generate Resume with AI"}
            </button>
            <button 
              onClick={() => navigate('/ats-checker')}
              className="cursor-pointer flex-1 py-4 rounded-xl bg-[#ffffff10] border border-[#ffffff20] hover:bg-[#ffffff20] hover:text-white font-bold text-lg shadow-lg transition-all active:scale-[0.99] transform text-gray-300"
            >
              Check ATS Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;