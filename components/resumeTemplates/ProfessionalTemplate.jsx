import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const ProfessionalTemplate = ({ resumeData, personalInfo, setPersonalInfo, handleTextChange, handleEnhance, getArrayText, autoResize, loadingAction }) => {
  return (
    <div className="bg-white text-gray-900 mx-auto shadow-2xl relative font-sans print:shadow-none" style={{ width: '210mm', minHeight: '297mm', padding: '15mm 15mm' }}>
      
      {/* Header section strict */}
      <div className="text-center mb-4">
        <input 
          className="w-full text-center text-2xl font-bold bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors uppercase print:hidden"
          value={personalInfo.fullName}
          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
          placeholder="Your Name"
        />
        <div className="hidden print:block w-full text-center text-2xl font-bold uppercase text-gray-900">
          {personalInfo.fullName}
        </div>

        <div className="flex justify-center gap-2 text-gray-800 mt-1 text-[13px] print:hidden">
            <input className="bg-transparent text-center outline-none border-b border-transparent focus:border-gray-300 w-auto" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="Email"/>
            <span>•</span>
            <input className="bg-transparent text-center outline-none border-b border-transparent focus:border-gray-300 w-auto" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="Phone"/>
            <span>•</span>
            <input className="bg-transparent text-center outline-none border-b border-transparent focus:border-gray-300 w-auto" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} placeholder="LinkedIn"/>
        </div>
        <div className="hidden print:flex justify-center gap-2 text-gray-800 mt-1 text-[13px]">
            <span>{personalInfo.email}</span><span>•</span><span>{personalInfo.phone}</span><span>•</span><span>{personalInfo.linkedin}</span>
        </div>
      </div>

      <hr className="border-gray-400 border-t-2 mb-3" />

      {/* Professional Summary */}
      <div className="mb-4 relative group">
        <h2 className="text-[14px] font-bold uppercase text-gray-900 mb-1">Professional Summary</h2>
        <textarea
          className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-100 focus:bg-gray-100 transition-colors leading-snug print:hidden text-[13px]"
          value={resumeData.summary || ''}
          onChange={(e) => { autoResize(e); handleTextChange('summary', e.target.value); }}
          ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
        />
        <div className="hidden print:block whitespace-pre-wrap leading-snug text-[13px]">
          {resumeData.summary}
        </div>
      </div>

      {resumeData.skills && resumeData.skills.length > 0 && (
         <div className="mb-4">
            <h2 className="text-[14px] font-bold uppercase text-gray-900 mb-1 border-b border-gray-300 pb-1">Core Competencies</h2>
            <div className="text-[13px] text-gray-900 leading-snug">
               {resumeData.skills.join(' | ')}
            </div>
         </div>
      )}

      {/* Experience Section */}
      <div className="mb-4">
        <h2 className="text-[14px] font-bold uppercase text-gray-900 mb-2 border-b border-gray-300 pb-1">Professional Experience</h2>
        {resumeData.experience?.map((exp, idx) => (
          <div key={idx} className="mb-3 relative group">
            <div className="flex justify-between items-baseline font-bold text-[13px]">
                <input className="bg-transparent outline-none flex-grow print:hidden" value={exp.role || ''} onChange={(e) => handleTextChange('experience', e.target.value, idx, 'role')} />
                <div className="hidden print:block flex-grow">{exp.role}</div>
            </div>
            <div className="flex justify-between items-baseline mb-1 text-[13px] italic">
               <input className="bg-transparent outline-none flex-grow print:hidden" value={exp.company || ''} onChange={(e) => handleTextChange('experience', e.target.value, idx, 'company')} />
               <div className="hidden print:block flex-grow">{exp.company}</div>
            </div>

            <textarea
              className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-100 focus:bg-gray-100 transition-colors text-[13px] leading-snug print:hidden"
              value={getArrayText(exp.description)}
              onChange={(e) => { autoResize(e); handleTextChange('experience', e.target.value, idx, 'description'); }}
              ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
            />
            <div className="hidden print:block whitespace-pre-wrap leading-snug text-[13px]">
              {getArrayText(exp.description)}
            </div>
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="mb-4">
        <h2 className="text-[14px] font-bold uppercase text-gray-900 mb-2 border-b border-gray-300 pb-1">Education</h2>
        {resumeData.education?.map((edu, idx) => (
          <div key={idx} className="mb-2 relative group flex flex-col text-[13px]">
            <div className="flex justify-between items-center font-bold">
                <input className="bg-transparent outline-none flex-grow print:hidden" value={edu.institution || ''} onChange={(e) => handleTextChange('education', e.target.value, idx, 'institution')} />
                <div className="hidden print:block flex-grow">{edu.institution}</div>
                <input className="w-32 text-right bg-transparent outline-none print:hidden" value={edu.year || ''} onChange={(e) => handleTextChange('education', e.target.value, idx, 'year')} />
                <div className="hidden print:block w-32 text-right">{edu.year}</div>
            </div>
            <input className="w-full bg-transparent outline-none print:hidden" value={edu.degree || ''} onChange={(e) => handleTextChange('education', e.target.value, idx, 'degree')} />
            <div className="hidden print:block w-full">{edu.degree}</div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
export default ProfessionalTemplate;
