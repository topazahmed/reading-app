import React, { useState, useEffect, useCallback } from 'react';
import './AlphabetModule.scss';

interface AlphabetData {
  letter: string;
  word: string;
  image: string;
}

type Language = 'english' | 'bangla' | 'arabic';

const alphabetDataByLanguage: { [key in Language]: AlphabetData[] } = {
  english: [
    { letter: 'A', word: 'Apple', image: '🍎' },
    { letter: 'B', word: 'Ball', image: '⚽' },
    { letter: 'C', word: 'Cat', image: '🐱' },
    { letter: 'D', word: 'Dog', image: '🐶' },
    { letter: 'E', word: 'Elephant', image: '🐘' },
    { letter: 'F', word: 'Fish', image: '🐟' },
    { letter: 'G', word: 'Giraffe', image: '🦒' },
    { letter: 'H', word: 'House', image: '🏠' },
    { letter: 'I', word: 'Ice Cream', image: '🍦' },
    { letter: 'J', word: 'Juice', image: '🧃' },
    { letter: 'K', word: 'Kite', image: '🪁' },
    { letter: 'L', word: 'Lion', image: '🦁' },
    { letter: 'M', word: 'Moon', image: '🌙' },
    { letter: 'N', word: 'Nest', image: '🪺' },
    { letter: 'O', word: 'Orange', image: '🍊' },
    { letter: 'P', word: 'Penguin', image: '🐧' },
    { letter: 'Q', word: 'Queen', image: '👸' },
    { letter: 'R', word: 'Robot', image: '🤖' },
    { letter: 'S', word: 'Sun', image: '☀️' },
    { letter: 'T', word: 'Tree', image: '🌳' },
    { letter: 'U', word: 'Umbrella', image: '☂️' },
    { letter: 'V', word: 'Violin', image: '🎻' },
    { letter: 'W', word: 'Whale', image: '🐋' },
    { letter: 'X', word: 'X-ray', image: '🩻' },
    { letter: 'Y', word: 'Yacht', image: '🛥️' },
    { letter: 'Z', word: 'Zebra', image: '🦓' },
  ],
  bangla: [
    { letter: 'অ', word: 'আম', image: '🥭' }, // Mango
    { letter: 'আ', word: 'আনারস', image: '🍍' }, // Pineapple
    { letter: 'ই', word: 'ইঁদুর', image: '🐭' }, // Mouse
    { letter: 'ঈ', word: 'ঈগল', image: '🦅' }, // Eagle
    { letter: 'উ', word: 'উট', image: '🐪' }, // Camel
    { letter: 'ঊ', word: 'ঊষা', image: '🌅' }, // Dawn
    { letter: 'ঋ', word: 'ঋষি', image: '🧙‍♂️' }, // Sage
    { letter: 'এ', word: 'এলাচ', image: '🌿' }, // Cardamom
    { letter: 'ঐ', word: 'ঐরাবত', image: '🐘' }, // Elephant
    { letter: 'ও', word: 'ওল', image: '🍠' }, // Yam
    { letter: 'ঔ', word: 'ঔষধ', image: '💊' }, // Medicine
    { letter: 'ক', word: 'কলা', image: '🍌' }, // Banana
    { letter: 'খ', word: 'খরগোশ', image: '🐰' }, // Rabbit
    { letter: 'গ', word: 'গরু', image: '🐄' }, // Cow
    { letter: 'ঘ', word: 'ঘর', image: '🏠' }, // House
    { letter: 'ঙ', word: 'ঙ্গন', image: '🏞️' }, // Courtyard
    { letter: 'চ', word: 'চাঁদ', image: '🌙' }, // Moon
    { letter: 'ছ', word: 'ছাগল', image: '🐐' }, // Goat
    { letter: 'জ', word: 'জাহাজ', image: '🚢' }, // Ship
    { letter: 'ঝ', word: 'ঝরনা', image: '💧' }, // Waterfall
    { letter: 'ঞ', word: 'ঞ্জন', image: '🔥' }, // Fire
    { letter: 'ট', word: 'টমেটো', image: '🍅' }, // Tomato
    { letter: 'ঠ', word: 'ঠোঁট', image: '👄' }, // Lips
    { letter: 'ড', word: 'ডিম', image: '🥚' }, // Egg
    { letter: 'ঢ', word: 'ঢোল', image: '🥁' }, // Drum
    { letter: 'ণ', word: 'ণত্ব', image: '📚' }, // Knowledge
    { letter: 'ত', word: 'তারা', image: '⭐' }, // Star
    { letter: 'থ', word: 'থালা', image: '🍽️' }, // Plate
    { letter: 'দ', word: 'দাঁত', image: '🦷' }, // Tooth
    { letter: 'ধ', word: 'ধান', image: '🌾' }, // Rice
    { letter: 'ন', word: 'নৌকা', image: '⛵' }, // Boat
    { letter: 'প', word: 'পাখি', image: '🐦' }, // Bird
    { letter: 'ফ', word: 'ফুল', image: '🌸' }, // Flower
    { letter: 'ব', word: 'বই', image: '📖' }, // Book
    { letter: 'ভ', word: 'ভালুক', image: '🐻' }, // Bear
    { letter: 'ম', word: 'মাছ', image: '🐟' }, // Fish
    { letter: 'য', word: 'যন্ত্র', image: '⚙️' }, // Machine
    { letter: 'র', word: 'রকেট', image: '🚀' }, // Rocket
    { letter: 'ল', word: 'লেবু', image: '🍋' }, // Lemon
    { letter: 'শ', word: 'শিশু', image: '👶' }, // Baby
    { letter: 'ষ', word: 'ষাঁড়', image: '🐂' }, // Bull
    { letter: 'স', word: 'সূর্য', image: '☀️' }, // Sun
    { letter: 'হ', word: 'হাতি', image: '🐘' }, // Elephant
    { letter: 'ড়', word: 'ড়িম', image: '🥚' }, // Egg
    { letter: 'ঢ়', word: 'ঢ়াক', image: '🥁' }, // Drum
    { letter: 'য়', word: 'য়াক', image: '🦌' }, // Yak
    { letter: 'ৎ', word: 'সৎ', image: '✨' }, // Good
    { letter: 'ং', word: 'রং', image: '🎨' }, // Color
    { letter: 'ঃ', word: 'দুঃখ', image: '😢' }, // Sadness
    { letter: 'ঁ', word: 'চাঁদ', image: '🌙' }, // Moon
  ],
  arabic: [
    { letter: 'ا', word: 'أسد', image: '🦁' }, // Lion (Asad)
    { letter: 'ب', word: 'بطة', image: '🦆' }, // Duck (Batta)
    { letter: 'ت', word: 'تفاح', image: '🍎' }, // Apple (Tuffah)
    { letter: 'ث', word: 'ثعلب', image: '🦊' }, // Fox (Tha'lab)
    { letter: 'ج', word: 'جمل', image: '🐪' }, // Camel (Jamal)
    { letter: 'ح', word: 'حوت', image: '🐋' }, // Whale (Hoot)
    { letter: 'خ', word: 'خروف', image: '🐑' }, // Sheep (Kharoof)
    { letter: 'د', word: 'دب', image: '🐻' }, // Bear (Dubb)
    { letter: 'ذ', word: 'ذئب', image: '🐺' }, // Wolf (Dhi'b)
    { letter: 'ر', word: 'رمان', image: '🍎' }, // Pomegranate (Rumman)
    { letter: 'ز', word: 'زرافة', image: '🦒' }, // Giraffe (Zarafa)
    { letter: 'س', word: 'سمك', image: '🐟' }, // Fish (Samak)
    { letter: 'ش', word: 'شمس', image: '☀️' }, // Sun (Shams)
    { letter: 'ص', word: 'صقر', image: '🦅' }, // Falcon (Saqr)
    { letter: 'ض', word: 'ضفدع', image: '🐸' }, // Frog (Difda')
    { letter: 'ط', word: 'طائر', image: '🐦' }, // Bird (Ta'ir)
    { letter: 'ظ', word: 'ظبي', image: '🦌' }, // Deer (Dhabi)
    { letter: 'ع', word: 'عصفور', image: '🐦' }, // Sparrow (Usfoor)
    { letter: 'غ', word: 'غزال', image: '🦌' }, // Gazelle (Ghazal)
    { letter: 'ف', word: 'فيل', image: '🐘' }, // Elephant (Feel)
    { letter: 'ق', word: 'قط', image: '🐱' }, // Cat (Qitt)
    { letter: 'ك', word: 'كلب', image: '🐶' }, // Dog (Kalb)
    { letter: 'ل', word: 'ليمون', image: '🍋' }, // Lemon (Laymoon)
    { letter: 'م', word: 'موز', image: '🍌' }, // Banana (Mooz)
    { letter: 'ن', word: 'نحلة', image: '🐝' }, // Bee (Nahla)
    { letter: 'ه', word: 'هدهد', image: '🐦' }, // Hoopoe (Hudhud)
    { letter: 'و', word: 'وردة', image: '🌹' }, // Rose (Warda)
    { letter: 'ي', word: 'يد', image: '✋' }, // Hand (Yad)
  ]
};

