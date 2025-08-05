import { useState, useEffect } from 'react'
import { Plus, BookOpen, Heart, Volume2, Star } from 'lucide-react'
import vocabularyData from './data/vocabulary.json'

interface VocabularyItem {
  id: string
  wort: string
  bedeutung: string
  mastered: boolean
  lastReviewed?: Date
}

type Level = 'A1' | 'A2' | 'B1' | 'B2'

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
  const [isLoaded, setIsLoaded] = useState(false)

  // Load vocabulary from localStorage or default data
  useEffect(() => {
    const storageKey = getStorageKey(selectedLevel)
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setVocabulary(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse vocabulary from local storage", e)
        // Fallback to default if parsing fails
        const levelVocabulary = (vocabularyData as VocabularyData)[selectedLevel] || []
        const defaultVocabulary: VocabularyItem[] = levelVocabulary.map((item, index) => ({
          id: item.id || `${selectedLevel}-${item.wort}-${index}`,
          wort: item.wort,
          bedeutung: item.bedeutung,
          mastered: false
        }))
        setVocabulary(defaultVocabulary)
      }
    } else {
      // Load default vocabulary from vocabulary.json file for selected level
      const levelVocabulary = (vocabularyData as VocabularyData)[selectedLevel] || []
      const defaultVocabulary: VocabularyItem[] = levelVocabulary.map((item, index) => ({
        id: item.id || `${selectedLevel}-${item.wort}-${index}`,
        wort: item.wort,
        bedeutung: item.bedeutung,
        mastered: false
      }))
      setVocabulary(defaultVocabulary)
    }
    setIsLoaded(true)
  }, [selectedLevel])

  // Save vocabulary to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(getStorageKey(selectedLevel), JSON.stringify(vocabulary))
    }
  }, [vocabulary, selectedLevel, isLoaded])

  // Load vocabulary for selected level
  const loadLevelVocabulary = (level: Level) => {
    if (level === selectedLevel) return
    setIsLoaded(false)
    setSelectedLevel(level)
    setCurrentWord(null)
    setShowAnswer(false)
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
        <div className="card mb-6">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Meine Vokabeln - {selectedLevel}</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {vocabulary.map((item) => (
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
                    {item.mastered && (
                      <Heart className="w-4 h-4 text-green-500" />
                    )}
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