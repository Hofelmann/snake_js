const canvas = document.querySelector("canvas.snake");
const squareSize = 10;
const context = canvas.getContext("2d");

var snake;

(function setup() {
    snake = new Snake();

    // Main loop to operate snake and place new food.
    window.setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        snake.draw();
    }, 150);
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