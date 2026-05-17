import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

// Similar to the original monolithic layout but slightly adjusted for "classic" feel.
const ClassicTemplate = ({ resumeData, personalInfo, setPersonalInfo, handleTextChange, handleEnhance, getArrayText, autoResize, loadingAction }) => {
  return (
    <div className="bg-white text-gray-900 mx-auto shadow-2xl relative font-serif print:shadow-none" style={{ width: '210mm', minHeight: '297mm', padding: '20mm 15mm' }}>
      
      {/* Header section */}
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-6">
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
        <div className="hidden print:flex justify-center gap-4 text-gray-600 mt-2 text-sm">
            <span>{personalInfo.email}</span>
            <span>|</span>
            <span>{personalInfo.phone}</span>
            <span>|</span>
            <span>{personalInfo.linkedin}</span>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mb-6 relative group">
        <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-400 pb-1 mb-2">Professional Summary</h2>
        <textarea
          className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors leading-relaxed print:hidden text-gray-800"
          value={resumeData.summary || ''}
          onChange={(e) => { autoResize(e); handleTextChange('summary', e.target.value); }}
          ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
          placeholder="A brief summary of your professional background..."
        />
        <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-800">
          {resumeData.summary}
        </div>
        
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
        <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-400 pb-1 mb-3">Experience</h2>
        {resumeData.experience?.map((exp, idx) => (
          <div key={idx} className="mb-4 relative group">
            <div className="flex justify-between items-baseline">
                <input
                className="font-bold text-gray-900 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden flex-grow"
                value={exp.role || ''}
                onChange={(e) => handleTextChange('experience', e.target.value, idx, 'role')}
                placeholder="Job Role / Title"
                />
                <div className="hidden print:block font-bold text-gray-900 flex-grow">
                {exp.role}
                </div>
                
                <input
                    className="text-right text-sm italic text-gray-600 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden w-1/3"
                    value={exp.company || ''}
                    onChange={(e) => handleTextChange('experience', e.target.value, idx, 'company')}
                    placeholder="Company / Organization"
                />
                <div className="hidden print:block text-right text-sm italic text-gray-600 w-1/3">
                {exp.company}
                </div>
            </div>

            <textarea
              className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-2 text-gray-800 leading-relaxed print:hidden text-sm"
              value={getArrayText(exp.description)}
              onChange={(e) => { autoResize(e); handleTextChange('experience', e.target.value, idx, 'description'); }}
              ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
              placeholder="Describe your responsibilities and achievements..."
            />
            <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-800 mt-2 text-sm">
              {getArrayText(exp.description)}
            </div>

            <div className="absolute -left-[140px] top-6 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 no-print">
              <button 
                onClick={() => handleEnhance('experience', 'Rewrite Experience', getArrayText(exp.description), idx)}
                disabled={!exp.description || loadingAction}
                className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm w-[120px]"
              >
                <Sparkles size={12} /> {loadingAction === `experience-Rewrite Experience-${idx}` ? 'Wait...' : 'Rewrite'}
              </button>
              <button 
                onClick={() => handleEnhance('experience', 'Add Action Verbs', getArrayText(exp.description), idx)}
                disabled={!exp.description || loadingAction}
                className="cursor-pointer bg-green-100 text-green-700 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-sm w-[120px]"
              >
                <Zap size={12} /> {loadingAction === `experience-Add Action Verbs-${idx}` ? 'Wait...' : 'Verbs'}
              </button>
            </div>
          </div>
        ))}
      </div>

       {resumeData.skills && resumeData.skills.length > 0 && (
         <div className="mb-6">
            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-400 pb-1 mb-2">Capabilities</h2>
            <div className="text-sm text-gray-800 leading-relaxed">
               {resumeData.skills.join(', ')}
            </div>
         </div>
       )}

      {/* Projects Section */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-400 pb-1 mb-3">Projects</h2>
        {resumeData.projects?.map((proj, idx) => (
          <div key={idx} className="mb-4 relative group">
            <input
              className="w-full font-bold text-gray-900 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
              value={proj.name || ''}
              onChange={(e) => handleTextChange('projects', e.target.value, idx, 'name')}
              placeholder="Project Name"
            />
            <div className="hidden print:block w-full font-bold text-gray-900">
              {proj.name}
            </div>

            <textarea
              className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-1 text-gray-800 leading-relaxed print:hidden text-sm"
              value={getArrayText(proj.description)}
              onChange={(e) => { autoResize(e); handleTextChange('projects', e.target.value, idx, 'description'); }}
              ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
              placeholder="Project description and technologies used..."
            />
            <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-800 mt-1 text-sm">
              {getArrayText(proj.description)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Education Section */}
      <div className="mb-6">
        <h2 className="text-sm font-bold uppercase text-gray-800 tracking-widest border-b border-gray-400 pb-1 mb-3">Education</h2>
        {resumeData.education?.map((edu, idx) => (
          <div key={idx} className="mb-4 relative group flex flex-col">
            <div className="flex justify-between items-center print:hidden">
                <input
                className="font-bold text-gray-900 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors flex-grow"
                value={edu.institution || ''}
                onChange={(e) => handleTextChange('education', e.target.value, idx, 'institution')}
                placeholder="Institution Name"
                />
                <input
                className="w-32 text-sm text-right text-gray-600 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                value={edu.year || ''}
                onChange={(e) => handleTextChange('education', e.target.value, idx, 'year')}
                placeholder="Year (e.g. 2020 - 2024)"
                />
            </div>
            
            <div className="hidden print:flex justify-between items-center">
              <div className="font-bold text-gray-900 flex-grow">
                {edu.institution}
              </div>
              <div className="w-32 text-sm text-right text-gray-600 font-medium whitespace-nowrap">
                {edu.year}
              </div>
            </div>

            <input
                className="w-full text-sm italic text-gray-800 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-1 print:hidden"
                value={edu.degree || ''}
                onChange={(e) => handleTextChange('education', e.target.value, idx, 'degree')}
                placeholder="Degree / Major"
            />
            <div className="hidden print:block w-full text-sm italic text-gray-800 mt-1">
                {edu.degree}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
export default ClassicTemplate;
