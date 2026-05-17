import React, { useEffect, useState } from 'react';
import { Brain, Target, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [atsScore, setAtsScore] = useState("--");
  const [atsFeedback, setAtsFeedback] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [testsCompleted, setTestsCompleted] = useState("0/2");
  const [careerMatch, setCareerMatch] = useState("--");
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingAts, setIsLoadingAts] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let userId = null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        userId = parsed.id || parsed._id;
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token || !userId) {
          setIsLoadingDashboard(false);
          return;
        }

        const res = await fetch(`/api/dashboard/intelligence/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (res.ok) {
           setTestsCompleted("2/2");
           if (data.careerRecommendations && data.careerRecommendations.length > 0) {
             const topMatch = data.careerRecommendations[0].confidenceScore || data.careerRecommendations[0].score;
             if (topMatch) setCareerMatch(typeof topMatch === 'number' ? Math.round(topMatch) + "%" : topMatch + "%");
           }
        } else if (res.status === 404 && data.testsCompleted !== undefined) {
           setTestsCompleted(`${data.testsCompleted}/2`);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboardData();

    // Fetch dynamic ATS Score securely across workflow constraint #6
    const fetchAtsData = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setIsLoadingAts(false);
          return;
        }

        const res = await fetch('/api/ats/ats-score', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.atsScore !== undefined) {
            setAtsScore(data.atsScore.toString());
            setAtsFeedback(data.feedback);
          }
        }
      } catch (error) {
        console.error("Error loading latest ATS data:", error);
      } finally {
        setIsLoadingAts(false);
      }
    };

    fetchAtsData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    Cookies.remove('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const stats = [
    {
      title: "Tests Completed",
      subtitle: isLoadingDashboard ? "Loading status..." : testsCompleted === "2/2" 
        ? "All assessments completed!" 
        : testsCompleted === "1/2" 
        ? "Only 1 assessment remaining" 
        : "Ready to start your journey?",
      value: testsCompleted,
      isSkeleton: isLoadingDashboard,
      icon: (
        <Brain className="w-8 h-8 text-blue-400" />
      ),
    },
    {
      title: "Career Match",
      subtitle: isLoadingDashboard ? "Loading match..." : careerMatch !== "--" ? "Top career confidence" : "Pending tests",
      value: careerMatch,
      isSkeleton: isLoadingDashboard,
      icon: (
        <Target className="w-8 h-8 text-purple-400" />
      ),
    },
    {
      title: "ATS Score",
      subtitle: isLoadingAts ? "Loading score..." : atsFeedback?.summary ? "Last result overview" : "Resume optimization",
      value: atsScore,
      isSkeleton: isLoadingAts,
      icon: (
        <FileText className="w-8 h-8 text-pink-400" />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a0b3b] bg-gradient-to-br from-[#1a0b3b] via-[#2d145c] to-[#1a0b3b] text-white p-6 md:p-12 font-sans">
      {/* Header */}
      <header className="mb-10">
        <button
          onClick={() => (window.location.href = "/")}
          className="text-gray-400 text-sm mb-6 flex items-center hover:text-white transition-colors cursor-pointer"
        >
          <span className="mr-2 mb-2 text-lg">←</span> Back to Home
        </button>
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.fullName?.split(' ')[0] || 'Guest'}!</h1>
        <p className="text-gray-400">Track your career development journey</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-start backdrop-blur-sm">
            <div>
              <div className="mb-4">{stat.icon}</div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-xs text-gray-400" title={atsFeedback?.summary}>{stat.subtitle}</p>
            </div>
            {stat.isSkeleton ? (
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse mt-1"></div>
            ) : (
              <span className="text-3xl font-bold">{stat.value}</span>
            )}
          </div>
        ))}
      </div>

      {atsFeedback?.summary && (
        <div className="mb-10 bg-white/5 border border-pink-500/20 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-3 mb-3">
             <FileText className="w-6 h-6 text-pink-400" />
             <h3 className="text-lg font-bold text-pink-100">Latest Resume ATS Feedback</h3>
          </div>
          <p className="text-gray-300 mb-4">{atsFeedback.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atsFeedback.improvements?.length > 0 && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">Areas to Improve:</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {atsFeedback.improvements.slice(0,3).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
            {atsFeedback.keyword_match?.missing?.length > 0 && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-semibold text-red-300 mb-2">Missing Keywords:</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {atsFeedback.keyword_match.missing.slice(0,4).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lower Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/assessments')}
              className="cursor-pointer w-full text-left p-4 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 transition-all text-blue-200"
            >
              Retake Assessments
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer w-full text-left p-4 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 transition-all text-purple-200"
            >
              View Detailed Results
            </button>
            <button 
              onClick={() => navigate('/resume-builder')}
              className="cursor-pointer w-full text-left p-4 rounded-xl bg-pink-600/20 border border-pink-500/30 hover:bg-pink-600/30 transition-all text-pink-200"
            >
              Update Resume
            </button>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="cursor-pointer w-full text-left p-4 rounded-xl bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 transition-all text-red-200 font-semibold"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6">Your Profile</h3>
          <div className="space-y-4 text-gray-300">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Education:</span>
              <div className="text-white mt-1 text-lg font-medium bg-white/5 p-2 rounded w-full border border-white/5">{user?.education || 'Not specified'}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Target Role:</span>
              <div className="text-white mt-1 text-lg font-medium bg-white/5 p-2 rounded w-full border border-white/5">{user?.targetRole || 'Not specified'}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Email:</span>
              <div className="text-white mt-1 text-lg font-medium bg-white/5 p-2 rounded w-full border border-white/5">{user?.email || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#1a0b3b] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
            {/* Modal Decorative Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">Log Out</h3>
            <p className="text-gray-300 mb-8">
              Are you sure you want to log out? You will need to log back in to access your dashboard and resume builder.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg transition-all cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;