'use client';

import { useState, useEffect, useRef } from 'react';

type WorkflowStep = 'start' | 'discovery' | 'brief' | 'creation' | 'review';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const initialChecklist: ChecklistItem[] = [
  { id: 'clinical', label: 'All clinical claims fact-checked', checked: false },
  { id: 'language', label: 'No absolutist language (never, always, revolutionary)', checked: false },
  { id: 'scientific', label: 'Scientific language used (showed vs proved)', checked: false },
  { id: 'wordcount', label: 'Under 800 words', checked: false },
  { id: 'limitations', label: 'Limitations acknowledged', checked: false },
  { id: 'links', label: 'Related past newsletters linked', checked: false },
  { id: 'hook', label: 'Strong opening hook', checked: false },
  { id: 'forward', label: 'Would a clinical ops director forward this?', checked: false },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('start');
  const [sourceType, setSourceType] = useState('');
  const [discoveryMessages, setDiscoveryMessages] = useState<Message[]>([]);
  const [creationMessages, setCreationMessages] = useState<Message[]>([]);
  const [briefContent, setBriefContent] = useState('');
  const [finalDraft, setFinalDraft] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('power-newsletter-v2');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentStep(data.currentStep || 'start');
        setSourceType(data.sourceType || '');
        setDiscoveryMessages(data.discoveryMessages || []);
        setCreationMessages(data.creationMessages || []);
        setBriefContent(data.briefContent || '');
        setFinalDraft(data.finalDraft || '');
        setChecklist(data.checklist || initialChecklist);
      } catch (e) {
        console.error('Failed to load saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('power-newsletter-v2', JSON.stringify({
        currentStep,
        sourceType,
        discoveryMessages,
        creationMessages,
        briefContent,
        finalDraft,
        checklist,
      }));
    }
  }, [currentStep, sourceType, discoveryMessages, creationMessages, briefContent, finalDraft, checklist, isLoaded]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [discoveryMessages, creationMessages]);

  const resetWorkflow = () => {
    if (confirm('Start a new newsletter? This will clear all saved progress.')) {
      setCurrentStep('start');
      setSourceType('');
      setDiscoveryMessages([]);
      setCreationMessages([]);
      setBriefContent('');
      setFinalDraft('');
      setChecklist(initialChecklist);
      setInputValue('');
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const sendMessage = async (mode: 'discovery' | 'creation') => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const currentMessages = mode === 'discovery' ? discoveryMessages : creationMessages;
    const setMessages = mode === 'discovery' ? setDiscoveryMessages : setCreationMessages;

    const newMessages = [...currentMessages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mode,
          sourceType: mode === 'discovery' ? sourceType : undefined,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages([...newMessages, assistantMessage]);

      // Auto-extract brief if it looks like one was generated
      if (mode === 'discovery' && data.response.includes('NEWSLETTER BRIEF:')) {
        const briefMatch = data.response.match(/\*\*NEWSLETTER BRIEF:[\s\S]*/);
        if (briefMatch) {
          setBriefContent(briefMatch[0]);
        }
      }

      // Auto-extract newsletter draft
      if (mode === 'creation' && data.response.length > 500) {
        setFinalDraft(data.response);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error connecting to the AI. Please try again.'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startDiscovery = () => {
    setCurrentStep('discovery');
    if (discoveryMessages.length === 0) {
      // Send initial context message
      const sourceLabels: Record<string, string> = {
        podcast: 'a podcast transcript',
        data: 'internal data/analytics',
        customer: 'customer insights',
        brainstorm: 'a brainstorm or concept',
        news: 'industry news',
      };
      const initialMessage: Message = {
        role: 'assistant',
        content: `Great, you're working with ${sourceLabels[sourceType] || 'source material'}. Let's develop this into a compelling newsletter topic.\n\nTo get started: What's the core subject or finding you want to explore? Give me a brief overview of what you're working with.`
      };
      setDiscoveryMessages([initialMessage]);
    }
  };

  const startCreation = () => {
    setCurrentStep('creation');
    if (creationMessages.length === 0 && briefContent) {
      // Initialize with the brief
      const initialMessage: Message = {
        role: 'assistant',
        content: `I've received the narrative brief. I'll write a newsletter draft based on this guidance.\n\nBefore I begin, do you have any additional context, transcript excerpts, or specific data points you'd like me to incorporate? Or should I proceed with drafting based on the brief?`
      };
      setCreationMessages([initialMessage]);
    }
  };

  const allChecked = checklist.every(item => item.checked);

  const steps: { key: WorkflowStep; label: string; number: number }[] = [
    { key: 'start', label: 'Start', number: 1 },
    { key: 'discovery', label: 'Discovery', number: 2 },
    { key: 'brief', label: 'Brief', number: 3 },
    { key: 'creation', label: 'Creation', number: 4 },
    { key: 'review', label: 'Review', number: 5 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
              P
            </div>
            <h1 className="text-xl font-semibold">Power Newsletter</h1>
          </div>
          <button
            onClick={resetWorkflow}
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-gray-800"
          >
            Start New
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => {
                    if (step.key === 'discovery' && sourceType) startDiscovery();
                    else if (step.key === 'creation' && briefContent) startCreation();
                    else setCurrentStep(step.key);
                  }}
                  disabled={
                    (step.key === 'discovery' && !sourceType) ||
                    (step.key === 'brief' && discoveryMessages.length === 0) ||
                    (step.key === 'creation' && !briefContent) ||
                    (step.key === 'review' && !finalDraft)
                  }
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                    currentStep === step.key
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : index < currentStepIndex
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-sm font-medium">
                    {index < currentStepIndex ? '✓' : step.number}
                  </span>
                  <span className="hidden sm:inline text-sm">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 lg:w-12 h-0.5 mx-1 lg:mx-2 ${
                    index < currentStepIndex ? 'bg-green-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-6 py-6">

        {/* Step 1: Start */}
        {currentStep === 'start' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold mb-2">What are you working with?</h2>
              <p className="text-gray-400">Select your source material type to get started.</p>
            </div>

            <div className="grid gap-3">
              {[
                { value: 'podcast', label: 'Podcast Transcript', desc: 'Episode transcript to summarize', icon: '🎙️' },
                { value: 'data', label: 'Internal Data/Analytics', desc: 'Conversion rates, enrollment patterns, etc.', icon: '📊' },
                { value: 'customer', label: 'Customer Insights', desc: 'Observations from customer conversations', icon: '💬' },
                { value: 'brainstorm', label: 'Brainstorm/Concept', desc: 'An idea or framework to explore', icon: '💡' },
                { value: 'news', label: 'Industry News', desc: 'Competitive developments or news', icon: '📰' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSourceType(option.value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    sourceType === option.value
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={startDiscovery}
              disabled={!sourceType}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
            >
              Continue to Discovery
            </button>
          </div>
        )}

        {/* Step 2: Discovery Chat */}
        {currentStep === 'discovery' && (
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Topic Discovery</h2>
              <p className="text-gray-400 text-sm">Chat with the Discovery Agent to develop your newsletter angle.</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-900 rounded-xl border border-gray-700 mb-4 p-4 space-y-4 min-h-[400px] max-h-[500px]">
              {discoveryMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage('discovery')}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage('discovery')}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-medium transition-colors"
              >
                Send
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCurrentStep('start')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('brief')}
                disabled={discoveryMessages.length < 4}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-medium transition-colors"
              >
                Review Brief
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Brief Review */}
        {currentStep === 'brief' && (
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review & Edit Brief</h2>
              <p className="text-gray-400">Review the narrative brief before sending to the Newsletter Agent.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Narrative Brief
              </label>
              <textarea
                value={briefContent}
                onChange={(e) => setBriefContent(e.target.value)}
                placeholder="The narrative brief will appear here after your discovery conversation. You can also paste or write your own."
                className="w-full h-80 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {briefContent.length > 0 && `${briefContent.length.toLocaleString()} characters`}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('discovery')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back to Discovery
              </button>
              <button
                onClick={startCreation}
                disabled={!briefContent.trim()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
              >
                Continue to Creation
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Creation Chat */}
        {currentStep === 'creation' && (
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Newsletter Creation</h2>
              <p className="text-gray-400 text-sm">Work with the Newsletter Agent to write your draft.</p>
            </div>

            {/* Brief Preview */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 mb-4">
              <div className="text-xs text-gray-500 mb-1">Brief Summary</div>
              <div className="text-sm text-gray-300 line-clamp-2">{briefContent.slice(0, 200)}...</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-900 rounded-xl border border-gray-700 mb-4 p-4 space-y-4 min-h-[350px] max-h-[450px]">
              {creationMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage('creation')}
                placeholder="Type your message or paste additional context..."
                disabled={isLoading}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage('creation')}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-medium transition-colors"
              >
                Send
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setInputValue(`Please write the newsletter draft based on this brief:\n\n${briefContent}`);
                }}
                className="text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
              >
                Send Brief to Agent
              </button>
              <button
                onClick={() => setInputValue('Please revise to be more concise and under 800 words.')}
                className="text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300"
              >
                Request Revision
              </button>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCurrentStep('brief')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('review')}
                disabled={!finalDraft && creationMessages.length < 2}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-medium transition-colors"
              >
                Review & Finish
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            <div>
              <h2 className="text-2xl font-bold mb-2">Final Review</h2>
              <p className="text-gray-400">Complete the checklist and copy your final draft.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Final Newsletter Draft
              </label>
              <textarea
                value={finalDraft}
                onChange={(e) => setFinalDraft(e.target.value)}
                placeholder="Your newsletter draft will appear here..."
                className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {finalDraft.split(/\s+/).filter(Boolean).length} words
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(finalDraft)}
                  className="text-sm text-blue-400 hover:text-blue-300 px-3 py-1 rounded-md hover:bg-blue-600/10"
                >
                  Copy to clipboard
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">✓</span>
                Pre-Publish Checklist
              </h3>
              <div className="space-y-3">
                {checklist.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        item.checked
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-600 group-hover:border-gray-500'
                      }`}>
                        {item.checked && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`transition-colors ${item.checked ? 'text-gray-500 line-through' : 'text-gray-200 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              allChecked
                ? 'bg-green-600/20 border border-green-600/50'
                : 'bg-yellow-600/20 border border-yellow-600/50'
            }`}>
              {allChecked ? (
                <>
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-green-400 font-medium">All checks passed. Ready to publish!</p>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center font-bold">
                    {checklist.filter(i => !i.checked).length}
                  </div>
                  <p className="text-yellow-400 font-medium">
                    {checklist.filter(i => !i.checked).length} item{checklist.filter(i => !i.checked).length !== 1 ? 's' : ''} remaining
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('creation')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={resetWorkflow}
                disabled={!allChecked}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-green-600/20"
              >
                Complete & Start New
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          Power Newsletter Workflow
        </div>
      </div>
    </div>
  );
}
