// This variable is used in game.js to check if this file is included.
const astarEnabled = true;

const c_path = "#f542d4";

// Draw the path that astar has found.
// TODO: Move drawing to a drawing focused file / area for all elements.
function drawPath(p) {
    for (let i = 0; i < p.length; i++) {
        context.fillStyle = c_path;
        context.fillRect(p[i].x + 5, p[i].y + 5, 20, 20);
    }
}

class AStar {
    constructor() {
        this.solution = [];
    }

    // Return next step and remove it from solutions array.
    step(snake) {
        // Somehow the steps did not lead to the food, figure out a new route.
        // If there is no route, simple self avoidance will be used.
        if (this.solution.length === 0)
            this.solve(snake.body[0][0], snake.body[0][1], snake.food[0], snake.food[1])
        let diff = this.solution.pop();
        // No path was found even when using avoidance.
        if (!diff)
            return;
        // There can only be a move in 1 direction.
        // Thus if diffX is 0 than the change is in the y direction.
        if (diff[0] === 0) {
            if (diff[1] > 0)
                snake.goSouth();
            else
                snake.goNorth();
        }
        else if (diff[0] > 0)
            snake.goEast();
        else
            snake.goWest();
        return
    }

    // Convert the found path to an array of differences.
    convertPath(p) {
        let steps = [];
        let current = p.pop()
        let len = p.length;
        for (let i = 0; i < len; i++) {
            let next = p.pop();
            let diffX = next.x - current.x;
            let diffY = next.y - current.y;
            steps.push([diffX, diffY]);
            current = next;
        }
        this.solution = steps.reverse();
    }

    // Traverses the given node all the way up to the first parent
    // Returns the reversed lists with the path from start to finish.
    createPath(point) {
        let p = [];
        while (point !== null) {
            p.push(point);
            point = point.parent;
        }
        this.route = p.slice();
        this.convertPath(p)
    }

    // Checks if the current node is a valid, passable, position.
    isValid(point) {
        let pPos = point.gridPosition;
        if (grid[pPos[0]][pPos[1]].type === SNAKE) { return false; }
        return true;
    }

    // Add a single step to the solution to avoid any blocks that will reset
    // the snake. Not the optimal solution but it works well enough.
    // Checks if it has a valid neighbour(1), if this neigbour has 2 valid
    // neighbours(2) of itself, choose neighbour(1) as the next step.
    avoid(current) {
        current.parent = null;
        if (!current.n) {
            current.neighbours();
        }
        for (let i = 0; i < current.n.length; i++) {
            let n = current.n[i];
            if (this.isValid(n)){
                // Is this neighbour has at least 2 valid neighbours.
                if (!n.n) {
                    n.neighbours();
                }
                let valids = 0;
                for (let j = 0; j < n.n.length; j++) {
                    if (this.isValid(n.n[j])) { valids++; }
                    if (valids > 1) {
                        n.parent = current;
                        this.createPath(n);
                        return;
                    }
                }
            }
        }
    }

    // Find the best route from start to goal using a* algorithm.
    // Uses custom node and min-heap structure.
    solve(startX, startY, goalX, goalY) {
        // First clear the grid of any previous values.
        clearGrid(false);

        // Set starting values.
        this.goal = grid[goalX][goalY];
        let goalPos = this.goal.gridPosition;
        let start = grid[startX][startY];
        start.heuristic(this.goal);
        start.cost = 0;
        start.visit();
        // List of discovered nodes, currently only the starting node.
        let disc = new MinHeap();
        disc.insert(start);

        // The heap will always have 1 element in it that is null.
        while (disc.size() > 1) {
            let current = disc.pop();
            let cPos = current.gridPosition;
            // Check if it has reached the goal point.
            if (cPos[0] === goalPos[0] && cPos[1] === goalPos[1]) {
                this.createPath(current);
                return;
            }

            // Generate neighbours if this hasn't been done before.
            if (!current.n) {
                current.neighbours();
            }
            let neighbours = current.n;
            for (let i = 0; i < neighbours.length; i++) {
                // Check if the current neighbour is able to be used as a path.
                let n = neighbours[i];
                if (!this.isValid(n)){
                    continue;
                }

                let cost = current.g + 1;

                // If it has been visited before but this path is shorter.
                if (n.visited) {
                    if (cost < n.g) {
                        n.parent = current;
                        n.heuristic(this.goal);
                        n.cost = cost;

                        if (!disc.inside(n)) { disc.insert(n); }
                    }
                }
                // The path has not been visited before.
                else {
                    n.parent = current;
                    n.heuristic(this.goal);
                    n.cost = cost;
                    n.visit();
                    disc.insert(n);
                }
            }
        }
        // No route has been found, try to avoid any snake blocks.
        this.avoid(start);
        return;
    }
}