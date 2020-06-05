class Snake {
    constructor(){
        this.reset();
    }
    // Draws everything onto the canvas.
    draw() {
        // Draw snake
        for(let i = 0; i < this.body.length; i++) {
            context.fillStyle = "#FFF";
            let x = this.body[i][0];
            let y = this.body[i][1];
            context.fillRect(grid[x][y].x, grid[x][y].y, squareSize, squareSize);
        }
        // Draw food
        context.fillStyle = "#32a852";
        let x = this.food[0];
        let y = this.food[1];
        context.fillRect(grid[x][y].x, grid[x][y].y, squareSize, squareSize);
    }

    // Place food on the grid.
    placeFood() {
        while(true) {
            let x = Math.floor(Math.random() * gridSize);
            let y = Math.floor(Math.random() * gridSize);
            if (grid[x][y].empty) {
                this.food = [x, y];
                grid[x][y].type = FOOD;
                return;
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
        if (this.lastDirection[1] !== 1) { this.direction = [0, -1]; }
    }

    // See goNorth()
    goEast() {
        if (this.lastDirection[0] !== -1) { this.direction = [1, 0]; }
    }

    // See goNorth()
    goSouth() {
        if (this.lastDirection[1] !== -1) { this.direction = [0, 1]; }
    }

    // See goNorth()
    goWest() {
        if (this.lastDirection[0] !== 1) { this.direction = [-1, 0]; }
    }
}