// Types of points.
const EMPTY = 0,
	  SNAKE = 1,
	  FOOD = 2;

// Points class. Saves the location and type of point.
class Point {
	constructor(x, y, pointType) {
		this.x = x;
		this.y = y;
		this.pointType = pointType;
	}

	// Set the point type.
	set type(pointType) {
		this.pointType = pointType;
	}

	// Return the point type.
	get type() {
		return this.pointType;
	}

	// Check if this point is an empty node or not.
	get empty() {
		if (this.pointType === 0) { return true; }
		return false;
	}

	// Returns the points position in the grid.
	get gridPosition() {
		let gridX = this.x / squareSize;
		let gridY = this.y / squareSize;
		return [gridX, gridY];
	}
}

// Heuristic function that calculates the euclidian distance from 1 to 2.
function heuristic(x1, y1, x2, y2) {
    let a2 = Math.pow(x1 - x2, 2);
    let b2 = Math.pow(y1 - y2, 2);
    return Math.sqrt(a2 + b2);
}

// Point class extended for astar.
class AStarPoint extends Point {
	constructor(x, y, pointType) {
		super(x, y, pointType);
        // Initiate costs as a very high number.
		this.g = Math.pow(10, 3);
		this.h = Math.pow(10, 3);
		this.f = Math.pow(10, 3);
		this.parent = null;
		this.n = null;
		this.visited = false;
	}

	// Reset the node to it's base values.
	// Note: The neighbours do not get reset.
	// The location of points does not change on the grid.
	// Because of this the neighbours don't change either.
	reset() {
		this.g = Math.pow(10, 3);
		this.h = Math.pow(10, 3);
		this.f = Math.pow(10, 3);
		this.parent = null;
		this.visited = false;
	}

	// Get all the neighbours inside of the grid of this point.
	neighbours() {
		let n = [];
		let offsets = [[1, 0], [-1, 0], [0, 1], [0, -1]];
		let gridPos = this.gridPosition;
		for (let i = 0; i < offsets.length; i++) {
			let nX = gridPos[0] + offsets[i][0];
			let nY = gridPos[1] + offsets[i][1];

			// Check if the neighbour is in the grid.
			if (nX < 0 || nX >= gridSize || nY < 0 || nY >= gridSize) {
				continue;
			}
			n.push(grid[nX][nY]);
		}
		this.n = n;
	}

	// Calculate the heuristic to the goal point from this point.
	heuristic(goal) {
		let startPos = this.gridPosition;
		let goalPos = goal.gridPosition;
		this.h = heuristic(startPos[0], startPos[1], goalPos[0], goalPos[1]);
	}

	// Set the actual cost to get to this node.
	// Also changes the heuristic + actual cost accordingly.
	set cost(g) {
		this.g = g;
		this.f = this.h + this.g;
	}

	// Visit the node.
	visit() {
		this.visited = true;
	}
}