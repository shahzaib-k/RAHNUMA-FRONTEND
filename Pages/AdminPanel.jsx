import React, { useState, useEffect } from 'react';
import { Loader, Edit2, Trash2, Plus, X, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import Cookies from 'js-cookie';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('aptitude'); // 'aptitude' or 'personality'
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  // Generic form state (we'll adapt based on tab)
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, [activeTab]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('token');
      const endpoint = activeTab === 'aptitude' 
        ? '/api/cognitive-test/admin/questions' 
        : '/api/personality/admin/questions';
        
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch questions');
      const data = await res.json();
      const normalizedData = data.map(q => ({...q, isActive: q.isActive === false ? false : true}));
      setQuestions(normalizedData);
      setOriginalQuestions(JSON.parse(JSON.stringify(normalizedData)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const token = Cookies.get('token');
      const endpoint = activeTab === 'aptitude' 
        ? `/api/cognitive-test/admin/questions/${id}` 
        : `/api/personality/admin/questions/${id}`;
        
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setQuestions(questions.filter(q => (q._id || q.id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleActive = (q) => {
    const id = q._id || q.id;
    setQuestions(questions.map(item => {
      if ((item._id || item.id) === id) {
        return { ...item, isActive: item.isActive === false ? true : false };
      }
      return item;
    }));
  };

  const hasUnsavedChanges = JSON.stringify(questions) !== JSON.stringify(originalQuestions);
  const activeCount = questions.filter(q => q.isActive === true).length;

  const handleSaveChanges = async () => {
    if (activeCount !== 20) {
      alert(`${activeTab === 'aptitude' ? 'Aptitude' : 'Personality'} test requires exactly 20 active questions! Currently active: ${activeCount}`);
      return;
    }

    const modified = questions.filter((q) => {
      const orig = originalQuestions.find(o => (o._id || o.id) === (q._id || q.id));
      return orig && orig.isActive !== q.isActive;
    });

    try {
      const token = Cookies.get('token');
      await Promise.all(modified.map(q => {
        const id = q._id || q.id;
        const endpoint = activeTab === 'aptitude' 
          ? `/api/cognitive-test/admin/questions/${id}` 
          : `/api/personality/admin/questions/${id}`;
        
        return fetch(endpoint, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ isActive: q.isActive })
        });
      }));

      await fetchQuestions();
    } catch (err) {
      alert('Failed to save changes.');
    }
  };

  const openModal = (question = null) => {
    setEditingQuestion(question);
    if (question) {
      setFormData(question);
    } else {
      setFormData(activeTab === 'aptitude' ? 
        { type: 'logical', question: '', options: ['', '', '', ''], answer: '' } : 
        { question: '', trait: 'openness', reverse: false }
      );
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const id = editingQuestion?._id || editingQuestion?.id;
      const isEdit = !!editingQuestion;
      
      const endpoint = activeTab === 'aptitude' 
        ? (isEdit ? `/api/cognitive-test/admin/questions/${id}` : '/api/cognitive-test/admin/questions')
        : (isEdit ? `/api/personality/admin/questions/${id}` : '/api/personality/admin/questions');
        
      const res = await fetch(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to save question');
      await fetchQuestions();
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  const renderAptitudeForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">Question Type</label>
        <select 
          className="w-full p-2 bg-[#2d145c] text-white rounded border border-purple-500 focus:outline-none"
          value={formData.type || 'logical'} 
          onChange={e => setFormData({...formData, type: e.target.value})}
        >
          <option value="logical">Logical</option>
          <option value="verbal">Verbal</option>
          <option value="quantitative">Quantitative</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">Question Text</label>
        <textarea 
          className="w-full p-2 bg-[#2d145c] text-white rounded border border-purple-500 focus:outline-none"
          value={formData.question || ''} 
          onChange={e => setFormData({...formData, question: e.target.value})}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">Options</label>
        {formData.options?.map((opt, i) => (
          <input 
            key={i}
            type="text"
            className="w-full p-2 mb-2 bg-[#2d145c] text-white rounded border border-purple-500 focus:outline-none"
            placeholder={`Option ${i + 1}`}
            value={opt || ''}
            onChange={e => {
              const newOpts = [...formData.options];
              newOpts[i] = e.target.value;
              setFormData({...formData, options: newOpts});
            }}
            required
          />
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">Correct Answer (Must exactly match an option)</label>
        <input 
          type="text"
          className="w-full p-2 bg-[#2d145c] text-white rounded border border-purple-500 focus:outline-none"
          value={formData.answer || ''} 
          onChange={e => setFormData({...formData, answer: e.target.value})}
          required
        />
      </div>
    </>
  );

  const renderPersonalityForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">Trait</label>
        <select 
          className="w-full p-2 bg-[#2d145c] text-white rounded border border-purple-500 focus:outline-none"
          value={formData.trait || 'openness'} 
          onChange={e => setFormData({...formData, trait: e.target.value})}
        >
          <option value="openness">Openness</option>
          <option value="conscientiousness">Conscientiousness</option>
          <option value="extraversion">Extraversion</option>
          <option value="agreeableness">Agreeableness</option>
          <option value="neuroticism">Neuroticism</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">Question Text</label>
        <textarea 
          className="w-full p-2 bg-[#2d145c] text-white rounded border border-purple-500 focus:outline-none"
          value={formData.question || ''} 
          onChange={e => setFormData({...formData, question: e.target.value})}
          required
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center text-gray-300 text-sm font-bold">
          <input 
            type="checkbox"
            className="mr-2"
            checked={formData.reverse || false}
            onChange={e => setFormData({...formData, reverse: e.target.checked})}
          />
          Is Reverse Scored?
        </label>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#1a0b3b] bg-gradient-to-br from-[#1a0b3b] via-[#2d145c] to-[#1a0b3b] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel - Question Banks</h1>
          <div className="flex items-center gap-4">
            <span className={`text-sm font-bold ${activeCount === 20 ? 'text-green-400' : 'text-yellow-400'}`}>
              Active: {activeCount}/20
            </span>
            {hasUnsavedChanges && (
              <button 
                onClick={handleSaveChanges}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                title={activeCount !== 20 ? "You must have exactly 20 active questions to save." : "Save changes"}
              >
                Save Changes
              </button>
            )}
            <button 
              onClick={() => openModal()}
              disabled={hasUnsavedChanges}
              className={`flex items-center text-white font-bold py-2 px-4 rounded transition-colors ${hasUnsavedChanges ? 'bg-purple-600/50 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              title={hasUnsavedChanges ? "Save or discard changes before adding" : ""}
            >
              <Plus className="w-5 h-5 mr-2" /> Add Question
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-[#2d145c]/50 rounded-lg p-1 backdrop-blur-sm w-fit">
          <button
            onClick={() => setActiveTab('aptitude')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'aptitude' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Aptitude Questions
          </button>
          <button
            onClick={() => setActiveTab('personality')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'personality' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Personality Questions
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-purple-400 animate-spin" /></div>
        ) : error ? (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="bg-[#2d145c]/30 rounded-xl border border-purple-500/30 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-900/50 text-purple-200">
                  <th className="p-4 border-b border-purple-500/30">Question</th>
                  <th className="p-4 border-b border-purple-500/30 w-32">Type / Trait</th>
                  <th className="p-4 border-b border-purple-500/30 w-24">Status</th>
                  <th className="p-4 border-b border-purple-500/30 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q._id || q.id} className="text-gray-300 border-b border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                    <td className="p-4">{q.question}</td>
                    <td className="p-4 capitalize">
                      <span className="px-2 py-1 bg-purple-500/20 rounded-md text-xs text-purple-300">
                        {activeTab === 'aptitude' ? q.type : q.trait}
                      </span>
                    </td>
                    <td className="p-4">
                      {q.isActive === false ? (
                        <span className="px-2 py-1 bg-gray-500/20 rounded-md text-xs text-gray-400 border border-gray-500/30 flex items-center justify-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500/20 rounded-md text-xs text-green-400 border border-green-500/30 flex items-center justify-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-3 items-center">
                        <button onClick={() => toggleActive(q)} className="text-gray-400 hover:text-white transition-colors" title={q.isActive === false ? "Activate Question" : "Deactivate Question"}>
                          {q.isActive === false ? <ToggleLeft className="w-6 h-6 text-gray-500" /> : <ToggleRight className="w-6 h-6 text-green-400" />}
                        </button>
                        <button onClick={() => openModal(q)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit Question">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(q._id || q.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete Question">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">No questions found in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a0b3b] border border-purple-600 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-purple-600/50">
              <h2 className="text-2xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Add Question'} 
                <span className="text-purple-400 text-sm ml-2">({activeTab === 'aptitude' ? 'Aptitude' : 'Personality'})</span>
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'aptitude' ? renderAptitudeForm() : renderPersonalityForm()}
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-purple-600/50 space-x-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 border border-purple-500 text-purple-300 hover:bg-purple-500/10 rounded transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded shadow-lg shadow-purple-600/20 transition-all"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
