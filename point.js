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
}