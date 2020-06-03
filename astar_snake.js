class AStar {
    constructor() {
        this.impassable;
        this.borders;
        this.solution = [];
    }

    // Return next step and remove it from solutions array.
    step() {
        // Somehow the steps did not lead to the food, figure out a new route.
        if (this.solution.length < 1) {
            this.solve(snake.body[0][0], snake.body[0][1], snake.food[0], snake.food[1])
        }
        let diff = this.solution.pop();
        // There can only be a move in 1 direction.
        // Thus if diffX is 0 than the change is in the y direction.
        if (diff[0] === 0) {
            if (diff[1] === 10) {
                snake.goSouth();
            } else {
                snake.goNorth();
            }
        }
        else if (diff[0] === 10) {
            snake.goEast();
        } else {
            snake.goWest();
        }
    }

    convertPath(path) {
        let steps = [];
        let current = path.pop()
        let len = path.length;
        for (let i = 0; i < len; i++) {
            let next = path.pop();
            let diffX = next.x - current.x;
            let diffY = next.y - current.y;
            steps.push([diffX, diffY]);
            current = next;
        }
        this.solution = steps;
    }

    // Traverses the given node all the way up to the first parent
    // Returns the reversed lists with the path from start to finish.
    getPath(node) {
        let path = [];
        while (node !== null) {
            path.push(node);
            node = node.parent;
        }
        this.convertPath(path)
    }

    // Set the canvas borders and impassable blocks on the canvas.
    setBarriers(width, height, blocks) {
        this.impassable = blocks;
        this.borders = [width, height];
    }

    // Checks if the current node is a valid, passable, position.
    isValid(node) {
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
        start.setCosts(goalX, goalY, 0);

        this.goal = new Node(goalX, goalY);
        console.log("Goal:")
        console.log(this.goal);
        console.log("Start:")
        console.log(start)

        // List of discovered nodes, currently only the starting node.
        let disc = new MinHeap();
        disc.insert(start);

        let visited = [start];

        // The heap will always have 1 element in it that is null.
        while (disc.size() > 1) {
            let current = disc.pop();

            // Arrived at goal node. Return parent path in reverse.
            if (current.equals(this.goal)) {
                this.getPath(current);
                return;
            }

            let neighbours = current.getNeighbours();
            for (let i = 0; i < neighbours.length; i++) {
                // Check if the current neighbour is able to be used as a path.
                let n = neighbours[i];
                if (!this.isValid(n)){
                    continue;
                }

                let cost = current.g + 10;

                // Check if this node was known before.
                // If it was and it's new cost is lower, change it and add to discovered.
                let found = false;
                for (let j = 0; j < visited.length; j++) {
                    let v = visited[j];
                    if (v.x === n.x && v.y === n.y) {
                        found = true;
                        if (cost < v.g) {
                            v.parent = current;
                            v.setCosts(goalX, goalY, cost);

                            if (!disc.inside(v)) { disc.insert(v); }
                        }
                        break;
                    }
                }
                // The node has not been found before, add it as a new possible path.
                if (!found) {
                    n.parent = current;
                    n.setCosts(goalX, goalY, cost);
                    disc.insert(n);
                    visited.push(n);
                }
            }
        }
        // No route has been found.
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
    let lastFood = snake.food;
    let borders = [canvas.width, canvas.height];
    let head = snake.body[0]
    astar.setBarriers(borders[0], borders[1], snake.body.slice(1));
    astar.solve(head[0], head[1], snake.food[0], snake.food[1]);

    window.setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        // Check if the current food block has been eaten, if so run a*.
        if (lastFood[0] !== snake.food[0] && lastFood[1] !== snake.food[1]) {
            astar.setBarriers(borders[0], borders[1], snake.body.slice(1));
            astar.solve(snake.body[0][0], snake.body[0][0], snake.food[0], snake.food[1]);
            lastFood = snake.food;
        }
        astar.step();
        snake.draw();
    }, 150);
}());