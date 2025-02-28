import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import PlusMinusIcon from './PlusMinusIcon';

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 10px;
  background-color: ${props => props.isDark ? 'var(--bg-secondary-dark)' : 'var(--bg-secondary-light)'};
  box-shadow: ${props => props.isDark ? 'var(--shadow-dark)' : 'var(--shadow-light)'};
`;

const FAQTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  border: 1px solid ${props => props.isDark ? 'rgba(247, 147, 26, 0.3)' : 'rgba(247, 147, 26, 0.2)'};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: ${props => props.isDark ? 'var(--bg-secondary-dark)' : 'var(--bg-secondary-light)'};

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      ${props => props.isDark ? 'rgba(247, 147, 26, 0.03)' : 'rgba(247, 147, 26, 0.02)'},
      ${props => props.isDark ? 'rgba(247, 147, 26, 0.03)' : 'rgba(247, 147, 26, 0.02)'} 10px,
      transparent 10px,
      transparent 20px
    );
    opacity: ${props => props.isExpanded ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.isDark ? 'rgba(247, 147, 26, 0.5)' : 'rgba(247, 147, 26, 0.4)'};
    box-shadow: 0 4px 12px ${props => props.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const Question = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: ${props => props.isDark ? 'var(--text-primary-dark)' : 'var(--text-primary-light)'};
  font-weight: ${props => props.isExpanded ? '600' : '500'};
  font-family: 'JetBrains Mono', monospace;
  
  span {
    flex: 1;
    min-width: 0;
    padding-right: 8px;
  }
  
  &:hover {
    background: ${props => props.isDark ? 'rgba(247, 147, 26, 0.1)' : 'rgba(247, 147, 26, 0.05)'};
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
    gap: 8px;
    
    span {
      padding-right: 4px;
    }
  }
`;

const Answer = styled.div`
  padding: 0 16px;
  color: ${props => props.isDark ? 'var(--text-secondary-dark)' : 'var(--text-secondary-light)'};
  line-height: 1.6;
  max-height: ${props => props.isExpanded ? '500px' : '0'};
  opacity: ${props => props.isExpanded ? 1 : 0};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
  transform: ${props => props.isExpanded ? 'scaleY(1)' : 'scaleY(0.95)'};
  padding-bottom: ${props => props.isExpanded ? '16px' : '0'};
  font-family: 'JetBrains Mono', monospace;
`;

