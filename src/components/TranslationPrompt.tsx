import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './TranslationPrompt.css';

const TranslationPrompt: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState('fa');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const { t } = useLanguage();

  const handleGenerate = () => {
    const prompt = `Translate the following text to ${targetLang}:\n\n${sourceText}`;
    setGeneratedPrompt(prompt);
  };

  const handleAccept = () => {
    // acceptTranslation();
    // onClose();
  };

  return (
    <div className="translation-prompt">
      <div className="translation-form">
        <div className="form-group">
          <label htmlFor="source-text">{t('Source Text')}</label>
          <textarea
            id="source-text"
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t('Enter text to translate')}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="target-lang">{t('Target Language')}</label>
          <select
            id="target-lang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="fa">فارسی</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>

        <button onClick={handleGenerate} className="generate-btn">
          {t('Generate Translation Prompt')}
        </button>

        {generatedPrompt && (
          <div className="generated-prompt">
            <h3>{t('Generated Prompt')}</h3>
            <pre>{generatedPrompt}</pre>
            <button onClick={handleAccept} className="accept-btn">
              {t('Accept')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationPrompt; 