import React from 'react';
import { BarChart3, Brain, FileText, User } from 'lucide-react';

const Home = () => {
  const menuItems = [
    {
      title: "Dashboard",
      description: "View your progress, test results, and career recommendations",
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      link: "/dashboard"
    },
    {
      title: "Take Assessments",
      description: "Complete aptitude and personality tests tailored to your goals",
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      link: "/assessments"
    },
    {
      title: "Resume Builder",
      description: "Create ATS-optimized resumes with AI assistance",
      icon: <FileText className="w-8 h-8 text-pink-400" />,
      link: "/resume-builder"
    },
    {
      title: "Your Profile",
      description: "Manage your information and preferences",
      icon: <User className="w-8 h-8 text-green-400" />,
      link: "/profile"
    }
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom_right,#1b1836,#321a54,#541c81,#321a54,#1b1836)] text-white font-sans">
      <div className="flex flex-col items-center justify-center pt-16 px-4 pb-12">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">✨</span>
            <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
              Rahnuma
            </h1>
          </div>

          <p className="text-xl font-medium text-purple-200 mb-4">
            AI-Powered Career Guidance System
          </p>

          <p className="max-w-2xl text-purple-300/80 leading-relaxed mx-auto text-sm md:text-base">
            Discover your ideal career path through intelligent assessments, personalized recommendations, and professional development tools
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => (window.location.href = item.link)}
              className="group relative bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-8 hover:bg-white/15 hover:border-white/20 transition-all cursor-pointer shadow-2xl overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="mb-2">
                  {item.icon}
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h2>

                  <p className="text-purple-200/70 text-sm md:text-base leading-snug">
                    {item.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
};

export default Home;