type Mode = 'learn' | 'test';

const AlphabetModule: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<Mode>('learn');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState('');

  // Get current alphabet data based on selected language
  const currentAlphabetData = alphabetDataByLanguage[currentLanguage];

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setCurrentLetterIndex(0); // Reset to first letter when language changes
    setUserResponse('');
    setFeedback('');
  };

  const getVoicePreference = (): string => {
    return localStorage.getItem('voicePreference') || 'mom';
  };

  const selectVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    const preference = getVoicePreference();
    
    if (preference === 'mom') {
      // Prefer female, kids, or child voices
      const preferredVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('girl') ||
        voice.name.toLowerCase().includes('kids') ||
        voice.name.toLowerCase().includes('child')
      );
      if (preferredVoice) return preferredVoice;
      
      // Fallback to any female voice
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('helena') ||
        voice.name.toLowerCase().includes('catherine')
      );
      if (femaleVoice) return femaleVoice;
    } else {
      // Prefer male voices
      const maleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') ||
        voice.name.toLowerCase().includes('man') ||
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('mark') ||
        voice.name.toLowerCase().includes('richard')
      );
      if (maleVoice) return maleVoice;
    }
    
    return voices[0] || null;
  }, []);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      
      const voices = speechSynthesis.getVoices();
      const selectedVoice = selectVoice(voices);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, [selectVoice]);

  const nextLetter = useCallback(() => {
    setCurrentLetterIndex((prev) => (prev + 1) % currentAlphabetData.length);
    setUserResponse('');
    setFeedback('');
  }, [currentAlphabetData.length]);

  const previousLetter = useCallback(() => {
    setCurrentLetterIndex((prev) => (prev - 1 + currentAlphabetData.length) % currentAlphabetData.length);
    setUserResponse('');
    setFeedback('');
  }, [currentAlphabetData.length]);

  const checkAnswer = useCallback((transcript: string) => {
    const currentLetter = currentAlphabetData[currentLetterIndex];
    const expectedWord = currentLetter.word.toLowerCase();
    
    if (transcript === expectedWord) {
      const correctMessage = currentLanguage === 'english' 
        ? 'Correct! Well done!'
        : currentLanguage === 'bangla'
        ? 'সঠিক! চমৎকার!'
        : 'صحيح! أحسنت!';
      
      setFeedback(correctMessage);
      speakText(correctMessage);
      setTimeout(() => {
        nextLetter();
      }, 2000);
    } else {
      const tryAgainMessage = currentLanguage === 'english' 
        ? `Try again! The word is ${currentLetter.word}`
        : currentLanguage === 'bangla'
        ? `আবার চেষ্টা করুন! শব্দটি হল ${currentLetter.word}`
        : `حاول مرة أخرى! الكلمة هي ${currentLetter.word}`;
      
      setFeedback(tryAgainMessage);
      speakText(tryAgainMessage);
    }
  }, [currentLetterIndex, speakText, nextLetter, currentAlphabetData, currentLanguage]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setUserResponse(transcript);
        checkAnswer(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        setFeedback('Error occurred. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [checkAnswer]);

  const speakLetter = (letter: string) => {
    speakText(`The letter ${letter}`);
  };

  const speakWord = (word: string) => {
    speakText(word);
  };

  const speakLetterAndWord = (letter: string, word: string) => {
    speakText(`${letter} for ${word}`);
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      setUserResponse('');
      setFeedback('');
      recognition.start();
    }
  };

  const currentLetter = currentAlphabetData[currentLetterIndex];

  return (
    <div className="alphabet-module">
      <div className="alphabet-header">
        <div className="language-selector">
          <select
            id="language-select"
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="language-dropdown"
          >
            <option value="english">🇺🇸 English</option>
            <option value="bangla">🇧🇩 বাংলা (Bangla)</option>
            <option value="arabic">🇸🇦 العربية (Arabic)</option>
          </select>
        </div>
        
        {/* <h2>
          {currentLanguage === 'english' && 'English Alphabet'}
          {currentLanguage === 'bangla' && 'বাংলা বর্ণমালা (Bangla Alphabet)'}
          {currentLanguage === 'arabic' && 'الأبجدية العربية (Arabic Alphabet)'}
        </h2> */}
        
        <div className="mode-selector">
          <button
            className={currentMode === 'learn' ? 'active' : ''}
            onClick={() => setCurrentMode('learn')}
          >
            {currentLanguage === 'english' && 'Learn'}
            {currentLanguage === 'bangla' && 'শিখুন'}
            {currentLanguage === 'arabic' && 'وضع التعلم'}
          </button>
          <button
            className={currentMode === 'test' ? 'active' : ''}
            onClick={() => setCurrentMode('test')}
          >
            {currentLanguage === 'english' && 'Test'}
            {currentLanguage === 'bangla' && 'পরীক্ষা'}
            {currentLanguage === 'arabic' && 'وضع الاختبار'}
          </button>
        </div>
      </div>

      <div className="alphabet-content">
        {currentMode === 'learn' ? (
          <div className="learn-mode">
            <div className="letter-grid">
              {currentAlphabetData.map((item: AlphabetData, index: number) => (
                <div
                  key={item.letter}
                  className={`letter-card ${index === currentLetterIndex ? 'active' : ''}`}
                  onClick={() => setCurrentLetterIndex(index)}
                >
                  <div className="letter-display">{item.letter}</div>
                  <div className="word-image">{item.image}</div>
                  <div className="word-text">{item.word}</div>
                </div>
              ))}
            </div>

            <div className="learning-panel">
              <div className="current-letter-display">
                <div className="big-letter">{currentLetter.letter}</div>
                <div className="big-image">{currentLetter.image}</div>
                <div className="big-word">{currentLetter.word}</div>
              </div>

              <div className="action-buttons">
                <button onClick={() => speakLetter(currentLetter.letter)}>
                  {currentLanguage === 'english' && 'Say Letter'}
                  {currentLanguage === 'bangla' && 'অক্ষর বলুন'}
                  {currentLanguage === 'arabic' && 'قل الحرف'}
                </button>
                <button onClick={() => speakWord(currentLetter.word)}>
                  {currentLanguage === 'english' && 'Say Word'}
                  {currentLanguage === 'bangla' && 'শব্দ বলুন'}
                  {currentLanguage === 'arabic' && 'قل الكلمة'}
                </button>
                <button onClick={() => speakLetterAndWord(currentLetter.letter, currentLetter.word)}>
                  {currentLanguage === 'english' && 'Say Both'}
                  {currentLanguage === 'bangla' && 'দুটিই বলুন'}
                  {currentLanguage === 'arabic' && 'قل كلاهما'}
                </button>
              </div>

              <div className="navigation-buttons">
                <button onClick={previousLetter}>
                  {currentLanguage === 'english' && 'Previous'}
                  {currentLanguage === 'bangla' && 'পূর্ববর্তী'}
                  {currentLanguage === 'arabic' && 'السابق'}
                </button>
                <button onClick={nextLetter}>
                  {currentLanguage === 'english' && 'Next'}
                  {currentLanguage === 'bangla' && 'পরবর্তী'}
                  {currentLanguage === 'arabic' && 'التالي'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="test-mode">
            <div className="test-display">
              <div className="test-letter">{currentLetter.letter}</div>
              <div className="test-image">{currentLetter.image}</div>
              <p>
                {currentLanguage === 'english' && 'What word starts with this letter?'}
                {currentLanguage === 'bangla' && 'এই অক্ষর দিয়ে কোন শব্দ শুরু হয়?'}
                {currentLanguage === 'arabic' && 'ما الكلمة التي تبدأ بهذا الحرف؟'}
              </p>
            </div>

            <div className="test-controls">
              <button
                className={`mic-button ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                disabled={isListening}
              >
                {isListening ? (
                  <>
                    🎤 {currentLanguage === 'english' && 'Listening...'}
                    {currentLanguage === 'bangla' && 'শুনছি...'}
                    {currentLanguage === 'arabic' && 'أستمع...'}
                  </>
                ) : (
                  <>
                    🎤 {currentLanguage === 'english' && 'Press to Speak'}
                    {currentLanguage === 'bangla' && 'বলার জন্য চাপুন'}
                    {currentLanguage === 'arabic' && 'اضغط للتحدث'}
                  </>
                )}
              </button>

              <button onClick={() => {
                const question = currentLanguage === 'english' 
                  ? `What word starts with ${currentLetter.letter}?`
                  : currentLanguage === 'bangla'
                  ? `${currentLetter.letter} দিয়ে কোন শব্দ শুরু হয়?`
                  : `ما الكلمة التي تبدأ بـ ${currentLetter.letter}؟`;
                speakText(question);
              }}>
                🔊 {currentLanguage === 'english' && 'Repeat Question'}
                {currentLanguage === 'bangla' && 'প্রশ্ন পুনরাবৃত্তি'}
                {currentLanguage === 'arabic' && 'كرر السؤال'}
              </button>
            </div>

            {userResponse && (
              <div className="user-response">
                <p>
                  {currentLanguage === 'english' && 'You said: '}
                  {currentLanguage === 'bangla' && 'আপনি বলেছেন: '}
                  {currentLanguage === 'arabic' && 'قلت: '}
                  <strong>{userResponse}</strong>
                </p>
              </div>
            )}

            {feedback && (
              <div className={`feedback ${feedback.includes('Correct') || feedback.includes('সঠিক') || feedback.includes('صحيح') ? 'correct' : 'incorrect'}`}>
                <p>{feedback}</p>
              </div>
            )}

            <div className="test-navigation">
              <button onClick={previousLetter}>
                {currentLanguage === 'english' && 'Previous Letter'}
                {currentLanguage === 'bangla' && 'পূর্ববর্তী অক্ষর'}
                {currentLanguage === 'arabic' && 'الحرف السابق'}
              </button>
              <button onClick={nextLetter}>
                {currentLanguage === 'english' && 'Skip Letter'}
                {currentLanguage === 'bangla' && 'অক্ষর এড়িয়ে যান'}
                {currentLanguage === 'arabic' && 'تخطي الحرف'}
              </button>
            </div>

            <div className="progress-indicator">
              {currentLanguage === 'english' && `Letter ${currentLetterIndex + 1} of ${currentAlphabetData.length}`}
              {currentLanguage === 'bangla' && `অক্ষর ${currentLetterIndex + 1} এর ${currentAlphabetData.length}`}
              {currentLanguage === 'arabic' && `الحرف ${currentLetterIndex + 1} من ${currentAlphabetData.length}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphabetModule;