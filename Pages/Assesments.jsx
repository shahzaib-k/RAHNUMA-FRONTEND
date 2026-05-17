import React from 'react';
import { Target, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Assesments = () => {
  const navigate = useNavigate();

  const assessmentData = [
    {
      title: "Aptitude Test",
      icon: <Target className="w-8 h-8 text-purple-300" />,
      description: "Evaluate your cognitive abilities and technical skills for . AI-generated questions tailored to your career goals.",
      features: [
        "20 AI-generated questions",
        "Role-specific scenarios",
        "Instant AI evaluation",
        "Career recommendations"
      ],
      buttonText: "Start Aptitude Test",
      buttonColor: "bg-[#6366f1]", // Indigo/Blueish shade from image
      route: "/assessments/aptitude-test"
    },
    {
      title: "Personality Test",
      icon: <Brain className="w-8 h-8 text-purple-300" />,
      description: "Discover your Big Five (OCEAN) personality traits. AI-powered assessment to understand your work preferences and suitable environments.",
      features: [
        "Big Five model (OCEAN)",
        "20 personality questions",
        "AI trait analysis",
        "Environment matching"
      ],
      buttonText: "Start Personality Test",
      buttonColor: "bg-[#a855f7]", // Bright purple shade from image
      route: "/assessments/personality-test"
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] flex flex-col items-center p-6 md:p-12 font-sans text-white">
      <div className="w-full max-w-6xl">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="mr-2 mb-2 text-lg">←</span> Back to Home
          </button>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-12 tracking-tight">Career Assessments</h1>

        {/* Assessment Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {assessmentData.map((item, index) => (
            <div
              key={index}
              className="bg-[#ffffff0a] border border-[#ffffff15] backdrop-blur-lg rounded-3xl p-8 md:p-10 flex flex-col h-full shadow-2xl transition-transform hover:scale-[1.01]"
            >
              {/* Icon Container */}
              <div className="mb-6 bg-[#ffffff10] w-14 h-14 rounded-full flex items-center justify-center border border-[#ffffff1a]">
                {item.icon}
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold mb-4">{item.title}</h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                {item.description}
              </p>

              {/* Features List */}
              <ul className="space-y-4 mb-12 flex-grow">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="mr-3 text-lg">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => navigate(item.route)}
                className={`cursor-pointer w-full py-4 rounded-xl font-semibold text-lg ${item.buttonColor} hover:opacity-90 transition-all shadow-lg active:scale-95`}
              >
                {item.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assesments;