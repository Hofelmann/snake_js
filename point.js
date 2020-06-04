const EMPTY = 0,
	  SNAKE = 1,
	  FOOD = 2;


class Point {
	constructor(x, y, pointType) {
		this.x = x;
		this.y = y;
		this.pointType = pointType;
	}

	set type(pointType) {
		this.pointType = pointType;
	}

	get type() {
		return this.pointType;
	}

	get empty() {
		if (this.pointType === 0) { return true; }
		return false;
	}

	get gridPosition() {
		let gridX = this.x / squareSize;
		let gridY = this.y / squareSize;
		return [gridX, gridY];
	}
}

function heuristic(x1, y1, x2, y2) {
    let a2 = Math.pow(x1 - x2, 2);
    let b2 = Math.pow(y1 - y2, 2);
    return Math.sqrt(a2 + b2);
}

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

	heuristic(goal) {
		let startPos = this.gridPosition;
		let goalPos = goal.gridPosition;
		this.h = heuristic(startPos[0], startPos[1], goalPos[0], goalPos[1]);
	}

	set cost(g) {
		this.g = g;
		this.f = this.h + this.g;
	}

	visit() {
		this.visited = true;
	}
}