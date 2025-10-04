// Phonetic mappings for letters
const phoneticSounds: { [key: string]: string } = {
  'a': 'ay', 'b': 'bee', 'c': 'see', 'd': 'dee', 'e': 'ee',
  'f': 'eff', 'g': 'gee', 'h': 'aitch', 'i': 'eye', 'j': 'jay',
  'k': 'kay', 'l': 'ell', 'm': 'em', 'n': 'en', 'o': 'oh',
  'p': 'pee', 'q': 'cue', 'r': 'arr', 's': 'ess', 't': 'tee',
  'u': 'you', 'v': 'vee', 'w': 'double-you', 'x': 'ex', 'y': 'why', 'z': 'zee'
};

export const speakWord = (word: string): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    
    // Configure speech settings
    utterance.rate = 0.8; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.includes('Natural')
    ) || voices.find(voice => voice.lang.includes('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
    alert('Speech synthesis is not supported in your browser');
  }
};

export const speakLetter = (letter: string): void => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const phoneticSound = phoneticSounds[letter.toLowerCase()] || letter;
    const utterance = new SpeechSynthesisUtterance(phoneticSound);
    
    // Configure speech settings for letter sounds
    utterance.rate = 0.7; // Slower for letter pronunciation
    utterance.pitch = 1.1; // Slightly higher pitch for letters
    utterance.volume = 1.0;
    
    // Try to use a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.includes('Natural')
    ) || voices.find(voice => voice.lang.includes('en'));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported in this browser');
    alert('Speech synthesis is not supported in your browser');
  }
};

export const isAudioSupported = (): boolean => {
  return 'speechSynthesis' in window;
};