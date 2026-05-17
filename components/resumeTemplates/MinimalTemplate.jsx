import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const MinimalTemplate = ({ resumeData, personalInfo, setPersonalInfo, handleTextChange, handleEnhance, getArrayText, autoResize, loadingAction }) => {
  return (
    <div className="bg-white text-gray-800 mx-auto shadow-2xl relative font-sans print:shadow-none" style={{ width: '210mm', minHeight: '297mm', padding: '25mm 20mm' }}>
      
      {/* Header section */}
      <div className="mb-10 text-left">
        <input 
          className="w-full text-5xl font-light tracking-widest text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors lowercase print:hidden"
          value={personalInfo.fullName}
          onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
          placeholder="your name"
        />
        <div className="hidden print:block w-full text-5xl font-light tracking-widest text-gray-900 lowercase">
          {personalInfo.fullName}
        </div>

        <div className="flex flex-wrap text-gray-500 mt-4 text-xs tracking-widest uppercase print:hidden gap-x-6 gap-y-2">
            <input 
              className="bg-transparent outline-none border-b border-transparent focus:border-gray-300 w-auto min-w-[150px]"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              placeholder="Email"
            />
            <input 
              className="bg-transparent outline-none border-b border-transparent focus:border-gray-300 w-auto min-w-[120px]"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              placeholder="Phone"
            />
            <input 
              className="bg-transparent outline-none border-b border-transparent focus:border-gray-300 w-auto min-w-[180px]"
              value={personalInfo.linkedin}
              onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
              placeholder="LinkedIn / Portfolio"
            />
        </div>
        <div className="hidden print:flex flex-wrap text-gray-500 mt-4 text-xs tracking-widest uppercase gap-x-6 gap-y-2">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.linkedin}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3 text-right sticky top-0">
           {resumeData.summary && <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 mt-2">Profile</h2>}
           <div className="mb-12"></div>
           
           {resumeData.experience?.length > 0 && <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 mt-2">Work</h2>}
        </div>
        <div className="col-span-9">

            {/* Professional Summary */}
            <div className="mb-12 relative group">
                <textarea
                className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors leading-relaxed print:hidden text-sm text-gray-600"
                value={resumeData.summary || ''}
                onChange={(e) => { autoResize(e); handleTextChange('summary', e.target.value); }}
                ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                placeholder="A brief summary of your professional background..."
                />
                <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-sm text-gray-600">
                {resumeData.summary}
                </div>
                
                <div className="absolute -left-[140px] top-0 opacity-0 group-hover:opacity-100 transition-opacity no-print">
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
            <div className="mb-12">
                {resumeData.experience?.map((exp, idx) => (
                <div key={idx} className="mb-8 relative group">
                    <div className="flex flex-col mb-2">
                        <input
                        className="font-bold text-gray-900 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
                        value={exp.role || ''}
                        onChange={(e) => handleTextChange('experience', e.target.value, idx, 'role')}
                        placeholder="Job Role / Title"
                        />
                        <div className="hidden print:block font-bold text-gray-900">
                        {exp.role}
                        </div>
                        
                        <input
                            className="text-sm text-gray-500 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors print:hidden"
                            value={exp.company || ''}
                            onChange={(e) => handleTextChange('experience', e.target.value, idx, 'company')}
                            placeholder="Company / Organization"
                        />
                        <div className="hidden print:block text-sm text-gray-500">
                        {exp.company}
                        </div>
                    </div>

                    <textarea
                    className="w-full bg-transparent outline-none resize-none overflow-hidden hover:bg-gray-50 focus:bg-gray-50 transition-colors text-gray-600 leading-relaxed print:hidden text-sm"
                    value={getArrayText(exp.description)}
                    onChange={(e) => { autoResize(e); handleTextChange('experience', e.target.value, idx, 'description'); }}
                    ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                    placeholder="Describe your responsibilities and achievements..."
                    />
                    <div className="hidden print:block whitespace-pre-wrap leading-relaxed text-gray-600 text-sm">
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
                    </div>
                </div>
                ))}
            </div>

        </div>
      </div>

       <div className="grid grid-cols-12 gap-8 mt-4">
        <div className="col-span-3 text-right">
             <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 mt-2">Edu</h2>
        </div>
        <div className="col-span-9">
            {/* Education Section */}
            <div className="mb-12">
            {resumeData.education?.map((edu, idx) => (
                <div key={idx} className="mb-4 relative group flex flex-col">
                    <input
                    className="font-bold text-gray-900 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                    value={edu.institution || ''}
                    onChange={(e) => handleTextChange('education', e.target.value, idx, 'institution')}
                    placeholder="Institution Name"
                    />
                    <div className="flex justify-start gap-2 items-center">
                        <input
                            className="text-sm text-gray-600 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors w-auto"
                            value={edu.degree || ''}
                            onChange={(e) => handleTextChange('education', e.target.value, idx, 'degree')}
                            placeholder="Degree"
                        />
                        <span className="text-gray-400">|</span>
                        <input
                            className="text-sm text-gray-400 bg-transparent outline-none hover:bg-gray-50 focus:bg-gray-50 transition-colors w-24"
                            value={edu.year || ''}
                            onChange={(e) => handleTextChange('education', e.target.value, idx, 'year')}
                            placeholder="Year"
                        />
                    </div>
                </div>
            ))}
            </div>
        </div>
       </div>

    </div>
  );
};
export default MinimalTemplate;
