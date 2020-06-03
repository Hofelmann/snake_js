// Heuristic function based on straight line
function heuristic(x1, y1, x2, y2) {
    let a2 = Math.pow(x1 - x2, 2);
    let b2 = Math.pow(y1 - y2, 2);
    return Math.sqrt(a2 + b2);
}

// Simple node class. Always has a position on the grid
// Can have a parent, actual cost,heuristic cost and total cost.
class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.parent = null;
        // Initiate costs as a very high number.
        this.g = Math.pow(10,10);
        this.h = Math.pow(10,10);
        this.f = Math.pow(10,10);   
    }

    // Set the costs. If no parent is set, the cost will become infinity.
    set_costs(goalX, goalY, g) {
        this.h = heuristic(this.x, this.y, goalX, goalY);
        this.g = g;
        this.f = this.h + g;
    }

    get_neighbours() {
        let offsets = [[10, 0], [-10, 0], [0, 10], [0, -10]];
        let neighbours = []
        for (let i = 0; i < offsets.length; i++) {
            let n = new Node(this.x + offsets[i][0], this.y + offsets[i][1]);
            neighbours.push(n);
        }
        return neighbours;
    }

    // Check if this node equals the given node.
    equals(node) {
        if (this.x === node.x && this.y === node.y) { return true; }
        return false;
    }
}
