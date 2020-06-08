class MinHeap {
    // Initialize null as first entry so we can start using heap at index 1.
    // This is needed to simplify the calculation of parent and child nodes.
    constructor() { 
        this.heap = [null];
    }

    // Swap the node at index small with the node at index big.
    swap(big, small) {
        let temp = this.heap[big];
        this.heap[big] = this.heap[small];
        this.heap[small] = temp;
    }

    // Checks if the f cost of the child is smaller than the parent.
    checkParent(child, parent) {
        if (this.heap[child].f < this.heap[parent].f)
            return true;
        return false;
    }

    // Insert element into heap. Swap untill in the correct position.
    insert(node) {
        this.heap.push(node);
        let current = this.heap.length - 1;
        while (current > 1) {
            // Currently the smallest node.
            if (current === 1)
                break;
            let parent = Math.floor(current / 2);
            // Swap the node if its parent has a higher value.
            if (this.checkParent(current, parent)) {
                this.swap(parent, current);
                current = parent;
            } else {
                break;
            }
        }
    }

    // Remove the smallest item from heap, aka the root.
    pop() {
        // If the heap is already empty, simply return null and do nothing.
        if (this.heap.length === 1)
            return null;
        let min = this.heap[1];
        // Replace first element with last and remove last element.
        this.heap[1] = this.heap[this.heap.length - 1];
        this.heap.pop();
        // Trickle down using backwards method of insert.
        let current = 1;
        while (current < this.heap.length) {
            let child = 2 * current;
            // Currently as low as it can swap to.
            if (child >= this.heap.length)
                break;
            // Check if there are two children and if right one is smaller.
            if (child + 1 < this.heap.length && this.checkParent(child + 1, child))
                child += 1;
            // Check if current is smaller than smallest child.
            if (this.checkParent(child, current)) {
                this.swap(child, current);
                current = child;
            } else {
                break;
            }
        }
        return min;
    }

    // Return the size of the heap.
    size() { 
        return this.heap.length;
    }

    // Check if the given node is already present in the heap.
    inside(node) {
        for (let i = 1; i < this.heap.length; i++) {
            let current = this.heap[i];
            // Node present in heap.
            if (node.x === current.x && node.y === current.y)
                return true;
        }
        return false;
    }
}
