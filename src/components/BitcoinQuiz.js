import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import './BitcoinQuiz.css';

const difficultyLevels = {
  french: {
    easy: 'Facile',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé'
  },
  wolof: {
    easy: 'Yombal',
    intermediate: 'Diggante',
    advanced: 'Xaragne'
  },
  english: {
    easy: 'Easy',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  }
};

const quizTranslations = {
  french: {
    selectDifficulty: 'Sélectionnez le niveau de difficulté',
    questionPrefix: "Question",
    of: "sur",
    nextQuestion: "Question Suivante",
    seeResults: "Voir les Résultats",
    quizComplete: "Quiz Terminé !",
    score: "Score :",
    tryAgain: "Réessayer",
    perfectScore: "Score parfait ! Vous êtes un expert Bitcoin ! 🏆",
    greatScore: "Excellent travail ! Vous connaissez bien Bitcoin ! 🌟",
    goodScore: "Bon travail ! Vous êtes en bonne voie pour devenir un pro du Bitcoin ! 📚",
    keepLearning: "Continuez d'apprendre ! Chaque expert Bitcoin a commencé quelque part. Réessayez ! 💪",
    shareScore: "Partager mon score",
    yes: "Oui",
    no: "Non"
  },
  wolof: {
    selectDifficulty: 'Tànnal niveau bi nga bëgg',
    questionPrefix: "Laaj",
    of: "ci",
    nextQuestion: "Laaj bi ci topp",
    seeResults: "Xool Natt bi",
    quizComplete: "Quiz bi Jeex na !",
    score: "Natt :",
    tryAgain: "Jéema beneen yoon",
    perfectScore: "Natt bu mat ! Yaa xam Bitcoin ! 🏆",
    greatScore: "Def nga bu baax ! Xam nga Bitcoin bu baax ! 🌟",
    goodScore: "Ligéey bu baax ! Yaa ngi jëm ci nekk ki xam Bitcoin ! 📚",
    keepLearning: "Kontinué jàng ! Ñépp ñoo tambalee fu nekk. Jéemaat ! 💪",
    shareScore: "Séddoo sama natt bi",
    yes: "Waaw",
    no: "Déet"
  },
  english: {
    selectDifficulty: 'Select difficulty level',
    questionPrefix: "Question",
    of: "of",
    nextQuestion: "Next Question",
    seeResults: "See Results",
    quizComplete: "Quiz Complete!",
    score: "Score:",
    tryAgain: "Try Again",
    perfectScore: "Perfect score! You're a Bitcoin expert! 🏆",
    greatScore: "Great job! You really know your Bitcoin! 🌟",
    goodScore: "Good work! You're on your way to becoming a Bitcoin pro! 📚",
    keepLearning: "Keep learning! Every Bitcoin expert started somewhere. Try again! 💪",
    shareScore: "Share my score",
    yes: "Yes",
    no: "No"
  }
};

