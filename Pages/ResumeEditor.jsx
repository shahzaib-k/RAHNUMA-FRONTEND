import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useReactToPrint } from 'react-to-print';
import { Download, Sparkles, Zap, ArrowLeft, LayoutTemplate } from 'lucide-react';
import ModernTemplate from '../components/resumeTemplates/ModernTemplate';
import ClassicTemplate from '../components/resumeTemplates/ClassicTemplate';
import MinimalTemplate from '../components/resumeTemplates/MinimalTemplate';
import ProfessionalTemplate from '../components/resumeTemplates/ProfessionalTemplate';

const ResumeEditor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(location.state?.resumeData || {
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: []
  });
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: location.state?.formData?.name || "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    linkedin: "linkedin.com/in/johndoe"
  });

  const [selectedTemplate, setSelectedTemplate] = useState(location.state?.selectedTemplate || 'modern');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const [loadingAction, setLoadingAction] = useState(null);
  const resumeRef = useRef();

  const handleEnhance = async (sectionKey, enhancementType, content, arrayIndex = null) => {
    try {
      setLoadingAction(`${sectionKey}-${enhancementType}-${arrayIndex}`);
      const token = Cookies.get('token');
      
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          sectionContent: content,
          enhancementType,
          targetRole: "Professional"
        })
      });

      const data = await res.json();
      if (res.ok && data.improvedContent) {
        if (arrayIndex !== null) {
            const newList = [...resumeData[sectionKey]];
            newList[arrayIndex] = { ...newList[arrayIndex], description: data.improvedContent };
            setResumeData({ ...resumeData, [sectionKey]: newList });
        } else {
            setResumeData({ ...resumeData, [sectionKey]: data.improvedContent });
        }
      } else {
        alert("Failed to enhance section");
      }
    } catch (err) {
      alert("Error enhancing");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTextChange = (key, val, arrayIndex = null, objKey = null) => {
    if (arrayIndex !== null && objKey !== null) {
      const newList = [...resumeData[key]];
      newList[arrayIndex] = { ...newList[arrayIndex], [objKey]: val };
      setResumeData({ ...resumeData, [key]: newList });
    } else {
      setResumeData({ ...resumeData, [key]: val });
    }
  };

  // Using standard react-to-print. Falls back directly to native browser PDF generation, bypassing html2canvas!
  const downloadPDF = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: 'My_Resume',
  });

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const getArrayText = (val) => Array.isArray(val) ? val.join('\n') : (val || '');

  return (
    <div className="min-h-screen bg-[#1a0b3b] bg-gradient-to-br from-[#1a0b3b] via-[#2d145c] to-[#1a0b3b] text-white p-6 md:p-12 font-sans overflow-x-auto text-sm print:bg-white print:p-0">
      <style>
        {`
          @media print {
            @page { margin: 0; size: A4 portrait; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
            .no-print { display: none !important; }
            #resume-pdf-container { 
              box-shadow: none !important; 
              margin: 0 !important; 
              width: 100% !important; 
              padding: 15mm !important; 
            }
          }
        `}
      </style>

      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity no-print">
          <div className="bg-[#1a0b3b] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">Select a Template</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               {['modern', 'classic', 'minimal', 'professional'].map(t => (
                  <button 
                     key={t} 
                     onClick={() => { setSelectedTemplate(t); setIsTemplateModalOpen(false); }}
                     className={`p-4 rounded-xl border ${selectedTemplate === t ? 'border-purple-500 bg-purple-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'} text-white font-medium capitalize flex flex-col items-center justify-center gap-2 cursor-pointer transition-all`}
                  >
                     <LayoutTemplate size={24} className={selectedTemplate === t ? 'text-purple-400' : 'text-gray-400'} />
                     {t}
                  </button>
               ))}
            </div>
            <button
               onClick={() => setIsTemplateModalOpen(false)}
               className="w-full py-3 px-4 rounded-xl shadow-lg transition-all cursor-pointer bg-white/10 hover:bg-white/20 font-semibold"
            >
               Cancel
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[850px] mx-auto no-print">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate("/resume-builder")}
              className="text-gray-400 text-sm mb-4 flex items-center hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Builder
            </button>
            <h1 className="text-4xl font-bold mb-2">Resume Editor</h1>
            <p className="text-gray-400">Review, enhance, and download your resume</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg transition-all cursor-pointer"
            >
              <LayoutTemplate size={20} />
              Change Template
            </button>
            <button
              onClick={() => {
                 if (typeof downloadPDF === 'function') downloadPDF();
              }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all cursor-pointer"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </header>
      </div>

      <div className="max-w-[850px] mx-auto print:max-w-none print:mx-0 min-h-screen">
        <div ref={resumeRef}>
          {(() => {
            const props = {
              resumeData,
              personalInfo,
              setPersonalInfo,
              handleTextChange,
              handleEnhance,
              getArrayText,
              autoResize,
              loadingAction
            };
            switch (selectedTemplate) {
              case 'classic': return <ClassicTemplate {...props} />;
              case 'minimal': return <MinimalTemplate {...props} />;
              case 'professional': return <ProfessionalTemplate {...props} />;
              case 'modern':
              default: return <ModernTemplate {...props} />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
