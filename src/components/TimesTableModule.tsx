import React, { useState, useEffect } from 'react';
import './TimesTableModule.scss';

const TimesTableModule: React.FC = () => {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [spokenRows, setSpokenRows] = useState<Set<number>>(new Set());
  const [isAutoProgressing, setIsAutoProgressing] = useState(false);

  // Helper function to get voice preference from localStorage
  const getVoicePreference = (): 'mom' | 'dad' => {
    const savedVoice = localStorage.getItem('voicePreference');
    return (savedVoice === 'dad' || savedVoice === 'mom') ? savedVoice : 'mom';
  };

  // Helper function to select appropriate voice based on preference
  const selectVoice = (voices: SpeechSynthesisVoice[], preference: 'mom' | 'dad'): SpeechSynthesisVoice | undefined => {
    if (preference === 'dad') {
      return voices.find(voice => 
        voice.lang.includes('en') && (
          voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('james') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('alex') ||
          voice.name.toLowerCase().includes('tom')
        )
      ) || voices.find(voice => voice.lang.includes('en') && !voice.name.toLowerCase().includes('female'));
    } else {
      return voices.find(voice => 
        voice.lang.includes('en') && (
          voice.name.toLowerCase().includes('child') ||
          voice.name.toLowerCase().includes('kids') ||
          voice.name.toLowerCase().includes('girl') ||
          voice.name.toLowerCase().includes('junior') ||
          voice.name.toLowerCase().includes('young')
        )
      ) || voices.find(voice => 
        voice.lang.includes('en') && (
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('susan') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('tessa') ||
          voice.name.toLowerCase().includes('serena')
        )
      ) || voices.find(voice => voice.lang.includes('en'));
    }
  };

  const speakRow = (num: number, multiplier: number, result: number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const text = `${num} times ${multiplier} equals ${result}`;
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preference = getVoicePreference();
      const selectedVoice = selectVoice(voices, preference);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRowClick = (multiplier: number) => {
    const result = selectedNumber * multiplier;
    speakRow(selectedNumber, multiplier, result);
    
    setSpokenRows(prev => {
      const newSet = new Set(prev);
      newSet.add(multiplier);
      return newSet;
    });
  };

  const handleNumberSelect = (num: number) => {
    setSelectedNumber(num);
    setSpokenRows(new Set());
    setIsAutoProgressing(false);
  };

  // Check if all rows have been spoken
  useEffect(() => {
    if (spokenRows.size === 10 && !isAutoProgressing) {
      setIsAutoProgressing(true);
      
      // Wait 2 seconds then move to next number
      setTimeout(() => {
        const nextNumber = selectedNumber === 9 ? 1 : selectedNumber + 1;
        setSelectedNumber(nextNumber);
        setSpokenRows(new Set());
        setIsAutoProgressing(false);
      }, 2000);
    }
  }, [spokenRows, selectedNumber, isAutoProgressing]);

  // Reset spoken rows when number changes
  useEffect(() => {
    setSpokenRows(new Set());
  }, [selectedNumber]);

  return (
    <div className="times-table-module">
      <div className="number-selector">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className={`number-button ${selectedNumber === num ? 'active' : ''}`}
            onClick={() => handleNumberSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="times-table-grid">
        <h2 className="table-title">Times Table for {selectedNumber}</h2>
        <div className="table-rows">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((multiplier) => {
            const result = selectedNumber * multiplier;
            const isSpoken = spokenRows.has(multiplier);
            
            return (
              <button
                key={multiplier}
                className={`table-row ${isSpoken ? 'spoken' : ''}`}
                onClick={() => handleRowClick(multiplier)}
              >
                <span className="equation">
                  {selectedNumber} × {multiplier} = {result}
                </span>
                {isSpoken && <span className="checkmark">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimesTableModule;
