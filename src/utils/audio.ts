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
    utterance.rate = 0.5; // Set to 0.5 speed for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a kids/children's voice first, then female voice
    const voices = window.speechSynthesis.getVoices();
    const kidsVoice = voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.toLowerCase().includes('child') ||
        voice.name.toLowerCase().includes('kids') ||
        voice.name.toLowerCase().includes('boy') ||
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
    
    if (kidsVoice) {
      utterance.voice = kidsVoice;
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
    utterance.rate = 0.5; // Set to 0.5 speed for letter pronunciation
    utterance.pitch = 1.1; // Slightly higher pitch for letters
    utterance.volume = 1.0;
    
    // Try to use a kids/children's voice first, then female voice
    const voices = window.speechSynthesis.getVoices();
    const kidsVoice = voices.find(voice => 
      voice.lang.includes('en') && (
        voice.name.toLowerCase().includes('child') ||
        voice.name.toLowerCase().includes('kids') ||
        voice.name.toLowerCase().includes('boy') ||
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
    
    if (kidsVoice) {
      utterance.voice = kidsVoice;
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