import { useState, useEffect, useRef } from 'react'
import { Plus, BookOpen, Heart, Volume2, Star, Repeat, Undo2 } from 'lucide-react'
import vocabularyData from './data/vocabulary.json'

interface VocabularyItem {
  id: string
  wort: string
  bedeutung: string
  mastered: boolean
  lastReviewed?: Date
}

type Level = 'A1' | 'A2' | 'B1' | 'B2'
type FilterType = 'all' | 'mastered' | 'unmastered'

// Define the structure of the imported vocabulary data
interface VocabularyData {
  A1: { id?: string; wort: string; bedeutung: string }[]
  A2: { id?: string; wort: string; bedeutung: string }[]
  B1: { id?: string; wort: string; bedeutung: string }[]
  B2: { id?: string; wort: string; bedeutung: string }[]
}

const getStorageKey = (level: Level) => `schnelllern-vocabulary-${level}`

function App() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<Level>('B2')
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoaded, setIsLoaded] = useState(false)
  const practiceRef = useRef<HTMLDivElement>(null)

  const loadDefaultVocabulary = (level: Level): VocabularyItem[] => {
    const data = (vocabularyData as any).default || vocabularyData;
    const levelVocabulary = (data as VocabularyData)[level] || [];
    return levelVocabulary.map((item, index) => ({
      id: item.id || `${level}-${item.wort}-${index}`,
      wort: item.wort,
      bedeutung: item.bedeutung,
      mastered: false
    }));
  };

  // Load vocabulary from localStorage or default data
  useEffect(() => {
    const storageKey = getStorageKey(selectedLevel)
    const saved = localStorage.getItem(storageKey)
    let loadedVocab: VocabularyItem[] = []
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const defaultVocab = loadDefaultVocabulary(selectedLevel);
        if (parsed.length === 0 && defaultVocab.length > 0) {
          loadedVocab = defaultVocab;
        } else {
          loadedVocab = parsed;
        }
      } catch (e) {
        console.error("Failed to parse vocabulary from local storage", e)
        loadedVocab = loadDefaultVocabulary(selectedLevel);
      }
    } else {
      loadedVocab = loadDefaultVocabulary(selectedLevel);
    }
    setVocabulary(loadedVocab);

    const currentWordIdKey = `schnelllern-current-word-id-${selectedLevel}`
    const savedWordId = localStorage.getItem(currentWordIdKey)
    if (savedWordId) {
      const word = loadedVocab.find(w => w.id === savedWordId)
      if (word) {
        setCurrentWord(word)
      }
    }
    setIsLoaded(true)
  }, [selectedLevel])

  // Save vocabulary to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(getStorageKey(selectedLevel), JSON.stringify(vocabulary))
    }
  }, [vocabulary, selectedLevel, isLoaded])

  // Save current word to localStorage
  useEffect(() => {
    const currentWordIdKey = `schnelllern-current-word-id-${selectedLevel}`
    if (currentWord) {
      localStorage.setItem(currentWordIdKey, currentWord.id)
    } else {
      localStorage.removeItem(currentWordIdKey)
    }
  }, [currentWord, selectedLevel])

  // Load vocabulary for selected level
  const loadLevelVocabulary = (level: Level) => {
    setIsLoaded(false)
    setCurrentWord(null)
    setShowAnswer(false)
    setSelectedLevel(level)
  }

  // Get random word for practice
  const getRandomWord = () => {
    const unmastered = vocabulary.filter(v => !v.mastered)
    if (unmastered.length === 0) return null
    return unmastered[Math.floor(Math.random() * unmastered.length)]
  }

  // Start practice
  const startPractice = () => {
    const word = getRandomWord()
    setCurrentWord(word || null)
    setShowAnswer(false)
  }

  // Mark word as mastered
  const markAsMastered = () => {
    if (currentWord) {
      setVocabulary(prev => 
        prev.map(v => 
          v.id === currentWord.id 
            ? { ...v, mastered: true, lastReviewed: new Date() }
            : v
        )
      )
      startPractice()
    }
  }

  // Repeat a word
  const repeatWord = (word: VocabularyItem) => {
    setCurrentWord(word)
    setShowAnswer(false)
    practiceRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Mark word as unlearned
  const markAsUnlearned = (id: string) => {
    setVocabulary(prev =>
      prev.map(v =>
        v.id === id
          ? { ...v, mastered: false }
          : v
      )
    )
  }

  // Play pronunciation
  const playPronunciation = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'de-DE'
      speechSynthesis.speak(utterance)
    }
  }

  const masteredCount = vocabulary.filter(v => v.mastered).length
  const totalCount = vocabulary.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-600 mb-2">SchnellLern</h1>
          <p className="text-gray-600">Tägliches Vokabeln lernen</p>
        </div>

        {/* Level Selection */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-rose-500" />
            Niveaustufe wählen
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loadLevelVocabulary('A1')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedLevel === 'A1' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
              }`}
            >
              <div className="font-semibold">A1</div>
              <div className="text-sm">Anfänger</div>
            </button>
            <button
              onClick={() => loadLevelVocabulary('A2')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedLevel === 'A2' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
              }`}
            >
              <div className="font-semibold">A2</div>
              <div className="text-sm">Grundstufe</div>
            </button>
            <button
              onClick={() => loadLevelVocabulary('B1')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedLevel === 'B1' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
              }`}
            >
              <div className="font-semibold">B1</div>
              <div className="text-sm">Mittelstufe</div>
            </button>
            <button
              onClick={() => loadLevelVocabulary('B2')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedLevel === 'B2' 
                  ? 'border-rose-500 bg-rose-50 text-rose-700' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
              }`}
            >
              <div className="font-semibold">B2</div>
              <div className="text-sm">Sicher</div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">{totalCount}</div>
              <div className="text-sm text-gray-600">Gesamt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{masteredCount}</div>
              <div className="text-sm text-gray-600">Gelernt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalCount - masteredCount}</div>
              <div className="text-sm text-gray-600">Zu lernen</div>
            </div>
          </div>
        </div>

        {/* Practice */}
        <div className="card mb-6" ref={practiceRef}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-rose-500" />
            Übung - {selectedLevel}
          </h2>
          
          {vocabulary.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                {selectedLevel === 'B2' 
                  ? 'Lade alle B2 Vokabeln...' 
                  : `${selectedLevel} Vokabeln werden bald hinzugefügt!`
                }
              </p>
            </div>
          ) : currentWord ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {currentWord.wort}
                </div>
                <button
                  onClick={() => playPronunciation(currentWord.wort)}
                  className="text-rose-500 hover:text-rose-600"
                >
                  <Volume2 className="w-5 h-5 mx-auto" />
                </button>
              </div>
              
              {showAnswer ? (
                <div className="text-center">
                  <div className="text-xl text-gray-700 mb-4">
                    {currentWord.bedeutung}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={markAsMastered}
                      className="btn-primary flex-1 flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Gelernt
                    </button>
                    <button
                      onClick={startPractice}
                      className="btn-secondary flex-1"
                    >
                      Nächste
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="btn-primary w-full"
                >
                  Bedeutung zeigen
                </button>
              )}
            </div>
          ) : (
            <button onClick={startPractice} className="btn-primary w-full">
              Übung starten
            </button>
          )}
        </div>

        {/* Vocabulary list */}
        {vocabulary.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Meine Vokabeln - {selectedLevel}</h2>
            </div>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'all'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setFilter('mastered')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'mastered'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Gelernt
              </button>
              <button
                onClick={() => setFilter('unmastered')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'unmastered'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                Zu lernen
              </button>
            </div>
            <div className="space-y-2">
              {vocabulary
                .filter(item => {
                  if (filter === 'mastered') return item.mastered
                  if (filter === 'unmastered') return !item.mastered
                  return true
                })
                .map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border ${
                    item.mastered 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-rose-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{item.wort}</div>
                      <div className="text-sm text-gray-600">{item.bedeutung}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => repeatWord(item)}
                        className="p-1 text-blue-500 hover:text-blue-600"
                        title="Wiederholen"
                      >
                        <Repeat className="w-4 h-4" />
                      </button>
                      {item.mastered ? (
                        <button
                          onClick={() => markAsUnlearned(item.id)}
                          className="p-1 text-orange-500 hover:text-orange-600"
                          title="Als 'Zu lernen' markieren"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-6 h-6" /> // Placeholder for alignment
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 