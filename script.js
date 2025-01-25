const canvas = document.getElementById('game-board');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('game-over');

        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        let snake = [{ x: 10, y: 10 }];
        let food = getRandomFood();
        let dx = 1;
        let dy = 0;
        let score = 0;
        let gameOver = false;
        
        // Color palettes for snake and food
        const snakeColors = [
            '#2ecc71', '#27ae60', '#3498db', '#2980b9'
        ];
        const foodColors = [
            '#e74c3c', '#c0392b', '#e67e22', '#d35400'
        ];

        function getRandomFood() {
            return {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        }

        function drawGame() {
            if (gameOver) {
                gameOverElement.style.display = 'block';
                return;
            }

            clearCanvas();
            moveSnake();
            drawSnake();
            drawFood();
            checkCollision();
        }

        function clearCanvas() {
            // Gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f3e7e9');
            gradient.addColorStop(1, '#d3d3d3');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawSnake() {
            snake.forEach((segment, index) => {
                // Alternating colors for snake segments
                ctx.fillStyle = snakeColors[index % snakeColors.length];
                
                // Rounded corners for snake segments
                ctx.beginPath();
                ctx.roundRect(
                    segment.x * gridSize, 
                    segment.y * gridSize, 
                    gridSize - 2, 
                    gridSize - 2,
                    5
                );
                ctx.fill();
            });
        }

        function drawFood() {
            // Randomized food color
            ctx.fillStyle = foodColors[Math.floor(Math.random() * foodColors.length)];
            
            // Star-shaped food
            ctx.beginPath();
            const centerX = (food.x + 0.5) * gridSize;
            const centerY = (food.y + 0.5) * gridSize;
            const outerRadius = gridSize / 2;
            const innerRadius = gridSize / 4;
            const spikes = 5;

            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (Math.PI / spikes) * i;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
        }

        function moveSnake() {
            const head = { 
                x: snake[0].x + dx, 
                y: snake[0].y + dy 
            };
            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
                food = getRandomFood();
            } else {
                snake.pop();
            }
        }

        function checkCollision() {
            const head = snake[0];

            // Wall collision
            if (head.x < 0 || head.x >= tileCount || 
                head.y < 0 || head.y >= tileCount) {
                gameOver = true;
            }

            // Self collision
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver = true;
                }
            }
        }

        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':    
                    if (dy !== 1) { dx = 0; dy = -1; }
                    break;
                case 'ArrowDown':  
                    if (dy !== -1) { dx = 0; dy = 1; }
                    break;
                case 'ArrowLeft':  
                    if (dx !== 1) { dx = -1; dy = 0; }
                    break;
                case 'ArrowRight': 
                    if (dx !== -1) { dx = 1; dy = 0; }
                    break;
            }
        });

        // Game loop
        setInterval(drawGame, 150);