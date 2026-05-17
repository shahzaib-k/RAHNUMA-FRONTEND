import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const ModernTemplate = ({ resumeData, personalInfo, setPersonalInfo, handleTextChange, handleEnhance, getArrayText, autoResize, loadingAction }) => {
  return (
    <div className="bg-white text-gray-900 mx-auto shadow-2xl relative print:shadow-none" style={{ width: '210mm', minHeight: '297mm', padding: '20mm 15mm', borderTop: '8px solid #6366f1' }}>
      
      {/* Header section */}
      <div className="mb-8 flex flex-col items-start">
        <input 
          className="w-full text-left text-4xl font-extrabold text-[#1a0b2e] bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors uppercase tracking-tight print:hidden"
          value={personalInfo.fullName}
          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
          placeholder="Your Name"
        />
        <div className="hidden print:block w-full text-left text-4xl font-extrabold text-[#1a0b2e] uppercase tracking-tight">
          {personalInfo.fullName}
        </div>

        <div className="flex justify-start gap-3 text-[#6366f1] font-medium mt-3 text-sm print:hidden">
            <input 
              className="bg-transparent outline-none border-b border-transparent focus:border-indigo-300 w-auto"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              placeholder="Email"
            />
            <span>•</span>
            <input 
              className="bg-transparent outline-none border-b border-transparent focus:border-indigo-300 w-auto"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              placeholder="Phone"
            />
            <span>•</span>
            <input 
              className="bg-transparent outline-none border-b border-transparent focus:border-indigo-300 w-auto"
              value={personalInfo.linkedin}
              onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
              placeholder="LinkedIn / Portfolio"
            />
        </div>
        <div className="hidden print:flex justify-start gap-3 text-[#6366f1] font-medium mt-3 text-sm">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.linkedin}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
           {/* Professional Summary */}
          <div className="mb-6 relative group">
            <h2 className="text-xl font-bold uppercase text-[#6366f1] tracking-wide mb-3 border-b-2 border-gray-100 pb-2">Profile</h2>
            <textarea
              className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-indigo-50 focus:bg-indigo-50 transition-colors leading-relaxed print:hidden text-gray-700"
              value={resumeData.summary || ''}
              onChange={(e) => { autoResize(e); handleTextChange('summary', e.target.value); }}
              ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
              placeholder="A brief summary of your professional background..."
            />
            <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-700">
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
            <h2 className="text-xl font-bold uppercase text-[#6366f1] tracking-wide mb-4 border-b-2 border-gray-100 pb-2">Experience</h2>
            {resumeData.experience?.map((exp, idx) => (
              <div key={idx} className="mb-5 relative group border-l-2 border-indigo-100 pl-4 ml-2">
                <input
                  className="w-full font-bold text-gray-900 text-lg bg-transparent outline-none hover:bg-indigo-50 focus:bg-indigo-50 transition-colors print:hidden"
                  value={exp.role || ''}
                  onChange={(e) => handleTextChange('experience', e.target.value, idx, 'role')}
                  placeholder="Job Role / Title"
                />
                <div className="hidden print:block w-full font-bold text-gray-900 text-lg">
                  {exp.role}
                </div>

                <input
                    className="w-full text-sm font-semibold text-indigo-600 bg-transparent outline-none hover:bg-indigo-50 focus:bg-indigo-50 transition-colors mb-2 print:hidden"
                    value={exp.company || ''}
                    onChange={(e) => handleTextChange('experience', e.target.value, idx, 'company')}
                    placeholder="Company / Organization"
                />
                <div className="hidden print:block w-full text-sm font-semibold text-indigo-600 mb-2">
                  {exp.company}
                </div>

                <textarea
                  className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-indigo-50 focus:bg-indigo-50 transition-colors text-gray-700 leading-relaxed print:hidden"
                  value={getArrayText(exp.description)}
                  onChange={(e) => { autoResize(e); handleTextChange('experience', e.target.value, idx, 'description'); }}
                  ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                  placeholder="Describe your responsibilities and achievements..."
                />
                <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-700">
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
                    <Zap size={12} /> {loadingAction === `experience-Add Action Verbs-${idx}` ? 'Wait...' : 'Action Verbs'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          {/* Projects Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-[#6366f1] tracking-wide mb-3 border-b-2 border-gray-100 pb-2">Projects</h2>
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
                  className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-1 text-sm text-gray-600 leading-relaxed print:hidden"
                  value={getArrayText(proj.description)}
                  onChange={(e) => { autoResize(e); handleTextChange('projects', e.target.value, idx, 'description'); }}
                  ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                  placeholder="Project description and technologies used..."
                />
                <div className="hidden print:block text-sm whitespace-pre-wrap leading-relaxed text-gray-600 mt-1">
                  {getArrayText(proj.description)}
                </div>
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold uppercase text-[#6366f1] tracking-wide mb-3 border-b-2 border-gray-100 pb-2">Education</h2>
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

                <input
                    className="w-full text-sm font-medium text-[#6366f1] bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors mt-1 print:hidden"
                    value={edu.degree || ''}
                    onChange={(e) => handleTextChange('education', e.target.value, idx, 'degree')}
                    placeholder="Degree / Major"
                />
                <div className="hidden print:block w-full text-sm font-medium text-[#6366f1] mt-1">
                  {edu.degree}
                </div>
                
                <input
                    className="w-full text-xs text-gray-500 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
                    value={edu.year || ''}
                    onChange={(e) => handleTextChange('education', e.target.value, idx, 'year')}
                    placeholder="Year (e.g. 2020 - 2024)"
                />
                <div className="hidden print:block w-full text-xs text-gray-500">
                    {edu.year}
                </div>
              </div>
            ))}
          </div>

           {/* Skills Section (fallback list interpretation) */}
           {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold uppercase text-[#6366f1] tracking-wide mb-3 border-b-2 border-gray-100 pb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                 {resumeData.skills.map((skill, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded text-sm font-medium border border-indigo-100">
                       {skill}
                    </span>
                 ))}
              </div>
            </div>
           )}

        </div>
      </div>
    </div>
  );
};
export default ModernTemplate;
