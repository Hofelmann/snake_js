const canvas = document.getElementById("snake_canvas");
const gridSize = 30;
const screenWidth = Math.floor(window.innerWidth / gridSize) * gridSize;
const screenHeight = Math.floor(window.innerHeight / gridSize) * gridSize;
var squareSize;

// Create a square canvas based on either height or width, which ever is smaller.
if (screenHeight < screenWidth) {
	let perc = screenHeight / screenWidth * 100;
	canvas.height = screenHeight;
	canvas.width = screenHeight;
	canvas.style.width = perc+"%";
	canvas.style.height = "100%";
	squareSize = screenHeight / gridSize;
} else {
	let perc = screenWidth / screenHeight * 100;
	canvas.height = screenWidth;
	canvas.width = screenWidth;
	canvas.style.width = "100%";
	canvas.style.height = perc+"%";
	squareSize = screenWidth / gridSize;
}
const context = canvas.getContext("2d");

// Create a grid of points, the points contain data about this place in the grid
// For example the actual x and y of the point on the canvas and what kind
// of point they are. 0 equals nothing for instance.
var grid = [];
for (let i = 0; i < gridSize; i++) {
	let column = []
	for (let j = 0; j < gridSize; j++) {
		let x = i * squareSize;
		let y = j * squareSize;
		column.push(new Point(x, y, 0));
	}
	grid.push(column)
}

function clearGrid() {
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			grid[i][j].type = EMPTY;
		}
	}
}

var snake = new Snake();

(function setup() {
    // Main loop to operate snake and place new food.
    window.setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        snake.draw();
    }, 200);
}());

window.addEventListener("keydown", event => {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            snake.goNorth();
            break;
        case "s":
        case "ArrowDown":
            snake.goSouth();
            break;
        case "d":
        case "ArrowRight":
            snake.goEast();
            break;
        case "a":
        case "ArrowLeft":
            snake.goWest();
            break;
        default:
            break;
    }
});