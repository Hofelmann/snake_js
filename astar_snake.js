class AStar {
    constructor() {
        this.impassable;
        this.borders;
        this.solution = [];
    }

    // Return next step and remove it from solutions array.
    step() {
        if (solution.length < 1) {
            return;
        }
        return this.solution.pop();
    }

    // Converts path of nodes into array of key presses.
    convert_to_steps(path) {
        let steps = []
        let current = path[0];
        for (let i = 1; i < path.length; i++) {
            let next = path[i];
            let xDiff = next.x - current.x;
            if (xDiff === 0) {
                // Move is not in x direction, so either yDiff = 1 or -1.
                let yDiff = next.y - current.y;
                if (yDiff === 1) {
                    steps.push("s");
                } else {
                    steps.push("w");
                }
            }
            else if (xDiff === 1) {
                steps.push("d")
            } else {
                steps.push("a")
            }
            current = next;
        }
        console.log(steps)
        this.solution = steps.reverse();
    }

    // Traverses the given node all the way up to the first parent
    // Returns the reversed lists with the path from start to finish.
    get_path(node) {
        let path = [this.goal];
        while (node !== null) {
            path.push(node);
            node = node.parent;
        }
        path = path.reverse();
        this.convert_to_steps(path);
    }

    // Set the canvas borders and impassable blocks on the canvas.
    set_barriers(width, height, blocks) {
        this.impassable = blocks;
        this.borders = [width, height];
    }

    // Checks if the current node is a valid, passable, position.
    is_valid(node, prev) {
        // Check if it is withing the borders.
        if (node.x < 0 || node.x > this.borders[0] - squareSize) { return false; }
        if (node.y < 0 || node.y > this.borders[1] - squareSize) { return false; }
        // Check if the position matches any of the impassable blocks.
        for (let i = 0; i < this.impassable.length; i++) {
            let block = this.impassable[i];
            if (node.x === block[0] && node.y === block[1]) { return false; }
        }
        return true;
    }

    // Find the best route from start to goal using a* algorithm.
    // Uses custom node and min-heap structure.
    solve(startX, startY, goalX, goalY) {
        let start = new Node(startX, startY);
        start.set_costs(goalX, goalY, 0);

        this.goal = new Node(goalX, goalY);

        // List of discovered nodes, currently only the starting node.
        let disc = new MinHeap();
        disc.insert(start);
        let prev = null;

        // The heap will always have 1 element in it that is null.
        while (disc.size() > 1) {
            let current = disc.pop();
            console.log(current.x, current.y, current.h);
            // Arrived at goal node. Return parent path in reverse.
            if (current.equals(this.goal)) {
                console.log("Path found!");
                this.get_path(current);
                return;
            }

            let neighbours = current.get_neighbours();
            for (let i = 0; i < neighbours.length; i++) {
                // Check if the current neighbour is able to be used as a path.
                let n = neighbours[i];
                if (!this.is_valid(n, prev)){
                    prev = current;
                    continue;
                }
                let cost = current.g + 10;
                if (cost < n.g) {
                    n.parent = current;
                    n.set_costs(goalX, goalY, cost);

                    if (!disc.inside(n)) { disc.insert(n); }
                }
            }
            prev = current;
        }
        // No route has been found.
        console.log("No path :(")
        return
    }
}



const canvas = document.querySelector("canvas.snake");
const squareSize = 10;
const context = canvas.getContext("2d");

var snake;
var astar;

(function setup() {
    astar = new AStar();
    snake = new Snake();
    console.log(snake.body)
    let lastFood = snake.food;
    let borders = [canvas.width, canvas.height];
    let head = snake.body[0]
    astar.set_barriers(borders[0], borders[1], snake.body.slice(1));
    console.log("Starting solver...");
    astar.solve(head[0], head[1], lastFood[0], lastFood[1]);
    console.log("Done solving...");
    console.log(astar.solution);

    // window.setInterval(() => {
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     snake.update();
    //     // Check if the current food block has been eaten, if so run a*.
    //     if (lastFood[0] !== snake.food[0] && lastFood[1] !== snake.food[1]) {
    //         astar.set_barriers(borders[0], borders[1], snake.body.slice(1));
    //         astar.solve(snake.body[0][0], snake.body[0][0], lastFood[0], lastFood[1]);
    //     }
    //     snake.changeDirection(astar.step());
    //     snake.draw();
    // }, 150);
}());