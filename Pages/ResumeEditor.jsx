import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useReactToPrint } from 'react-to-print';
import { Download, Sparkles, Zap, ArrowLeft } from 'lucide-react';

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
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    linkedin: "linkedin.com/in/johndoe"
  });

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
          <button
            onClick={() => {
               if (typeof downloadPDF === 'function') downloadPDF();
            }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all cursor-pointer"
          >
            <Download size={20} />
            Download PDF
          </button>
        </header>
      </div>

      <div className="max-w-[850px] mx-auto print:max-w-none print:mx-0">
        {/* PDF Container - visually A4, white paper */}
        <div 
          id="resume-pdf-container" 
          ref={resumeRef}
          className="bg-white text-gray-900 mx-auto shadow-2xl relative print:shadow-none"
          style={{ width: '210mm', minHeight: '297mm', padding: '20mm 15mm' }}
        >
          {/* Header section */}
          <div className="text-center mb-6">
            <input 
              className="w-full text-center text-3xl font-bold bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors uppercase tracking-wider print:hidden"
              value={personalInfo.fullName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
              placeholder="Your Name"
            />
            <div className="hidden print:block w-full text-center text-3xl font-bold uppercase tracking-wider text-gray-900">
              {personalInfo.fullName}
            </div>

            <div className="flex justify-center gap-4 text-gray-600 mt-2 text-sm print:hidden">
               <input 
                  className="bg-transparent text-center outline-none border-b border-transparent focus:border-gray-300 w-40"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  placeholder="Email"
               />
               <span>|</span>
               <input 
                  className="bg-transparent text-center outline-none border-b border-transparent focus:border-gray-300 w-32"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  placeholder="Phone"
               />
               <span>|</span>
               <input 
                  className="bg-transparent text-center outline-none border-b border-transparent focus:border-gray-300 w-48"
                  value={personalInfo.linkedin}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                  placeholder="LinkedIn / Portfolio"
               />
            </div>
            {/* Print friendly contact info */}
            <div className="hidden print:flex justify-center gap-4 text-gray-600 mt-2 text-sm">
               <span>{personalInfo.email}</span>
               <span>|</span>
               <span>{personalInfo.phone}</span>
               <span>|</span>
               <span>{personalInfo.linkedin}</span>
            </div>
          </div>

          <hr className="border-gray-300 mb-4" />

          {/* Professional Summary */}
          <div className="mb-6 relative group">
            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-800 pb-1 mb-2">Professional Summary</h2>
            <textarea
              className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors leading-relaxed print:hidden text-gray-700"
              value={resumeData.summary || ''}
              onChange={(e) => { autoResize(e); handleTextChange('summary', e.target.value); }}
              ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
              placeholder="A brief summary of your professional background..."
            />
            <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-700">
              {resumeData.summary}
            </div>
            
            {/* Enhancement actions */}
            <div className="absolute -left-[140px] top-8 opacity-0 group-hover:opacity-100 transition-opacity no-print">
               <button 
                onClick={() => handleEnhance('summary', 'Improve Summary', resumeData.summary)}
                disabled={!resumeData.summary || loadingAction}
                className="cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm border border-purple-200"
              >
                <Sparkles size={12} /> 
                {loadingAction === 'summary-Improve Summary-null' ? '...' : 'Improve'}
              </button>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-800 pb-1 mb-3">Experience</h2>
            {resumeData.experience?.map((exp, idx) => (
              <div key={idx} className="mb-4 relative group">
                <input
                  className="w-full font-bold text-gray-800 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
                  value={exp.role || ''}
                  onChange={(e) => handleTextChange('experience', e.target.value, idx, 'role')}
                  placeholder="Job Role / Title"
                />
                <div className="hidden print:block w-full font-bold text-gray-800">
                  {exp.role}
                </div>

                <input
                   className="w-full text-sm italic text-gray-600 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors mb-1 print:hidden"
                   value={exp.company || ''}
                   onChange={(e) => handleTextChange('experience', e.target.value, idx, 'company')}
                   placeholder="Company / Organization"
                />
                <div className="hidden print:block w-full text-sm italic text-gray-600 mb-1">
                  {exp.company}
                </div>

                <textarea
                  className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-1 text-gray-700 leading-relaxed print:hidden"
                  value={getArrayText(exp.description)}
                  onChange={(e) => { autoResize(e); handleTextChange('experience', e.target.value, idx, 'description'); }}
                  ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                  placeholder="Describe your responsibilities and achievements..."
                />
                <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-700 mt-1">
                  {getArrayText(exp.description)}
                </div>

                <div className="absolute -left-[140px] top-6 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 no-print">
                  <button 
                    onClick={() => handleEnhance('experience', 'Rewrite Experience', getArrayText(exp.description), idx)}
                    disabled={!exp.description || loadingAction}
                    className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm border border-blue-200 w-[120px]"
                  >
                    <Sparkles size={12} />
                    {loadingAction === `experience-Rewrite Experience-${idx}` ? 'Wait...' : 'Rewrite'}
                  </button>
                  <button 
                    onClick={() => handleEnhance('experience', 'Add Action Verbs', getArrayText(exp.description), idx)}
                    disabled={!exp.description || loadingAction}
                    className="cursor-pointer bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm border border-green-200 w-[120px]"
                  >
                    <Zap size={12} />
                    {loadingAction === `experience-Add Action Verbs-${idx}` ? 'Wait...' : 'Action Verbs'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-800 pb-1 mb-3">Projects</h2>
            {resumeData.projects?.map((proj, idx) => (
              <div key={idx} className="mb-4 relative group">
                <input
                  className="w-full font-bold text-gray-800 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
                  value={proj.name || ''}
                  onChange={(e) => handleTextChange('projects', e.target.value, idx, 'name')}
                  placeholder="Project Name"
                />
                <div className="hidden print:block w-full font-bold text-gray-800">
                  {proj.name}
                </div>

                <textarea
                  className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-1 text-gray-700 leading-relaxed print:hidden"
                  value={getArrayText(proj.description)}
                  onChange={(e) => { autoResize(e); handleTextChange('projects', e.target.value, idx, 'description'); }}
                  ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                  placeholder="Project description and technologies used..."
                />
                <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-700 mt-1">
                  {getArrayText(proj.description)}
                </div>
              </div>
            ))}
          </div>
          
          {/* Education Section */}
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-800 pb-1 mb-3">Education</h2>
            {resumeData.education?.map((edu, idx) => (
              <div key={idx} className="mb-4 relative group flex flex-col">
                <input
                  className="w-full font-bold text-gray-800 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
                  value={edu.institution || ''}
                  onChange={(e) => handleTextChange('education', e.target.value, idx, 'institution')}
                  placeholder="Institution Name"
                />
                <div className="hidden print:block w-full font-bold text-gray-800">
                  {edu.institution}
                </div>

                <div className="flex justify-between items-center mt-1 print:hidden">
                  <input
                    className="w-full text-sm text-gray-600 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                    value={edu.degree || ''}
                    onChange={(e) => handleTextChange('education', e.target.value, idx, 'degree')}
                    placeholder="Degree / Major"
                  />
                  <input
                    className="w-32 text-sm text-right text-gray-600 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                    value={edu.year || ''}
                    onChange={(e) => handleTextChange('education', e.target.value, idx, 'year')}
                    placeholder="Year (e.g. 2020 - 2024)"
                  />
                </div>
                {/* Print friendly sub-row */}
                <div className="hidden print:flex justify-between items-center mt-1">
                  <div className="w-full text-sm text-gray-600 font-medium">
                    {edu.degree}
                  </div>
                  <div className="w-32 text-sm text-right text-gray-600 font-medium whitespace-nowrap">
                    {edu.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
