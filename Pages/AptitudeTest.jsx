import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AptitudeTest = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/cognitive-test/questions")
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch questions:", err);
        setIsLoading(false);
      });
  }, []);

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    const currentQ = questions[currentIndex];
    const existingIndex = newAnswers.findIndex(a => a.id === currentQ.id);

    if (existingIndex >= 0) {
      newAnswers[existingIndex].answer = option;
    } else {
      newAnswers.push({ id: currentQ.id, answer: option });
    }
    setAnswers(newAnswers);
  };

  const currentAnswer = answers.find(a => a.id === questions[currentIndex]?.id)?.answer;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      let userId = "guest_unknown";
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          userId = u.id || u._id || null;
        } catch (e) { }
      }
      if (!userId || userId === "guest_unknown") {
        userId = localStorage.getItem('guestId');
        if (!userId) {
          userId = "guest_" + Math.random().toString(36).substring(7);
          localStorage.setItem('guestId', userId);
        }
      }

      const res = await fetch("http://localhost:5000/api/cognitive-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers })
      });
      const data = await res.json();
      setScoreData(data);
    } catch (err) {
      console.error("Failed to submit test:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] flex items-center justify-center text-white font-sans">
        <p className="text-xl">Loading questions...</p>
      </div>
    );
  }

  if (scoreData) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="bg-[#ffffff0a] border border-[#ffffff15] backdrop-blur-lg rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-6">Test Completed!</h1>
          <p className="text-xl mb-8 text-gray-300">
            You scored <span className="text-[#6366f1] font-bold text-4xl mx-2">{scoreData.score}</span> out of {scoreData.total}
          </p>
          <button
            onClick={() => navigate('/assessments')}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-[#6366f1] hover:opacity-90 transition-all shadow-lg active:scale-95"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#1a0b2e] bg-gradient-to-br from-[#1a0b2e] via-[#2d0b5a] to-[#0f051d] flex flex-col items-center p-6 md:p-12 font-sans text-white">
      <div className="w-full max-w-3xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/assessments")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="mr-2 mb-2 text-lg">←</span> Back to Assessments
          </button>
        </div>

        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Aptitude Test</h1>
          <div className="text-gray-300 font-medium bg-[#ffffff10] px-4 py-2 rounded-full border border-[#ffffff1a] text-sm">
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        {currentQ && (
          <div className="bg-[#ffffff0a] border border-[#ffffff15] backdrop-blur-lg rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed">{currentQ.question}</h2>

            <div className="space-y-4">
              {currentQ.options.map((option, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`p-4 md:p-5 rounded-xl border cursor-pointer transition-all ${currentAnswer === option ? 'bg-[#6366f1] border-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20' : 'bg-[#ffffff05] border-[#ffffff1a] hover:bg-[#ffffff10] text-gray-300'}`}
                >
                  <span className="font-medium text-lg">{option}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed bg-[#ffffff10] text-gray-500' : 'bg-[#ffffff15] hover:bg-[#ffffff25] text-white'}`}
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={` flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${!currentAnswer ? 'opacity-50 cursor-not-allowed bg-[#ffffff10] text-gray-500' : 'bg-[#6366f1] hover:opacity-90 active:scale-95 text-white'}`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answers.length < questions.length && questions.length > 0}
                  className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${answers.length < questions.length && questions.length > 0 ? 'opacity-50 cursor-not-allowed bg-[#ffffff10] text-gray-500' : 'bg-[#10b981] hover:bg-[#059669] text-white active:scale-95'}`}
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeTest;
