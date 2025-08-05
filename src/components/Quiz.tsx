import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../App';

interface QuizProps {
  vocabulary: VocabularyItem[];
}

const Quiz: React.FC<QuizProps> = ({ vocabulary }) => {
  const [currentQuestion, setCurrentQuestion] = useState<VocabularyItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateOptions = (correctAnswer: VocabularyItem) => {
    const incorrectAnswers = vocabulary
      .filter((item) => item.id !== correctAnswer.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((item) => item.bedeutung);

    const allOptions = [correctAnswer.bedeutung, ...incorrectAnswers].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const startQuiz = () => {
    const availableWords = vocabulary.filter(v => !v.mastered);
    if (availableWords.length > 0) {
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentQuestion(randomWord);
      generateOptions(randomWord);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  useEffect(() => {
    startQuiz();
  }, [vocabulary]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion?.bedeutung) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <p>Keine Wörter zum Üben verfügbar.</p>
        <button onClick={startQuiz} className="btn-primary mt-4">
          Quiz starten
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {currentQuestion.wort}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              selectedAnswer === option
                ? isCorrect
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300'
            }`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <div className="text-center">
          <button onClick={startQuiz} className="btn-primary mt-4">
            Nächste Frage
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