const FAQ = ({ language = 'french' }) => {
  const { isDarkMode } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const text = {
    french: {
      faqTitle: "Questions fréquentes sur Bitcoin"
    },
    wolof: {
      faqTitle: "Laaj yi ëpp ci Bitcoin"
    },
    english: {
      faqTitle: "Frequently Asked Questions about Bitcoin"
    }
  };

  const faqs = {
    french: [
      {
        question: "Bitcoin est-il de l'argent réel puisqu'il est numérique ?",
        answer: "Oui, Bitcoin est de l'argent réel même s'il est numérique. C'est similaire à l'argent que vous utilisez déjà avec Wave ou Orange Money, mais sans aucune entreprise qui le contrôle. L'argent sur votre téléphone avec Wave est aussi numérique, mais vous le considérez comme réel, n'est-ce pas ? Bitcoin fonctionne de manière semblable mais avec des avantages supplémentaires."
      },
      {
        question: "Comment Bitcoin peut-il bénéficier aux gens au Sénégal ?",
        answer: "Bitcoin peut aider les Sénégalais de plusieurs façons : envoi d'argent sans frais élevés, protection contre l'inflation, accès aux services financiers sans besoin d'une banque, et paiements internationaux faciles. Cela peut être particulièrement utile pour recevoir de l'argent de la famille à l'étranger sans payer de gros frais."
      },
      {
        question: "Bitcoin est-il sécurisé ?",
        answer: "Oui, la technologie Bitcoin est très sécurisée. Elle utilise des mathématiques avancées pour protéger votre argent. Cependant, comme avec l'argent traditionnel, vous devez protéger votre 'portefeuille' (comme protéger votre code PIN pour Wave). Si vous suivez les bonnes pratiques de sécurité, Bitcoin est sûr à utiliser."
      },
      {
        question: "Comment acheter ou vendre du Bitcoin au Sénégal ?",
        answer: "Il existe plusieurs façons d'acheter du Bitcoin au Sénégal : applications comme Binance, échanges locaux comme Yellowcard, ou directement auprès d'autres personnes. Vous pouvez souvent utiliser Wave ou Orange Money pour acheter et vendre du Bitcoin via ces services."
      },
      {
        question: "Pourquoi le prix du Bitcoin change-t-il autant ?",
        answer: "Le prix change beaucoup car Bitcoin est encore nouveau et en croissance. C'est comme une jeune entreprise dont la valeur peut changer rapidement. Plus de personnes l'utiliseront avec le temps, plus son prix devrait se stabiliser. Pour l'instant, il est préférable de ne pas investir d'argent dont vous avez besoin pour vos dépenses quotidiennes."
      }
    ],
    wolof: [
      {
        question: "Ndax Bitcoin xaalis la bu dëggu ndaxte digital la?",
        answer: "Waaw, Bitcoin xaalis la bu dëgg même bu de digital la. Niroo na ak xaalis bi ngay jëfandikoo ci Wave walla Orange Money, mais kenn du ko kontrole. Xaalis bi ci sa telefon ak Wave digital la itam, waaye dangay xalaat ni dëgg la, ndax déet? Bitcoin noonu lay doxe mais am na njariñ yu ëpp."
      },
      {
        question: "Nan la Bitcoin mënë jariñe nit ñi ci Senegal?",
        answer: "Bitcoin mën na jariñe way Senegal ci ay anam yu bari: yoonal xaalis bu amul frais yu bare, kaarange ndax inflation, jot service financier te ñakk bank, ak fayement international yu yomb. Lii man na doon lu am solo ngir jot xaalis ci sa waa kër yi nekk ci bitim réew te fayuko frais yu bare."
      },
      {
        question: "Ndax Bitcoin aar na?",
        answer: "Waaw, teknoloji Bitcoin dafa aar bu baax. Day jëfandikoo mat yu xameni ngir aar sa xaalis. Waaye, niki xaalis bu tradicional, war nga aar sa 'portefeuille' (niki aar sa code PIN pour Wave). Soo toppé pratique yu baax yu kaarange, Bitcoin dafa aar bu baax."
      },
      {
        question: "Nan la ñuy jënde walla jaaye Bitcoin ci Senegal?",
        answer: "Am na bari yan anam yoo mënë jënde Bitcoin ci Senegal: aplikasion yi mel ni Binance, échange local yi mel ni Yellowcard, walla direktement ak nit ñi. Yaa mën jëfandikoo Wave walla Orange Money ba jënde ak jaaye Bitcoin jaarale ko ci service yoyii."
      },
      {
        question: "Lu tax njëg Bitcoin di sopeku noonu?",
        answer: "Njëg bi dey sopeku ndax Bitcoin bees la te mungiy yokku. Mel na ni entreprise bu ndaw bu valeur bi mënë sopeku bu gaaw. Su ëppee nit ñiy jëfandikoo ko ci jamano ji, njëg bi dina gën wóor. Léegi, baaxul nga invest xaalis bi nga soxla ci sa dépense yi bés bu nekk."
      }
    ],
    english: [
      {
        question: "Is Bitcoin real money since it's digital?",
        answer: "Yes, Bitcoin is real money even though it's digital. It's similar to the money you already use with Wave or Orange Money, but without any company controlling it. The money on your phone with Wave is also digital, but you consider it real, don't you? Bitcoin works similarly but with additional benefits."
      },
      {
        question: "How can Bitcoin benefit people in Senegal?",
        answer: "Bitcoin can help Senegalese people in several ways: sending money without high fees, protection against inflation, access to financial services without needing a bank, and easy international payments. This can be particularly useful for receiving money from family abroad without paying large fees."
      },
      {
        question: "Is Bitcoin safe?",
        answer: "Yes, Bitcoin technology is very secure. It uses advanced mathematics to protect your money. However, like traditional money, you need to protect your 'wallet' (like protecting your PIN code for Wave). If you follow good security practices, Bitcoin is safe to use."
      },
      {
        question: "How to buy or sell Bitcoin in Senegal?",
        answer: "There are several ways to buy Bitcoin in Senegal: applications like Binance, local exchanges like Yellowcard, or directly from other people. You can often use Wave or Orange Money to buy and sell Bitcoin through these services."
      },
      {
        question: "Why does Bitcoin's price change so much?",
        answer: "The price changes a lot because Bitcoin is still new and growing. It's like a young company whose value can change quickly. As more people use it over time, its price should become more stable. For now, it's best not to invest money that you need for your daily expenses."
      }
    ]
  };

  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <FAQContainer isDark={isDarkMode}>
      <FAQTitle isDark={isDarkMode}>{text[language].faqTitle}</FAQTitle>
      <FAQList>
        {faqs[language].map((item, index) => (
          <FAQItem 
            key={index} 
            isDark={isDarkMode}
            isExpanded={expandedIndex === index}
            onClick={() => toggleQuestion(index)}
          >
            <Question 
              isDark={isDarkMode}
              isExpanded={expandedIndex === index}
            >
              <span>{item.question}</span>
              <PlusMinusIcon isExpanded={expandedIndex === index} />
            </Question>
            <Answer 
              isDark={isDarkMode}
              isExpanded={expandedIndex === index}
            >
              {item.answer}
            </Answer>
          </FAQItem>
        ))}
      </FAQList>
    </FAQContainer>
  );
};

export default FAQ; 