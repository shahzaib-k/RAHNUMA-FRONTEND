import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Layout, CheckCircle, ArrowLeft, PenTool, Columns, Type, FileText } from 'lucide-react';

const TemplateSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formData = location.state?.formData;

  if (!formData) {
    navigate('/resume-builder');
    return null;
  }

  const templates = [
    {
      id: 'modern',
      name: 'Modern Template',
      description: 'Sleek, colorful accents, and contemporary layout designed to stand out.',
      icon: <PenTool className="w-8 h-8 text-blue-400 mb-4" />
    },
    {
      id: 'classic',
      name: 'Classic Template',
      description: 'Traditional, balanced, and straightforward. Perfect for corporate roles.',
      icon: <FileText className="w-8 h-8 text-indigo-400 mb-4" />
    },
    {
      id: 'minimal',
      name: 'Minimal Template',
      description: 'Clean, spacious, and focused heavily on typography and content.',
      icon: <Type className="w-8 h-8 text-gray-400 mb-4" />
    },
    {
      id: 'professional',
      name: 'Professional ATS',
      description: 'Highly structured and explicitly optimized for applicant tracking systems.',
      icon: <Columns className="w-8 h-8 text-purple-400 mb-4" />
    }
  ];

  const handleSelectTemplate = async (templateId) => {
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
          skills: formData.skills.split(',').map(s => s.trim()),
          selectedTemplate: templateId
        })
      });

      const data = await res.json();
      if (res.ok && data.resumeData) {
        navigate('/resume-editor', { state: { resumeData: data.resumeData, resumeId: data.resumeId, selectedTemplate: templateId, formData } });
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
    <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] text-white p-6 md:p-12 font-sans py-12">
      <div className="w-full max-w-6xl mx-auto">
         <div className="mb-6">
           <button
             onClick={() => navigate('/resume-builder')}
             className="flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
           >
             <ArrowLeft size={16} className="mr-2" /> Back to Builder
           </button>
         </div>

         <div className="text-center mb-12">
           <h1 className="text-4xl font-bold mb-4 tracking-tight">Select a Resume Template</h1>
           <p className="text-gray-400 max-w-2xl mx-auto">
             Choose the visual style for your resume. The AI will generate structured content seamlessly into the layout you pick. You can always change this later!
           </p>
         </div>

         {loading ? (
             <div className="flex flex-col items-center justify-center p-20">
               <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mb-4"></div>
               <h2 className="text-2xl font-semibold">Generating AI Resume...</h2>
               <p className="text-gray-400 mt-2">This may take a few seconds.</p>
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {templates.map((tpl) => (
                    <div key={tpl.id} className="bg-[#ffffff0a] border border-[#ffffff15] hover:border-purple-500 backdrop-blur-md rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center transition-all group hover:-translate-y-2">
                        {tpl.icon}
                        <h3 className="text-xl font-bold mb-2">{tpl.name}</h3>
                        <p className="text-sm text-gray-400 mb-6 flex-grow">{tpl.description}</p>
                        <button 
                           onClick={() => handleSelectTemplate(tpl.id)}
                           className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold opacity-90 hover:opacity-100 shadow flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle size={18} /> Use This Template
                        </button>
                    </div>
                 ))}
             </div>
         )}
      </div>
    </div>
  );
};

export default TemplateSelection;
