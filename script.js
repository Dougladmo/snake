const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const eatSound = document.getElementById('eatSound');
eatSound.volume = 1.0;



const gridSize = 20;
let snake = [
  { x: 100, y: 100, color: '#FF1493' }, // Cabeça
  { x: 80, y: 100, color: '#FF1493' }   // Corpo inicial
];
let apple = { x: 200, y: 200, color: 'red' }; 
let direction = 'right';
let speed = 150;
let score = 0;

// Obter o Best Score do armazenamento
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
document.getElementById('best-score-value').textContent = bestScore;

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 'ArrowDown':
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
    case 'ArrowLeft':
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 'ArrowRight':
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
  }
}

function draw() {
  // Limpar o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar a maçã
  ctx.fillStyle = apple.color;
  ctx.fillRect(apple.x, apple.y, gridSize, gridSize);

  // Desenhar a cobra
  snake.forEach(segment => {
    ctx.fillStyle = segment.color;
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function update() {
  // Atualizar a posição da cobra com base na direção
  let newHead;
  switch (direction) {
    case 'up':
      newHead = { x: snake[0].x, y: snake[0].y - gridSize, color: getNextColor(snake[0].color) };
      break;
    case 'down':
      newHead = { x: snake[0].x, y: snake[0].y + gridSize, color: getNextColor(snake[0].color) };
      break;
    case 'left':
      newHead = { x: snake[0].x - gridSize, y: snake[0].y, color: getNextColor(snake[0].color) };
      break;
    case 'right':
      newHead = { x: snake[0].x + gridSize, y: snake[0].y, color: getNextColor(snake[0].color) };
      break;
  }
  snake.unshift(newHead);

  // Verificar se a cobra comeu a maçã
  if (newHead.x === apple.x && newHead.y === apple.y) {
    // Gerar nova posição para a maçã
    apple.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    apple.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
    apple.color = 'red'; // Cor da maçã é sempre vermelha

    // Aumentar a pontuação
    score++;
    eatSound.play();

    // Atualizar o Best Score se necessário
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
      document.getElementById('best-score-value').textContent = bestScore;
    }

    // Ajustar a velocidade (quanto menor, mais devagar)
    speed = Math.max(100, speed - 5);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  } else {
    // Remover a cauda da cobra se não comeu a maçã
    snake.pop();
  }

  // Atualizar a pontuação atual
  document.getElementById('current-score').textContent = score;
}

function getNextColor(currentColor) {
  // Lista de cores
  const colors = ['#FF1493', '#FF8C00', '#FFD700', '#008000', '#0000FF', '#4B0082'];
  const currentIndex = colors.indexOf(currentColor);
  const nextIndex = (currentIndex + 1) % colors.length;
  return colors[nextIndex];
}

function checkCollision() {
  // Verificar colisão com as bordas
  if (
    snake[0].x < 0 || snake[0].x >= canvas.width ||
    snake[0].y < 0 || snake[0].y >= canvas.height
  ) {
    gameOver();
  }

  // Verificar colisão consigo mesma
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      gameOver();
    }
  }
}

function resetGame() {
  // Reiniciar a posição inicial da cobra e da maçã
  snake = [
    { x: 100, y: 100, color: '#FF1493' }, // Cabeça
    { x: 80, y: 100, color: '#FF1493' }   // Corpo inicial
  ];
  apple = { x: 200, y: 200, color: 'red' };
  direction = 'right';
  score = 0;
  speed = 150;
  // Iniciar o jogo novamente
  gameInterval = setInterval(gameLoop, speed);
  
  // Ocultar o contêiner do game over
  document.getElementById('game-over-container').style.display = 'none';
}

function gameOver() {
  clearInterval(gameInterval);

  // Limpar o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Exibir "Game Over"
  ctx.fillStyle = '#fa76bd';
  ctx.font = '30px Anta';

  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2 - 15);

  // Exibir pontuação final
  ctx.fillStyle = '#fff';
  ctx.font = '17px Arial';
  ctx.fillText('Your Score: ' + score, canvas.width / 2 - 53, canvas.height / 2 + 15);
  
  // Exibir botão "Play Again"
  document.getElementById('play-again').style.display = 'block';

  // Exibir contêiner do game over
  document.getElementById('game-over-container').style.display = 'flex'; // Alterado para 'flex'
  snake.style.display = 'none'
}


// Adicione esta função para começar o jogo apenas quando pressionar a tecla de espaço
function startGame() {
  document.removeEventListener('keydown', startGame); // Remover o ouvinte de tecla inicial
  gameInterval = setInterval(gameLoop, speed); // Iniciar o jogo

  document.getElementById('start-game').style.display = 'none'; // Oculta o botão
   document.removeEventListener('keydown', startGame); // Remove o ouvinte de tecla inicial
}

// Adicione este ouvinte de tecla para começar o jogo quando pressionar a tecla de espaço
document.addEventListener('keydown', function (event) {
  if (event.key === ' ') {
    startGame();
  }
});

function gameLoop() {
  update();
  checkCollision();
  draw();
}

let gameInterval; // Iniciar o jogo
document.getElementById('play-again').style.display = 'none';

