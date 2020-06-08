const c_snake = "#FFF",
      c_food = "#32a852";

// Shuffle array using Fisher-yates shuffle method.
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * i);
        let temp = arr[i];
        arr[i] = arr[j]
        arr[j] = temp;
    }
}

class Snake {
    // Does the same as this.reset(). Copied for readabillity.
    constructor(){
        clearGrid(true);
        let pos = Math.floor((gridSize - 1) / 2);
        grid[pos][pos].type = SNAKE;
        this.speed = 1;
        this.body = [[pos, pos]];
        this.direction = [1, 0];
        this.lastDirection = this.direction;
        this.placeFood();
    }
    // Draws everything onto the canvas.
    // TODO: Move drawing to a drawing focused file / area for all elements.
    draw() {
        // Draw snake
        for(let i = 0; i < this.body.length; i++) {
            context.fillStyle = c_snake;
            let x = this.body[i][0];
            let y = this.body[i][1];
            context.fillRect(grid[x][y].x, grid[x][y].y, squareSize, squareSize);
        }
        // Draw food
        context.fillStyle = c_food;
        let x = this.food[0];
        let y = this.food[1];
        context.fillRect(grid[x][y].x, grid[x][y].y, squareSize, squareSize);
    }

    // Place food on the grid.
    placeFood() {
        // Create two arrays of that count from 0 to gridsize and shuffle them.
        let xs = [...Array(gridSize).keys()];
        let ys = xs.slice();
        shuffle(xs);
        shuffle(ys);

        // Loop over the arrays untill an empty cell is found.
        for (let i = 0; i < xs.length; i++) {
            for (let j = 0; j < ys.length; j++) {
                let x = xs[i];
                let y = ys[i];
                if (grid[x][y].empty) {
                    this.food = [x, y];
                    grid[x][y].type = FOOD;
                    return;
                }
            }
        }
    }

    // Resets all snake values for fresh spawn.
    reset() {
        clearGrid(true);
        let pos = Math.floor((gridSize - 1) / 2);
        grid[pos][pos].type = SNAKE;
        this.speed = 1;
        this.body = [[pos, pos]];
        this.direction = [1, 0];
        this.lastDirection = this.direction;
        this.placeFood();
    }

    // Update the snakes position and check if it has died.
    update() {
        let x = this.body[0][0] + this.direction[0] * this.speed;
        let y = this.body[0][1] + this.direction[1] * this.speed;

        // If the snake is outside the grid boundaries.
        if (x < 0 || x >= gridSize) {
            this.reset();
            return;

        }
        else if (y < 0 || y >= gridSize) {
            this.reset();
            return;
        }

        // Check if the snake hit itself.
        if (grid[x][y].type === SNAKE) {
            this.reset();
            return;
        }

        // If snake is ontop of food, eat food and spawn new food.
        if (grid[x][y].type === FOOD) {
            this.placeFood();
        } else {
            let popped = this.body.pop();
            grid[popped[0]][popped[1]].type = EMPTY;           
        }
        
        // Save the new snake
        grid[x][y].type = SNAKE;
        this.body = [[x, y]].concat(this.body);

        // Save the last direction.
        this.lastDirection = this.direction;
    }

    // Directional functions below. Simply changes the direction of the snake.
    goNorth() {
        // Check if the last direction is not the opposite of new direction.
        // This move would be impossible in snake.
        if (this.lastDirection[1] !== 1)
            this.direction = [0, -1];
    }

    // See goNorth()
    goEast() {
        if (this.lastDirection[0] !== -1)
            this.direction = [1, 0];
    }

    // See goNorth()
    goSouth() {
        if (this.lastDirection[1] !== -1)
            this.direction = [0, 1];
    }

    // See goNorth()
    goWest() {
        if (this.lastDirection[0] !== 1)
            this.direction = [-1, 0];
    }
}