class SnakeGame {
    constructor() {
        // DOM Elements
        this.canvasElem = document.getElementById("canvas");
        this.scoreElem = document.getElementById("score");
        this.bestScoreElem = document.getElementById("best-score");
        this.displayBoardElem = document.getElementById("displayBoard");

        // Canvas properties
        this.canvas = {
            ctx: this.canvasElem.getContext("2d"),
            width: this.canvasElem.width,
            height: this.canvasElem.height,
        };

        // Game properties
        this.cellWidth = 10;
        this.snake = [];
        this.best = 0;
        this.d = "";
        this.score = 0;
        this.gameLoop = null;

        this.attachListeners();
    }

    init() {
        this.d = "right"; // default direction
        this.createSnake();
        this.createFood();
        this.score = 0;

        this.paint();

        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        setTimeout(() => {
            this.gameLoop = setInterval(() => this.paint(), 60);
            this.displayBoardElem.innerHTML = "Play...";
        }, 2200);
    }

    createSnake() {
        var length = 5;
        this.snake = [];
        for (var i = length - 1; i >= 0; i--) {
            this.snake.push({
                x: i,
                y: 0,
            });
        }
    }

    paintCell(x, y) {
        this.canvas.ctx.fillStyle = "blue";
        this.canvas.ctx.fillRect(
            x * this.cellWidth,
            y * this.cellWidth,
            this.cellWidth,
            this.cellWidth,
        );
        this.canvas.ctx.strokeStyle = "white";
        this.canvas.ctx.strokeRect(
            x * this.cellWidth,
            y * this.cellWidth,
            this.cellWidth,
            this.cellWidth,
        );
    }

    createFood() {
        this.food = {
            x: Math.round(
                (Math.random() * (this.canvas.width - this.cellWidth)) /
                this.cellWidth,
            ),
            y: Math.round(
                (Math.random() * (this.canvas.height - this.cellWidth)) /
                this.cellWidth,
            ),
        };
    }

    checkCollision(x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y) return true;
        }
        return false;
    }

    attachListeners() {
        var keys = {};

        window.addEventListener(
            "keydown",
            (e) => {
                keys[e.keyCode] = true;
                switch (e.keyCode) {
                    case 37:
                    case 39:
                    case 38:
                    case 40: // Arrow keys
                    case 32:
                        e.preventDefault();

                        if (e.keyCode == "37" && this.d != "right") this.d = "left";
                        else if (e.keyCode == "38" && this.d != "down") this.d = "up";
                        else if (e.keyCode == "39" && this.d != "left") this.d = "right";
                        else if (e.keyCode == "40" && this.d != "up") this.d = "down";

                        break;
                    default:
                        break;
                }
            },
            false,
        );

        window.addEventListener(
            "keyup",
            (e) => {
                keys[e.keyCode] = false;
            },
            false,
        );
    }

    paint() {
        this.canvas.ctx.fillStyle = "white";
        this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.ctx.strokeStyle = "black";
        this.canvas.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        var nx = this.snake[0].x;
        var ny = this.snake[0].y;

        if (this.d == "right") nx++;
        else if (this.d == "left") nx--;
        else if (this.d == "up") ny--;
        else if (this.d == "down") ny++;

        if (
            nx == -1 ||
            nx == this.canvas.width / this.cellWidth ||
            ny == -1 ||
            ny == this.canvas.height / this.cellWidth ||
            this.checkCollision(nx, ny, this.snake)
        ) {
            if (this.best < this.score) {
                this.best = this.score;
                this.bestScoreElem.textContent = this.best;
            }

            this.displayBoardElem.innerHTML = "Next game starts in next 3 secs";
            this.init();
            return;
        }

        var tail;
        if (nx == this.food.x && ny == this.food.y) {
            tail = {
                x: nx,
                y: ny,
            };
            this.score++;
            this.createFood();
        } else {
            tail = this.snake.pop();
            tail.x = nx;
            tail.y = ny;
        }

        this.snake.unshift(tail);

        for (var i = 0; i < this.snake.length; i++) {
            var c = this.snake[i];
            this.paintCell(c.x, c.y);
        }

        this.paintCell(this.food.x, this.food.y);
        this.scoreElem.textContent = this.score;
    }
}

// Initialize the game when DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const game = new SnakeGame();
    game.init();
});
