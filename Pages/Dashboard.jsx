import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [traits, setTraits] = useState([]);
  const [aptitude, setAptitude] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasResult, setHasResult] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        let userId = "guest_unknown";
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            userId = u.id || u._id || null;
          } catch(e) {}
        }
        if (!userId || userId === "guest_unknown") {
          userId = localStorage.getItem('guestId');
        }

        if (!userId) {
          setHasResult(false);
          setLoading(false);
          return;
        }

        const [persRes, intelRes] = await Promise.all([
          fetch(`http://localhost:5000/api/personality/result?userId=${userId}`).catch(() => null),
          fetch(`http://localhost:5000/api/dashboard/intelligence/${userId}`).catch(() => null)
        ]);

        let hasPersonality = false;

        if (persRes && persRes.ok) {
          const data = await persRes.json();
          const fetchedTraits = [
            {
              name: "Openness",
              percentage: data.openness || 0,
              description: "Creative and open to new experiences",
            },
            {
              name: "Conscientiousness",
              percentage: data.conscientiousness || 0,
              description: "Organized and detail-oriented",
            },
            {
              name: "Extraversion",
              percentage: data.extraversion || 0,
              description: "Moderately outgoing and social",
            },
            {
              name: "Agreeableness",
              percentage: data.agreeableness || 0,
              description: "Compassionate and cooperative towards others",
            },
            {
              name: "Neuroticism",
              percentage: data.neuroticism || 0,
              description: "Sensitive to environmental stress",
            },
          ];
          setTraits(fetchedTraits);
          hasPersonality = true;
        }

        if (intelRes && intelRes.ok) {
          const intelData = await intelRes.json();
          setAptitude(intelData.aptitudeResult);
          setRecommendations(intelData.careerRecommendations);
          setAiInsight(intelData.aiInsight);
        }

        setHasResult(hasPersonality);
      } catch (error) {
        console.error("Failed to fetch personality results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a0b3b] bg-gradient-to-br from-[#1a0b3b] via-[#2d145c] to-[#1a0b3b] text-white p-6 md:p-12 font-sans">
      {/* Header Section */}
      <header className="mb-10">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 text-sm mb-6 flex items-center hover:text-white transition-colors cursor-pointer"
        > 
          <span className="mr-2 mb-2 text-lg">←</span> Back to Home 
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500/10 p-2 rounded-lg">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold">Your Results</h1>
        </div>
      </header>

      {/* Main Results Card */}
      <div className=" mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        <h2 className="text-xl font-semibold mb-8 text-gray-100">Big Five Personality Traits</h2>

        {loading ? (
          <div className="text-center text-purple-300 py-10">Loading your results...</div>
        ) : !hasResult ? (
          <div className="text-center py-10 space-y-6">
            <div className="text-gray-300 text-lg">You haven't taken the personality test yet!</div>
            <button 
              onClick={() => navigate('/assessments')}
              className="px-8 py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Take Personality Test Now
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {traits.map((trait, index) => (
              <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/5 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">{trait.name}</h3>
                  <span className="text-sm font-semibold text-purple-300">{trait.percentage}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${trait.percentage}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-400 font-light italic">
                  {trait.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Intelligence Report Sections */}
      {!loading && hasResult && aptitude && (
        <div className="mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Aptitude Analysis Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-100">Aptitude Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Logical', score: aptitude.logical, color: 'from-blue-400 to-indigo-500' },
                { label: 'Verbal', score: aptitude.verbal, color: 'from-indigo-400 to-purple-500' },
                { label: 'Quantitative', score: aptitude.quantitative, color: 'from-purple-400 to-pink-500' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center flex flex-col items-center shadow-inner">
                  <p className="text-gray-400 text-sm mb-2">{item.label}</p>
                  <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" strokeWidth="4" stroke="currentColor" fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className={`text-transparent fill-none stroke-current`}
                        strokeWidth="4" strokeDasharray={`${item.score}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    {/* Fake SVG Gradient workaround, or just use solid text-blue-400 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{item.score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-auto">
              <p className="text-sm text-blue-200">
                <span className="font-semibold text-blue-400">Insight:</span> {aptitude.summary}
              </p>
            </div>
          </div>

          {/* Top Recommendations Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-100">Top Career Matches</h2>
            </div>
            <div className="space-y-4 flex-1">
              {recommendations.slice(0, 5).map((rec, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold text-lg">#{idx + 1}</span>
                    <h3 className="font-medium text-white">{rec.career}</h3>
                  </div>
                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                    {rec.confidence}% Match
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Personalized AI Insight (Full Width) */}
          <div className="lg:col-span-2 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-32 h-32 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                 <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-100">AI Personalized Insight</h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg relative z-10">
              {aiInsight || "Your personalized insight is currently being generated..."}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;