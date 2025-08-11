import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import './AIIntelligenceEngine.css';

interface PromptAnalysis {
  category: string;
  confidence: number;
  suggestedCategories: string[];
  sentiment: {
    tone: 'positive' | 'negative' | 'neutral' | 'mixed';
    confidence: number;
    emotional_intensity: number;
  };
  intent: {
    primary: string;
    secondary: string[];
    action_type: 'creative' | 'analytical' | 'instructional' | 'conversational';
  };
  qualityScore: {
    overall: number;
    clarity: number;
    specificity: number;
    completeness: number;
    effectiveness: number;
  };
  suggestions: {
    improvements: string[];
    alternatives: string[];
    enhancements: string[];
  };
}

interface AIIntelligenceEngineProps {
  prompt: string;
  onAnalysisComplete: (analysis: PromptAnalysis) => void;
  autoAnalyze?: boolean;
}

const AIIntelligenceEngine: React.FC<AIIntelligenceEngineProps> = ({
  prompt,
  onAnalysisComplete,
  autoAnalyze = false
}) => {
  const { addToast } = useToast();
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Categories for auto-categorization
  const categories = [
    { id: 'creative', name: 'Creative Writing', keywords: ['write', 'create', 'story', 'poem', 'creative', 'imagine', 'design'] },
    { id: 'analytical', name: 'Analysis & Research', keywords: ['analyze', 'research', 'compare', 'evaluate', 'assess', 'review'] },
    { id: 'technical', name: 'Technical & Programming', keywords: ['code', 'programming', 'debug', 'algorithm', 'technical', 'software'] },
    { id: 'business', name: 'Business & Strategy', keywords: ['business', 'strategy', 'marketing', 'plan', 'revenue', 'growth'] },
    { id: 'educational', name: 'Education & Training', keywords: ['teach', 'explain', 'learn', 'tutorial', 'guide', 'lesson'] },
    { id: 'conversational', name: 'Conversation & Chat', keywords: ['chat', 'talk', 'discuss', 'conversation', 'dialogue'] },
    { id: 'problem-solving', name: 'Problem Solving', keywords: ['solve', 'fix', 'problem', 'solution', 'troubleshoot', 'resolve'] },
    { id: 'content', name: 'Content Creation', keywords: ['content', 'blog', 'article', 'post', 'social media', 'copy'] }
  ];

  // Smart suggestions based on prompt patterns
  const generateSmartSuggestions = (promptText: string): string[] => {
    const suggestions: string[] = [];
    const lowerPrompt = promptText.toLowerCase();

    // Check for common improvement patterns
    if (!lowerPrompt.includes('context') && !lowerPrompt.includes('background')) {
      suggestions.push('Add context or background information to your prompt');
    }

    if (!lowerPrompt.includes('format') && !lowerPrompt.includes('structure')) {
      suggestions.push('Specify the desired output format (list, table, paragraph, etc.)');
    }

    if (promptText.length < 50) {
      suggestions.push('Describe your prompt with more details');
    }

    if (!lowerPrompt.includes('example') && !lowerPrompt.includes('instance')) {
      suggestions.push('Provide examples of the desired output');
    }

    if (!lowerPrompt.includes('tone') && !lowerPrompt.includes('style')) {
      suggestions.push('Specify the desired tone and writing style');
    }

    if (lowerPrompt.includes('?') && !lowerPrompt.includes('please')) {
      suggestions.push('Use polite commands (please, kindly)');
    }

    return suggestions;
  };

  // Auto-categorization algorithm
  const categorizeProblempt = (promptText: string): { category: string; confidence: number; suggested: string[] } => {
    const lowerPrompt = promptText.toLowerCase();
    const scores: { [key: string]: number } = {};

    categories.forEach(category => {
      let score = 0;
      category.keywords.forEach(keyword => {
        if (lowerPrompt.includes(keyword)) {
          score += 1;
        }
      });
      scores[category.id] = score / category.keywords.length;
    });

    const sortedCategories = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .filter(([,score]) => score > 0);

    const primaryCategory = sortedCategories[0] || ['general', 0];
    const suggestedCategories = sortedCategories.slice(0, 3).map(([cat]) => cat);

    return {
      category: primaryCategory[0],
      confidence: primaryCategory[1],
      suggested: suggestedCategories
    };
  };

  // Sentiment analysis
  const analyzeSentiment = (promptText: string) => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate'];
    const neutralWords = ['okay', 'normal', 'standard', 'regular'];

    const lowerPrompt = promptText.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    positiveWords.forEach(word => {
      if (lowerPrompt.includes(word)) positiveScore++;
    });

    negativeWords.forEach(word => {
      if (lowerPrompt.includes(word)) negativeScore++;
    });

    neutralWords.forEach(word => {
      if (lowerPrompt.includes(word)) neutralScore++;
    });

    const totalScore = positiveScore + negativeScore + neutralScore;
    const emotionalIntensity = totalScore / (promptText.split(' ').length / 10);

    let tone: 'positive' | 'negative' | 'neutral' | 'mixed' = 'neutral';
    let confidence = 0.5;

    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      tone = 'positive';
      confidence = Math.min(0.9, 0.5 + (positiveScore / 10));
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      tone = 'negative';
      confidence = Math.min(0.9, 0.5 + (negativeScore / 10));
    } else if (positiveScore > 0 && negativeScore > 0) {
      tone = 'mixed';
      confidence = Math.min(0.8, 0.4 + (totalScore / 20));
    }

    return {
      tone,
      confidence,
      emotional_intensity: Math.min(1, emotionalIntensity)
    };
  };

  // Intent detection
  const detectIntent = (promptText: string) => {
    const lowerPrompt = promptText.toLowerCase();
    const intents = {
      creative: ['create', 'write', 'design', 'imagine', 'generate'],
      analytical: ['analyze', 'compare', 'evaluate', 'assess'],
      instructional: ['explain', 'teach', 'show', 'guide'],
      conversational: ['chat', 'talk', 'discuss', 'conversation']
    };

    const scores: { [key: string]: number } = {};
    Object.entries(intents).forEach(([intent, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        if (lowerPrompt.includes(keyword)) score++;
      });
      scores[intent] = score;
    });

    const sortedIntents = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .filter(([,score]) => score > 0);

    const primaryIntent = sortedIntents[0]?.[0] || 'conversational';
    const secondaryIntents = sortedIntents.slice(1, 3).map(([intent]) => intent);

    let actionType: 'creative' | 'analytical' | 'instructional' | 'conversational' = 'conversational';
    if (scores.creative > 0) actionType = 'creative';
    else if (scores.analytical > 0) actionType = 'analytical';
    else if (scores.instructional > 0) actionType = 'instructional';

    return {
      primary: primaryIntent,
      secondary: secondaryIntents,
      action_type: actionType
    };
  };

  // Quality score calculation
  const calculateQualityScore = (promptText: string) => {
    // Clarity: Check for clear language and structure
    const clarityScore = Math.min(1, (
      (promptText.includes('?') ? 0.2 : 0) +
      (promptText.length > 20 ? 0.3 : 0) +
      (promptText.split('.').length > 1 ? 0.3 : 0) +
      (!/[A-Z]{3,}/.test(promptText) ? 0.2 : 0) // No excessive caps
    ));

    // Specificity: Check for specific details and requirements
    const specificityScore = Math.min(1, (
      (promptText.length > 50 ? 0.3 : 0) +
      (/\b(format|style|tone|length)\b/i.test(promptText) ? 0.3 : 0) +
      (/\b(example|instance|like|such as)\b/i.test(promptText) ? 0.2 : 0) +
      (promptText.split(' ').length > 15 ? 0.2 : 0)
    ));

    // Completeness: Check if prompt has all necessary elements
    const completenessScore = Math.min(1, (
      (promptText.includes('context') || promptText.includes('background') ? 0.25 : 0) +
      (promptText.includes('format') || promptText.includes('output') ? 0.25 : 0) +
      (promptText.includes('tone') || promptText.includes('style') ? 0.25 : 0) +
      (promptText.length > 100 ? 0.25 : 0)
    ));

    // Effectiveness: Based on best practices
    const effectivenessScore = Math.min(1, (
      (promptText.toLowerCase().includes('please') ? 0.2 : 0) +
      (!promptText.includes('!!!') && !promptText.includes('???') ? 0.2 : 0) +
      (promptText.split('\n').length > 1 ? 0.2 : 0) +
      (/\b(step by step|detailed|comprehensive)\b/i.test(promptText) ? 0.2 : 0) +
      (promptText.length >= 30 && promptText.length <= 500 ? 0.2 : 0)
    ));

    const overall = (clarityScore + specificityScore + completenessScore + effectivenessScore) / 4;

    return {
      overall: Math.round(overall * 100) / 100,
      clarity: Math.round(clarityScore * 100) / 100,
      specificity: Math.round(specificityScore * 100) / 100,
      completeness: Math.round(completenessScore * 100) / 100,
      effectiveness: Math.round(effectivenessScore * 100) / 100
    };
  };

  // Main analysis function
  const analyzePrompt = async () => {
    if (!prompt.trim()) {
              addToast('Please enter a prompt first', 'error');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const categorization = categorizeProblempt(prompt);
      const sentiment = analyzeSentiment(prompt);
      const intent = detectIntent(prompt);
      const qualityScore = calculateQualityScore(prompt);
      const suggestions = generateSmartSuggestions(prompt);

      const analysisResult: PromptAnalysis = {
        category: categorization.category,
        confidence: categorization.confidence,
        suggestedCategories: categorization.suggested,
        sentiment,
        intent,
        qualityScore,
        suggestions: {
          improvements: suggestions,
          alternatives: [
            'Try starting your prompt with "You are an expert in..."',
            'Provide more details about your desired output',
            'Specify constraints and specific rules'
          ],
          enhancements: [
            'Add practical examples',
            'Set the desired response length',
            'Specify the target audience',
            'Add context or background'
          ]
        }
      };

      setAnalysis(analysisResult);
      onAnalysisComplete(analysisResult);
              addToast('AI analysis completed successfully', 'success');

    } catch (error) {
      console.error('Analysis error:', error);
      addToast('Failed to analyze prompt', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze when prompt changes
  useEffect(() => {
    if (autoAnalyze && prompt.trim().length > 10) {
      const debounceTimer = setTimeout(() => {
        analyzePrompt();
      }, 1500);

      return () => clearTimeout(debounceTimer);
    }
  }, [prompt, autoAnalyze]);

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'var(--success-color)';
    if (score >= 0.6) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const getSentimentIcon = (tone: string) => {
    switch (tone) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      case 'mixed': return '😐';
      default: return '😶';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      creative: '🎨',
      analytical: '📊',
      technical: '💻',
      business: '💼',
      educational: '🎓',
      conversational: '💬',
      'problem-solving': '🔧',
      content: '📝',
      general: '📄'
    };
    return icons[category] || '📄';
  };

  return (
    <div className="ai-intelligence-engine">
      <div className="ai-header">
        <h3>🧠 AI-Powered Intelligence</h3>
        <button
          onClick={analyzePrompt}
          disabled={isAnalyzing || !prompt.trim()}
          className="analyze-btn"
        >
          {isAnalyzing ? 'Analyzing...' : '🔍 Smart Analysis'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          {/* Auto-Categorization */}
          <div className="analysis-section">
            <h4>📂 Auto-Categorization</h4>
            <div className="categorization-result">
              <div className="primary-category">
                <span className="category-icon">{getCategoryIcon(analysis.category)}</span>
                <span className="category-name">
                  {categories.find(c => c.id === analysis.category)?.name || 'General'}
                </span>
                <span className="confidence-score">
                  ({Math.round(analysis.confidence * 100)}% confidence)
                </span>
              </div>
              {analysis.suggestedCategories.length > 1 && (
                <div className="suggested-categories">
                  <small>Suggested categories: </small>
                  {analysis.suggestedCategories.slice(1).map((cat, index) => (
                    <span key={index} className="suggested-category">
                      {getCategoryIcon(cat)} {categories.find(c => c.id === cat)?.name || cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="analysis-section">
            <h4>💭 Sentiment Analysis</h4>
            <div className="sentiment-result">
              <div className="sentiment-main">
                <span className="sentiment-icon">{getSentimentIcon(analysis.sentiment.tone)}</span>
                <span className="sentiment-tone">{analysis.sentiment.tone === 'positive' ? 'Positive' : 
                  analysis.sentiment.tone === 'negative' ? 'Negative' : 
                  analysis.sentiment.tone === 'mixed' ? 'Mixed' : 'Neutral'}</span>
                <span className="sentiment-confidence">
                  ({Math.round(analysis.sentiment.confidence * 100)}% confidence)
                </span>
              </div>
              <div className="emotional-intensity">
                <small>Emotional intensity: </small>
                <div className="intensity-bar">
                  <div 
                    className="intensity-fill" 
                    style={{ width: `${analysis.sentiment.emotional_intensity * 100}%` }}
                  ></div>
                </div>
                <span>{Math.round(analysis.sentiment.emotional_intensity * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Intent Detection */}
          <div className="analysis-section">
            <h4>🎯 Intent Detection</h4>
            <div className="intent-result">
              <div className="primary-intent">
                <strong>Primary intent: </strong>
                <span className="intent-name">{
                  analysis.intent.primary === 'creative' ? 'Creative' :
                  analysis.intent.primary === 'analytical' ? 'Analytical' :
                  analysis.intent.primary === 'instructional' ? 'Instructional' :
                  'Conversational'
                }</span>
              </div>
              <div className="action-type">
                <strong>Action type: </strong>
                <span className="action-name">{
                  analysis.intent.action_type === 'creative' ? '🎨 Creative' :
                  analysis.intent.action_type === 'analytical' ? '📊 Analytical' :
                  analysis.intent.action_type === 'instructional' ? '📚 Instructional' :
                  '💬 Conversational'
                }</span>
              </div>
              {analysis.intent.secondary.length > 0 && (
                <div className="secondary-intents">
                  <small>Secondary intents: </small>
                  {analysis.intent.secondary.map((intent, index) => (
                    <span key={index} className="secondary-intent">{intent}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quality Score */}
          <div className="analysis-section">
            <h4>⭐ Quality Score</h4>
            <div className="quality-scores">
              <div className="overall-score">
                <div className="score-circle">
                  <span 
                    className="score-value" 
                    style={{ color: getScoreColor(analysis.qualityScore.overall) }}
                  >
                    {Math.round(analysis.qualityScore.overall * 100)}
                  </span>
                  <small>Overall</small>
                </div>
              </div>
              <div className="detailed-scores">
                {Object.entries(analysis.qualityScore).filter(([key]) => key !== 'overall').map(([key, score]) => (
                  <div key={key} className="score-item">
                    <span className="score-label">{
                      key === 'clarity' ? 'Clarity' :
                      key === 'specificity' ? 'Specificity' :
                      key === 'completeness' ? 'Completeness' :
                      'Effectiveness'
                    }</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ 
                          width: `${score * 100}%`,
                          backgroundColor: getScoreColor(score)
                        }}
                      ></div>
                    </div>
                    <span className="score-number">{Math.round(score * 100)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          {showSuggestions && (
            <div className="analysis-section">
              <h4>
                💡 Smart Suggestions
                <button 
                  className="toggle-suggestions"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  {showSuggestions ? '▼' : '▶'}
                </button>
              </h4>
              <div className="suggestions-container">
                {analysis.suggestions.improvements.length > 0 && (
                  <div className="suggestion-group">
                    <h5>🔧 Suggested Improvements</h5>
                    <ul>
                      {analysis.suggestions.improvements.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="suggestion-group">
                  <h5>🔄 Alternative Options</h5>
                  <ul>
                    {analysis.suggestions.alternatives.map((alternative, index) => (
                      <li key={index}>{alternative}</li>
                    ))}
                  </ul>
                </div>

                <div className="suggestion-group">
                  <h5>⚡ Enhancements</h5>
                  <ul>
                    {analysis.suggestions.enhancements.map((enhancement, index) => (
                      <li key={index}>{enhancement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isAnalyzing && (
        <div className="analyzing-spinner">
          <div className="spinner"></div>
          <p>Analyzing your prompt intelligently...</p>
        </div>
      )}
    </div>
  );
};

export default AIIntelligenceEngine;