const questions = {
  french: {
    easy: [
      {
        question: "Bitcoin est trop cher pour acheter si vous n'avez pas beaucoup d'argent.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Vous pouvez acheter une fraction de Bitcoin ! Comme avec le FCFA, vous pouvez acheter pour 500 FCFA, 1000 FCFA ou plus de Bitcoin."
      },
      {
        question: "Vous avez besoin d'un compte bancaire pour utiliser Bitcoin.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Bitcoin est accessible à tous, même sans compte bancaire. Vous pouvez échanger du Bitcoin contre du FCFA directement avec d'autres personnes, comme avec Wave ou Orange Money."
      },
      {
        question: "Bitcoin peut être envoyé à n'importe qui ayant une connexion internet.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Comme WhatsApp ou Wave, Bitcoin fonctionne partout où il y a internet. Vous pouvez envoyer de l'argent à votre famille à l'étranger en quelques minutes."
      },
      {
        question: "Si vous perdez votre téléphone, vous perdez tous vos Bitcoins pour toujours.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Si vous gardez votre phrase de récupération en sécurité (comme un code secret), vous pouvez récupérer vos Bitcoins sur un nouveau téléphone."
      },
      {
        question: "Le gouvernement sénégalais a créé Bitcoin.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Bitcoin a été créé en 2009 par une personne ou un groupe anonyme. Aucun gouvernement ne contrôle Bitcoin."
      }
    ],
    intermediate: [
      {
        question: "L'offre totale de Bitcoin est limitée à 21 millions.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Contrairement au FCFA qui peut être imprimé sans limite, il n'y aura jamais plus de 21 millions de Bitcoin. Cela le rend rare comme l'or."
      },
      {
        question: "Les transactions Bitcoin peuvent être annulées en cas d'erreur.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Comme lorsque vous donnez de l'argent liquide à quelqu'un, les transactions Bitcoin sont définitives. Vérifiez toujours l'adresse avant d'envoyer."
      },
      {
        question: "La valeur de Bitcoin est garantie par une entreprise.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "La valeur de Bitcoin vient de la confiance des utilisateurs et de sa rareté, comme l'or. Aucune entreprise ne garantit sa valeur."
      },
      {
        question: "Vous pouvez utiliser Bitcoin sans révéler votre vrai nom.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Comme payer en espèces, vous pouvez utiliser Bitcoin de manière privée. Cependant, toutes les transactions sont enregistrées publiquement."
      },
      {
        question: "Le minage de Bitcoin nécessite de résoudre des problèmes mathématiques.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Les mineurs utilisent des ordinateurs puissants pour sécuriser le réseau Bitcoin en résolvant des calculs complexes."
      }
    ],
    advanced: [
      {
        question: "Le réseau Lightning de Bitcoin permet des transactions plus rapides et moins chères.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Lightning est comme une voie rapide pour Bitcoin, permettant des paiements instantanés avec des frais très bas, idéal pour les petits achats quotidiens."
      },
      {
        question: "Toutes les transactions Bitcoin sont complètement anonymes.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Les transactions sont publiques et traçables, mais sans lien direct avec votre identité. C'est comme un livre de comptes public avec des pseudonymes."
      },
      {
        question: "Bitcoin peut être programmé pour exécuter automatiquement certaines actions.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Comme les contrats traditionnels, Bitcoin peut avoir des 'contrats intelligents' qui s'exécutent automatiquement selon des conditions prédéfinies."
      },
      {
        question: "La sécurité de Bitcoin repose sur la cryptographie.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Vrai",
        explanation: "Bitcoin utilise des mathématiques avancées (cryptographie) pour sécuriser les transactions, comme les systèmes de sécurité des banques en ligne."
      },
      {
        question: "Une attaque 51% permettrait de créer des Bitcoin illimités.",
        options: ["Vrai", "Faux"],
        correctAnswer: "Faux",
        explanation: "Même avec 51% du réseau, un attaquant ne pourrait pas créer de nouveaux Bitcoin. Les règles fondamentales de Bitcoin restent inchangées."
      }
    ]
  },
  wolof: {
    easy: [
      {
        question: "Bitcoin dafa cher lool bu fekkee amoo xaalis bu bari.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Man nga jënd tuuti ci Bitcoin! Mel na ni FCFA, man nga jënd 500 FCFA, 1000 FCFA walla lu ëpp ci Bitcoin."
      },
      {
        question: "Soxla nga compte banque ngir jëfandikoo Bitcoin.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Képp man na jëfandikoo Bitcoin, sax bu amul compte banque. Man nga wecci Bitcoin ak FCFA ak nit ñi, mel ni Wave walla Orange Money."
      },
      {
        question: "Man nga yóbbu Bitcoin fu nekk fu am internet.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Ni WhatsApp walla Wave, Bitcoin day dox fu am internet. Man nga yóbbu xaalis ci sa waa kër yi nekk bitim réew ci ay simili."
      },
      {
        question: "Boo ñakkee sa téléphone, say Bitcoin yépp dañuy réer ba fàww.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Bu fekkee danga denc sa baat yu secret yu jot (mel ni code secret), man nga jëleesi say Bitcoin ci beneen téléphone."
      },
      {
        question: "Gouvernement Sénégal moo sos Bitcoin.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Bitcoin dañu ko sos ci 2009 te kenn xamul kan moo ko def. Benn gouvernement du ko moom."
      }
    ],
    intermediate: [
      {
        question: "Bitcoin dafa am limite bu dul wees 21 millions.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Contrairement ci FCFA bi ñu mën a imprimer sans limite, Bitcoin du wees mukk 21 millions. Loolu tax mu néew ni wurus."
      },
      {
        question: "Man nañu dindi joxe bi ci Bitcoin bu am erreur.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Ni nga joxee kenn xaalis, joxe bi ci Bitcoin dafa def ba fàww. War nga seetaat bu baax adresse bi balaa ngay yóbbu."
      },
      {
        question: "Valeur Bitcoin, am na entreprise bu ko garantie.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Bitcoin am na valeur ndax ñépp gëm nañu ko te dafa néew, mel ni wurus. Benn entreprise garantie-ul valeur am."
      },
      {
        question: "Man nga jëfandikoo Bitcoin te waxoo sa tur.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Ni nga feyee ak xaalis, man nga jëfandikoo Bitcoin ci sutura. Waaye lépp luy xew dañu koy bind fu ñépp mën ko gis."
      },
      {
        question: "Minage Bitcoin dafa soxla résoudre calcul yu xóot.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Mineurs yi dañuy jëfandikoo ordinateurs yu am doole ngir sécuriser réseau Bitcoin bi ak résoudre calculs yu xóot."
      }
    ],
    advanced: [
      {
        question: "Réseau Lightning bi ci Bitcoin day tax joxe yi gën a gaaw te gën a yomb.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Lightning dafa mel ni yoon wu gaaw ngir Bitcoin, man nga def paiement si simili ak frais yu néew, lu baax ngir njënd yu ndaw."
      },
      {
        question: "Joxe-jëlëe yépp yi ci Bitcoin kenn du ko xam.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Joxe-jëlëe yi ñépp man nañu ko gis te man nañu ko suivre, waaye du wax kan moo ko def. Dafa mel ni kayit bu ñépp mën gis waaye ak tur yu dul sa tur dëgg."
      },
      {
        question: "Bitcoin man nañu ko programmer mu def ay actions automatiquement.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Ni contrat yi, Bitcoin man na am 'contrat intelligent' yuy dox seen bopp selon conditions yi ñu wax."
      },
      {
        question: "Sécurité Bitcoin dafa nekk ci cryptographie.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Waaw",
        explanation: "Bitcoin day jëfandikoo calcul yu xóot (cryptographie) ngir sécuriser joxe-jëlëe yi, mel ni système sécurité yi ci banque internet."
      },
      {
        question: "Attaque 51% man na tax ñu def Bitcoin yu dul jeex.",
        options: ["Waaw", "Déet"],
        correctAnswer: "Déet",
        explanation: "Même bu amee 51% réseau bi, kenn du mën créer Bitcoin yu bees. Règles yi ci Bitcoin du changé mukk."
      }
    ]
  },
  english: {
    easy: [
      {
        question: "Bitcoin is too expensive to buy if you don't have much money.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "You can buy a fraction of a Bitcoin! Just like with FCFA, you can buy for 500 FCFA, 1000 FCFA, or more of Bitcoin."
      },
      {
        question: "You need a bank account to use Bitcoin.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Bitcoin is accessible to everyone, even without a bank account. You can exchange Bitcoin for FCFA directly with others, like with Wave or Orange Money."
      },
      {
        question: "Bitcoin can be sent to anyone with an internet connection.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Like WhatsApp or Wave, Bitcoin works anywhere there's internet. You can send money to your family abroad in minutes."
      },
      {
        question: "If you lose your phone, you lose all your Bitcoin forever.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "If you keep your recovery phrase safe (like a secret code), you can recover your Bitcoin on a new phone."
      },
      {
        question: "The Senegalese government created Bitcoin.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Bitcoin was created in 2009 by an anonymous person or group. No government controls Bitcoin."
      }
    ],
    intermediate: [
      {
        question: "The total supply of Bitcoin is limited to 21 million.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Unlike FCFA which can be printed without limit, there will never be more than 21 million Bitcoin. This makes it scarce like gold."
      },
      {
        question: "Bitcoin transactions can be reversed if you make a mistake.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Like when you give cash to someone, Bitcoin transactions are final. Always check the address before sending."
      },
      {
        question: "Bitcoin's value is guaranteed by a company.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Bitcoin's value comes from user trust and its scarcity, like gold. No company guarantees its value."
      },
      {
        question: "You can use Bitcoin without revealing your real name.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Like paying with cash, you can use Bitcoin privately. However, all transactions are recorded publicly."
      },
      {
        question: "Bitcoin mining requires solving mathematical problems.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Miners use powerful computers to secure the Bitcoin network by solving complex calculations."
      }
    ],
    advanced: [
      {
        question: "Bitcoin's Lightning Network allows for faster and cheaper transactions.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Lightning is like a fast lane for Bitcoin, enabling instant payments with very low fees, perfect for small everyday purchases."
      },
      {
        question: "All Bitcoin transactions are completely anonymous.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Transactions are public and traceable, but not directly linked to your identity. It's like a public ledger with pseudonyms."
      },
      {
        question: "Bitcoin can be programmed to automatically execute certain actions.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Like traditional contracts, Bitcoin can have 'smart contracts' that automatically execute based on predefined conditions."
      },
      {
        question: "Bitcoin's security relies on cryptography.",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Bitcoin uses advanced mathematics (cryptography) to secure transactions, similar to online banking security systems."
      },
      {
        question: "A 51% attack would allow someone to create unlimited Bitcoin.",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Even with 51% of the network, an attacker couldn't create new Bitcoin. Bitcoin's fundamental rules remain unchanged."
      }
    ]
  }
};

