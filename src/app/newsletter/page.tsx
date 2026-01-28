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

export default function NewsletterWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('start');
  const [sourceType, setSourceType] = useState('');
  const [briefContent, setBriefContent] = useState('');
  const [finalDraft, setFinalDraft] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('newsletter-workflow');
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

  // Save state to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('newsletter-workflow', JSON.stringify({
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
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
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
          <h1 className="text-xl font-semibold">Newsletter Workflow</h1>
          <button
            onClick={resetWorkflow}
            className="text-sm text-gray-400 hover:text-white transition-colors"
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
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                    currentStep === step.key
                      ? 'bg-blue-600 text-white'
                      : index < currentStepIndex
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-sm">
                    {index < currentStepIndex ? '✓' : step.number}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
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
                { value: 'podcast', label: 'Podcast Transcript', desc: 'Episode transcript to summarize' },
                { value: 'data', label: 'Internal Data/Analytics', desc: 'Conversion rates, enrollment patterns, etc.' },
                { value: 'customer', label: 'Customer Insights', desc: 'Observations from customer conversations' },
                { value: 'brainstorm', label: 'Brainstorm/Concept', desc: 'An idea or framework to explore' },
                { value: 'news', label: 'Industry News', desc: 'Competitive developments or news' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setSourceType(option.value)}
                  className={`text-left p-4 rounded-lg border transition-colors ${
                    sourceType === option.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-400">{option.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentStep('discovery')}
              disabled={!sourceType}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
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

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Click the button below to open the Discovery Project</li>
                <li>Tell the agent you're working with: <span className="text-blue-400 font-medium">{sourceType || 'your source'}</span></li>
                <li>Answer the discovery questions (5-10 questions)</li>
                <li>When ready, confirm to receive the Narrative Brief</li>
                <li>Copy the entire brief output</li>
              </ol>
            </div>

            <a
              href={DISCOVERY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-center transition-colors"
            >
              Open Discovery Project →
            </a>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('start')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('handoff')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
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
                className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {briefContent.length} characters
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('discovery')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('creation')}
                disabled={!briefContent.trim()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
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

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Click the button below to open the Newsletter Project</li>
                <li>Paste your Narrative Brief (copied below for convenience)</li>
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
                  onClick={() => navigator.clipboard.writeText(briefContent)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {briefContent || 'No brief saved'}
                </pre>
              </div>
            </div>

            <a
              href={NEWSLETTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-center transition-colors"
            >
              Open Newsletter Project →
            </a>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('handoff')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('review')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
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
                Final Draft (optional - for your records)
              </label>
              <textarea
                value={finalDraft}
                onChange={(e) => setFinalDraft(e.target.value)}
                placeholder="Paste the final newsletter draft here..."
                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
              />
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Pre-Publish Checklist</h3>
              <div className="space-y-3">
                {checklist.map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <span className={`${item.checked ? 'text-gray-500 line-through' : 'text-gray-200'} group-hover:text-white transition-colors`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${allChecked ? 'bg-green-600/20 border border-green-600' : 'bg-yellow-600/20 border border-yellow-600'}`}>
              {allChecked ? (
                <p className="text-green-400 font-medium">All checks passed. Ready to publish.</p>
              ) : (
                <p className="text-yellow-400 font-medium">
                  {checklist.filter(i => !i.checked).length} items remaining before publish.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('creation')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={resetWorkflow}
                disabled={!allChecked}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
              >
                Complete & Start New
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
