document.addEventListener('DOMContentLoaded', () => {
    // Lista de imágenes que debe coincidir EXACTAMENTE con tus nombres de archivo en la carpeta 'img'
    const allCardImages = [
        '1.jpg', '2.png', '3.webp', '4.jpg', 
        '5.jpg', '6.webp', '7.jpg', '8.jpg',
        '9.jpg', '10.jpg', '11.jpg', '12.jpg'
    ];

    // Configuración de los niveles de dificultad
    const difficultySettings = {
        easy: { pairs: 4, time: 90, gridCols: 4 },
        medium: { pairs: 8, time: 60, gridCols: 4 },
        hard: { pairs: 12, time: 45, gridCols: 6 }
    };

    // Elementos del DOM (la conexión con el HTML)
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const pairsFoundElement = document.getElementById('pairs-found');
    const totalPairsElement = document.getElementById('total-pairs');
    const modal = document.getElementById('result-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const restartButton = document.getElementById('restart-button');

    // Variables de estado del juego
    let currentDifficulty = 'medium';
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = true;
    let timer;
    let timeLeft;

    // --- Lógica de la Pantalla de Inicio ---
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
        });
    });

    startButton.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initGame();
    });

    restartButton.addEventListener('click', () => {
        modal.classList.add('hidden');
        gameContainer.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    // --- Lógica Principal del Juego ---
    function initGame() {
        const settings = difficultySettings[currentDifficulty];
        
        clearInterval(timer);
        matchedPairs = 0;
        canFlip = true;
        
        timeLeft = settings.time;
        timerElement.textContent = timeLeft;
        pairsFoundElement.textContent = '0';
        totalPairsElement.textContent = settings.pairs;
        
        createBoard(settings);
        startTimer();
    }

    function createBoard({ pairs, gridCols }) {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        
        const imagesForGame = allCardImages.slice(0, pairs);
        const gameImages = shuffle([...imagesForGame, ...imagesForGame]);

        gameImages.forEach(imageName => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = imageName;
            // ¡CAMBIO IMPORTANTE AQUÍ! Asegúrate de que tu imagen del logo se llame 'reverso-logo.png'
            card.innerHTML = `
                <div class="card-face card-back"><img src="img/reverso-logo.png" alt="Reverso"></div>
                <div class="card-face card-front"><img src="img/${imageName}" alt="Carro"></div>
            `;
            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        });
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) endGame(false);
        }, 1000);
    }

    function handleCardClick(event) {
        if (!canFlip) return;
        const clickedCard = event.currentTarget;
        if (clickedCard.classList.contains('flipped') || clickedCard.classList.contains('matched')) return;
        
        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);
        
        if (flippedCards.length === 2) checkForMatch();
    }

    function checkForMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.id === card2.dataset.id) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                pairsFoundElement.textContent = matchedPairs;
                resetFlippedCards();
                if (matchedPairs === difficultySettings[currentDifficulty].pairs) endGame(true);
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                resetFlippedCards();
            }, 1200);
        }
    }
    
    function resetFlippedCards() {
        flippedCards = [];
        canFlip = true;
    }   
    
    function endGame(hasWon) {
        clearInterval(timer);
        setTimeout(() => {
            modalTitle.textContent = hasWon ? "¡VICTORIA LEGENDARIA!" : "¡MOTOR FUNDIDO!";
            modalImage.src = hasWon ? 'img/Ganaste.gif' : 'img/Perdiste.gif';
            modal.classList.remove('hidden');
        }, 500);
    }
});