const BitcoinQuiz = ({ language = 'french' }) => {
  const { isDarkMode } = useTheme();
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const translations = quizTranslations[language];
  
  useEffect(() => {
    if (difficulty) {
      setIsLoading(true);
      try {
        const allQuestions = questions[language][difficulty];
        console.log('Total questions available:', allQuestions.length);
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        console.log('Selected questions:', selected.length);
        setSelectedQuestions(selected);
      } catch (error) {
        console.error('Error setting up questions:', error);
      }
      setIsLoading(false);
    }
  }, [difficulty, language]);

  const handleDifficultySelect = (level) => {
    console.log('Selected difficulty:', level);
    setDifficulty(level);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    if (answer === selectedQuestions[currentQuestion].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    console.log('Current question:', currentQuestion);
    console.log('Total questions:', selectedQuestions.length);
    
    if (currentQuestion >= selectedQuestions.length - 1) {
      console.log('Quiz complete');
      setQuizComplete(true);
      return;
    }

    console.log('Moving to next question');
    setCurrentQuestion(prev => {
      console.log('New question number:', prev + 1);
      return prev + 1;
    });
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const resetQuiz = () => {
    setDifficulty(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizComplete(false);
    setSelectedQuestions([]);
  };

  const shareScore = () => {
    const text = `J'ai obtenu ${score}/5 au quiz Bitcoin! Testez vos connaissances sur Bitcoin: [URL]`;
    if (navigator.share) {
      navigator.share({
        text: text
      }).catch(console.error);
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
    }
  };

  const getEncouragingMessage = () => {
    if (score === 5) return translations.perfectScore;
    if (score >= 4) return translations.greatScore;
    if (score >= 3) return translations.goodScore;
    return translations.keepLearning;
  };

  if (!difficulty) {
    return (
      <div className={`bitcoin-quiz-container ${isDarkMode ? 'dark' : 'light'}`}>
        <h2>{translations.selectDifficulty}</h2>
        <div className="difficulty-buttons">
          <button onClick={() => handleDifficultySelect('easy')}>
            {difficultyLevels[language].easy}
          </button>
          <button onClick={() => handleDifficultySelect('intermediate')}>
            {difficultyLevels[language].intermediate}
          </button>
          <button onClick={() => handleDifficultySelect('advanced')}>
            {difficultyLevels[language].advanced}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || selectedQuestions.length === 0) {
    return (
      <div className={`bitcoin-quiz-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className={`bitcoin-quiz-container ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="quiz-result">
          <h2>{translations.quizComplete}</h2>
          <div className="quiz-score">{translations.score} {score}/5</div>
          <p className="quiz-message">{getEncouragingMessage()}</p>
          <div className="quiz-actions">
            {score < 5 && (
              <button className="try-again-btn" onClick={resetQuiz}>
                {translations.tryAgain}
              </button>
            )}
            <button className="share-score-btn" onClick={shareScore}>
              {translations.shareScore}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bitcoin-quiz-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="quiz-progress">
        {translations.questionPrefix} {currentQuestion + 1} {translations.of} {selectedQuestions.length}
      </div>
      
      <div className="quiz-question">
        {selectedQuestions[currentQuestion]?.question}
      </div>

      <div className="quiz-options">
        {selectedQuestions[currentQuestion]?.options.map((option, index) => (
          <button
            key={index}
            className={`quiz-option ${
              selectedAnswer === option
                ? option === selectedQuestions[currentQuestion].correctAnswer
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            onClick={() => handleAnswerSelect(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && selectedQuestions[currentQuestion] && (
        <div className="quiz-feedback">
          <div className="explanation">
            {selectedQuestions[currentQuestion].explanation}
          </div>
          <button 
            className="next-button"
            onClick={handleNextQuestion}
          >
            {currentQuestion < selectedQuestions.length - 1
              ? translations.nextQuestion 
              : translations.seeResults}
          </button>
        </div>
      )}
    </div>
  );
};

export default BitcoinQuiz; 