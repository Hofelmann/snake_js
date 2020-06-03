class Snake {
    constructor(){
        this.reset();
    }
    // Draws everything onto the canvas.
    draw() {
        // Draw snake
        context.fillStyle = "#FFF";
        context.fillRect(this.x, this.y, squareSize, squareSize);
        for(let i = 0; i < this.body.length; i++) {
            context.fillStyle = "#FFF";
            let x = this.body[i][0];
            let y = this.body[i][1];
            context.fillRect(x, y, squareSize, squareSize);
        }
        // Draw food
        context.fillStyle = "#32a852";
        context.fillRect(this.food[0], this.food[1], squareSize, squareSize);
    }

    // Place food on the grid.
    placeFood() {
        let x = Math.floor(Math.random() * canvas.width / 10) * 10 - squareSize;
        let y = Math.floor(Math.random() * canvas.height / 10) * 10 - squareSize;
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        this.food = [x, y];
    }

    // Resets all snake values for fresh spawn.
    reset() {
        let x = Math.floor(Math.random() * canvas.width / 10) * 10 - squareSize;
        let y = Math.floor(Math.random() * canvas.height / 10) * 10 - squareSize;
        if (x < 0) { x = 0; }
        if (y < 0) { y = 0; }
        this.speed = squareSize;
        this.body = [[x, y]];

        // Choose one of the four starting directions.
        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        let index = Math.floor(Math.random() * directions.length);
        this.direction = directions[index];
        this.placeFood();
    }

    // Move into direction that is not equal to 0.
    move() {
        let x = this.body[0][0] + this.direction[0] * this.speed;
        let y = this.body[0][1] + this.direction[1] * this.speed;
        this.body = [[x, y]].concat(this.body);
    }

    // Update the snakes position and check if it has died.
    update() {
        this.move();

        let x = this.body[0][0];
        let y = this.body[0][1];

        // If the snake is outside the canvas boundaries, respawn.
        if (x < 0 || x >= canvas.width - squareSize) {
            this.reset();
            return;

        }
        else if (y < 0 || y >= canvas.height - squareSize) {
            this.reset();
            return;
        }

        // If snake is in it's own body, respawn.
        for (let i = 1; i < this.body.length; i++) {
            if (x === this.body[i][0] && y === this.body[i][1]) {
                this.reset();
                return;
            }
        }

        // If snake is ontop of food, eat food and spawn new food.
        if (x === this.food[0] && y === this.food[1]) {
            this.placeFood();
        } else {
            this.body.pop();
        }
    }

    // Uses input key string to determine the new direction.
    // Direction flipping is not possible, one must turn.
    changeDirection(direction) {
        switch (direction) {
            case "w":
            case "ArrowUp":
                if (this.direction[1] !== 1){
                    this.direction = [0, -1];
                }
                break;
            case "s":
            case "ArrowDown":
                if (this.direction[1] !== -1) {
                   this.direction = [0, 1];
                }
                break;
            case "d":
            case "ArrowRight":
                if (this.direction[0] !== -1) {
                    this.direction = [1, 0];
                }
                break;
            case "a":
            case "ArrowLeft":
                if (this.direction[0] !== 1) {
                    this.direction = [-1, 0];
                }
                break;
            // If the pressed key is not arrow keys or wasd, simply do nothing.
            default:
                break;
        }
    }
}