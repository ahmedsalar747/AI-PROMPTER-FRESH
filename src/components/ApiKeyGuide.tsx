import React, { useState } from 'react';
import './ApiKeyGuide.css';

interface ApiKeyGuideProps {
  onClose: () => void;
}

const ApiKeyGuide: React.FC<ApiKeyGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  // const { addToast } = useToast(); // Currently unused

  const steps = [
    {
      title: '🚀 Create OpenAI Account',
      content: (
        <div className="step-content">
          <p>First, visit the OpenAI website and create an account:</p>
          <ol>
            <li>Go to <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer">platform.openai.com</a></li>
            <li>Click the &quot;Sign up&quot; button</li>
            <li>Enter your information and verify your account</li>
          </ol>
        </div>
      )
    },
    {
      title: '💳 Add Credits to Your Wallet',
      content: (
        <div className="step-content">
          <p>You need credits to use the API:</p>
          <ol>
            <li>In the OpenAI panel, go to &quot;Billing&quot; section</li>
            <li>Click &quot;Add payment method&quot;</li>
            <li>Add your credit card</li>
            <li>Add some credits (minimum $5)</li>
          </ol>
          <div className="info-box">
            <p><strong>💡 Note:</strong> GPT-3.5 usage costs around $0.002 per 1000 words</p>
          </div>
        </div>
      )
    },
    {
      title: '🔑 Generate API Key',
      content: (
        <div className="step-content">
          <p>Now create your API key:</p>
          <ol>
            <li>In the OpenAI panel, go to &quot;API Keys&quot; section</li>
            <li>Click &quot;Create new secret key&quot;</li>
            <li>Give it a name (e.g., &quot;PromptCraft&quot;)</li>
            <li>Copy the generated key immediately</li>
          </ol>
          <div className="warning-box">
            <p><strong>⚠️ Important:</strong> Copy the key immediately! You won&apos;t be able to see it again.</p>
          </div>
        </div>
      )
    },
    {
      title: '📱 Add Key to App',
      content: (
        <div className="step-content">
          <p>Finally, add the key to your app:</p>
          <ol>
            <li>Go to Settings in this app</li>
            <li>Find the &quot;API Key&quot; section</li>
            <li>Paste your OpenAI API key</li>
            <li>Click &quot;Save&quot;</li>
          </ol>
          <div className="success-box">
            <p><strong>✅ Done!</strong> You can now use all AI features in the app.</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="api-key-guide-overlay">
      <div className="api-key-guide">
        <div className="guide-header">
          <h2>📚 OpenAI API Setup Guide</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="steps-indicator">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`step-indicator ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="step-content-container">
          <h3>{steps[currentStep - 1].title}</h3>
          {steps[currentStep - 1].content}
        </div>

        <div className="guide-footer">
          <button 
            className="prev-button" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            ← Previous
          </button>
          
          <span className="step-counter">{currentStep} of {steps.length}</span>
          
          {currentStep < steps.length ? (
            <button 
              className="next-button" 
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            >
              Next →
            </button>
          ) : (
            <button className="finish-button" onClick={onClose}>
              Done! ✅
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGuide; 