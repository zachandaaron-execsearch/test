'use client';

import { useState, useEffect } from 'react';

type WorkflowStep = 'start' | 'discovery' | 'handoff' | 'creation' | 'review';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const DISCOVERY_URL = 'https://claude.ai/project/019bfc23-8d94-7506-8f9a-b56269573c49';
const NEWSLETTER_URL = 'https://claude.ai/project/01993dc0-7bf0-724a-9437-815a61c7ac69';

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
  const [briefContent, setBriefContent] = useState('');
  const [finalDraft, setFinalDraft] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('power-newsletter-workflow');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentStep(data.currentStep || 'start');
        setSourceType(data.sourceType || '');
        setBriefContent(data.briefContent || '');
        setFinalDraft(data.finalDraft || '');
        setChecklist(data.checklist || initialChecklist);
      } catch (e) {
        console.error('Failed to load saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('power-newsletter-workflow', JSON.stringify({
        currentStep,
        sourceType,
        briefContent,
        finalDraft,
        checklist,
      }));
    }
  }, [currentStep, sourceType, briefContent, finalDraft, checklist, isLoaded]);

  const resetWorkflow = () => {
    if (confirm('Start a new newsletter? This will clear all saved progress.')) {
      setCurrentStep('start');
      setSourceType('');
      setBriefContent('');
      setFinalDraft('');
      setChecklist(initialChecklist);
      setCopySuccess(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(briefContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const allChecked = checklist.every(item => item.checked);

  const steps: { key: WorkflowStep; label: string; number: number }[] = [
    { key: 'start', label: 'Start', number: 1 },
    { key: 'discovery', label: 'Discovery', number: 2 },
    { key: 'handoff', label: 'Handoff', number: 3 },
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                    currentStep === step.key
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : index < currentStepIndex
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Step 1: Start */}
        {currentStep === 'start' && (
          <div className="space-y-6">
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
              onClick={() => setCurrentStep('discovery')}
              disabled={!sourceType}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
            >
              Continue to Discovery
            </button>
          </div>
        )}

        {/* Step 2: Discovery */}
        {currentStep === 'discovery' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Step 1: Topic Discovery</h2>
              <p className="text-gray-400">
                Work with the Discovery Agent to develop your angle and create a narrative brief.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">?</span>
                Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-2">
                <li>Click the button below to open the Discovery Project</li>
                <li>Tell the agent you&apos;re working with: <span className="text-blue-400 font-medium">{sourceType || 'your source'}</span></li>
                <li>Answer the discovery questions (5-10 questions)</li>
                <li>When ready, confirm to receive the Narrative Brief</li>
                <li>Copy the entire brief output</li>
              </ol>
            </div>

            <a
              href={DISCOVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-purple-600/20"
            >
              Open Discovery Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('start')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('handoff')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
              >
                I have the brief
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Handoff */}
        {currentStep === 'handoff' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Save Your Brief</h2>
              <p className="text-gray-400">
                Paste the Narrative Brief from the Discovery Agent. This saves your progress.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Narrative Brief
              </label>
              <textarea
                value={briefContent}
                onChange={(e) => setBriefContent(e.target.value)}
                placeholder="Paste the full Narrative Brief here..."
                className="w-full h-72 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  {briefContent.length > 0 && `${briefContent.length.toLocaleString()} characters`}
                </div>
                {briefContent.length > 100 && (
                  <div className="text-sm text-green-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Auto-saved
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('discovery')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('creation')}
                disabled={!briefContent.trim()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
              >
                Continue to Creation
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Creation */}
        {currentStep === 'creation' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Step 2: Newsletter Creation</h2>
              <p className="text-gray-400">
                Use the Newsletter Agent to write your draft based on the brief.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">?</span>
                Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-2">
                <li>Click the button below to open the Newsletter Project</li>
                <li>Paste your Narrative Brief (use the copy button below)</li>
                <li>Upload any supporting files (transcripts, data exports)</li>
                <li>Review the draft and request revisions as needed</li>
                <li>Copy the final draft when satisfied</li>
              </ol>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Your Narrative Brief
                </label>
                <button
                  onClick={copyToClipboard}
                  className={`text-sm px-3 py-1 rounded-md transition-all ${
                    copySuccess
                      ? 'bg-green-600/20 text-green-400'
                      : 'text-blue-400 hover:text-blue-300 hover:bg-blue-600/10'
                  }`}
                >
                  {copySuccess ? '✓ Copied!' : 'Copy to clipboard'}
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 max-h-48 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {briefContent || 'No brief saved'}
                </pre>
              </div>
            </div>

            <a
              href={NEWSLETTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-purple-600/20"
            >
              Open Newsletter Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('handoff')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('review')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-600/20"
              >
                I have the draft
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Final Review</h2>
              <p className="text-gray-400">
                Complete the checklist before publishing.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Final Draft <span className="text-gray-500">(optional - for your records)</span>
              </label>
              <textarea
                value={finalDraft}
                onChange={(e) => setFinalDraft(e.target.value)}
                placeholder="Paste the final newsletter draft here..."
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
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
                    {checklist.filter(i => !i.checked).length} item{checklist.filter(i => !i.checked).length !== 1 ? 's' : ''} remaining before publish
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
      <div className="border-t border-gray-800 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
          Power Newsletter Workflow
        </div>
      </div>
    </div>
  );
}
