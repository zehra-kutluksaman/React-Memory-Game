import React, { useState, useEffect } from 'react';
import './App.css';

// Kartları oluşturma ve karıştırma fonksiyonu
const generateCards = () => {
  const symbols = ['😀', '🎉', '🐶', '🍕', '🌈', '🚀', '🏀', '🎵'];
  const cards = [...symbols, ...symbols]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,  // Kartların başlangıçta kapalı olması
      isMatched: false,
    }));
  return cards;
};

function App() {
  const [cards, setCards] = useState(generateCards());
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Timer fonksiyonu
  useEffect(() => {
    let timerInterval;
    if (gameStarted) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameStarted]);

  // Kart eşleşme kontrolü ve oyun bitişi kontrolü
  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.symbol === secondCard.symbol) {
        // Eşleşen kartlar
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstCard.symbol
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedCount(matchedCount + 1);
        resetChoices(); // Seçimleri sıfırlama
      } else {
        // Eşleşmeyen kartlar 1 saniye sonra kapatılır
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          resetChoices(); // Seçimleri sıfırlama
        }, 1000);
      }
    }
  }, [secondCard]);

  // Oyun bitişini kontrol etme
  useEffect(() => {
    if (matchedCount === 8) {
      setGameStarted(false); // Tüm eşleşmeler bulunduğunda oyunu durdur
    }
  }, [matchedCount]);

  // Kart seçimlerini sıfırlama
  const resetChoices = () => {
    setFirstCard(null);
    setSecondCard(null);
  };

  // Kart tıklama işlemi
  const handleCardClick = (clickedCard) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Kart zaten açılmış veya eşleşmişse tıklamayı engelle
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    // Kartı aç (flip)
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    // İlk kart seçimi
    if (!firstCard) {
      setFirstCard(clickedCard);
    } else if (!secondCard) {
      // İkinci kart seçimi ve hamle sayısını artırma
      setSecondCard(clickedCard);
      setMoves(moves + 1);
    }
  };

  // Oyunu yeniden başlatma
  const restartGame = () => {
    setCards(generateCards());
    setFirstCard(null);
    setSecondCard(null);
    setMatchedCount(0);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
  };

  return (
    <div className="App">
      <h1>Hafıza Kart Oyunu</h1>
      <div className="stats">
        <div>Zaman: {timer}s</div>
        <div>Oyun: {moves}</div>
        <div>Eşleşme: {matchedCount}/8</div>
      </div>
      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${
              card.isMatched ? 'matched' : ''
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className="front">?</div>
            <div className="back">{card.symbol}</div>
          </div>
        ))}
      </div>
      <button onClick={restartGame} className="restart-button">
        Yeni Oyun
      </button>
    </div>
  );
}

export default App;
