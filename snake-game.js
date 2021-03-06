(function(global) {

   var snakeGame = {
	// Canvas properties
	canvas : {
		ctx : $("#canvas")[0].getContext("2d"),
		width : $("#canvas").width(),
		height : $("#canvas").height()
	},

	//Lets save the cell width in a variable for easy control
	cellWidth : 10,

	//Lets create the snake now
	snake : [], //an array of cells to make up the snake
	
	//Best score
	best: 0,
	
	//Direction
	d: "",
	
	init: function() {
		this.d = "right"; //default direction
		this.createSnake();
		this.createFood(); //Now we can see the food particle
		//finally lets display the score
		this.score = 0;

		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		this.paint();
		
		if (typeof this.gameLoop != "undefined")
			clearInterval(this.gameLoop);
		
		setTimeout(function () {
			snakeGame.gameLoop = setInterval("snakeGame.paint()", 60);
			$('#displayBoard').html("Play...");
		}, 2200);
      
       this.attachListeners();
	},

	createSnake : function () {
		var length = 5; //Length of the snake
		this.snake = []; //Empty array to start with
		for (var i = length - 1; i >= 0; i--) {
			//This will create a horizontal snake starting from the top left
			this.snake.push({
				x : i,
				y : 0
			});
		}
	},

	//Lets first create a generic function to paint cells
	paintCell : function (x, y) {
		this.canvas.ctx.fillStyle = "blue";
		this.canvas.ctx.fillRect(x * this.cellWidth, y * this.cellWidth, this.cellWidth, this.cellWidth);
		this.canvas.ctx.strokeStyle = "white";
		this.canvas.ctx.strokeRect(x * this.cellWidth, y * this.cellWidth, this.cellWidth, this.cellWidth);
	},

	//Lets create the food now
	createFood : function () {
		this.food = {
			x : Math.round(Math.random() * (this.canvas.width - this.cellWidth) / this.cellWidth),
			y : Math.round(Math.random() * (this.canvas.height - this.cellWidth) / this.cellWidth),
		};
		//This will create a cell with x/y between 0-49
		//Because there are 500(500/10) positions across the rows and columns
	},

	checkCollision : function (x, y, array) {
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for (var i = 0; i < array.length; i++) {
			if (array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	},
  
  
    attachListeners: function(){
        var that = this;
      
      // Avoid general arrow key functionality
       var keys = {};
      
        window.addEventListener("keydown",
                                function (e) {
          keys[e.keyCode] = true;
          switch (e.keyCode) {
            case 37:
            case 39:
            case 38:
            case 40: // Arrow keys
            case 32:
              e.preventDefault();
              
            if (e.keyCode == "37" && that.d != "right")
                that.d = "left";
            else if (e.keyCode == "38" && that.d != "down")
                that.d = "up";
            else if (e.keyCode == "39" && that.d != "left")
                that.d = "right";
            else if (e.keyCode == "40" && that.d != "up")
                that.d = "down";
              
              break; // Space
            default:
              break; // do not block other keys
          }
        },
	false);
      
      window.addEventListener('keyup',
                              function (e) {
        keys[e.keyCode] = false;
      },
	false);
    },
	
	//Lets paint the snake now
	paint: function() {
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		this.canvas.ctx.fillStyle = "white";
		this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.canvas.ctx.strokeStyle = "black";
		this.canvas.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = this.snake[0].x;
		var ny = this.snake[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if (this.d == "right")
			nx++;
		else if (this.d == "left")
			nx--;
		else if (this.d == "up")
			ny--;
		else if (this.d == "down")
			ny++;

		//Lets add the game over clauses now
		//This will restart the game if the snake hits the wall
		//Lets add the code for body collision
		//Now if the head of the snake bumps into its body, the game will restart
		if (nx == -1 || nx == this.canvas.width / this.cellWidth || ny == -1 || ny == this.canvas.height / this.cellWidth || this.checkCollision(nx, ny, this.snake)) {
			if(this.best<this.score){
				this.best = this.score;
				$('#best-score').text(this.best);
			}
				
			//restart game
			$('#displayBoard').html("Next game starts in next 3 secs");
			this.init();
			//Lets organize the code a bit now.
			return;
		}

		//Lets write the code to make the snake eat the food
		//The logic is simple
		//If the new head position matches with that of the food,
		//Create a new head instead of moving the tail
		if (nx == this.food.x && ny == this.food.y) {
			var tail = {
				x : nx,
				y : ny
			};
			this.score++;
			//Create new food
			this.createFood();
		} else {
			var tail = this.snake.pop(); //pops out the last cell
			tail.x = nx;
			tail.y = ny;
		}
		//The snake can now eat the food.

		this.snake.unshift(tail); //puts back the tail as the first cell

		for (var i = 0; i < this.snake.length; i++) {
			var c = this.snake[i];
			//Lets paint 10px wide cells
			this.paintCell(c.x, c.y);
		}

		//Lets paint the food
		this.paintCell(this.food.x, this.food.y);
		//Display score
		$("#score").text(this.score);
	}


};

    global.snakeGame = snakeGame;
})(this)
