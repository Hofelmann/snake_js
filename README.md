# snake_js
Simple snake game created in javascript.

When astar_snake.js is not included in the root directory, you're able to play the game yourself.
If it is included, the snake will try to solve itself the best it can.

To solve its path it uses the A* algortihm. This is not the best algorithm for this job but its the one I wanted to implement. Using a hamiltonian cycle that visites every space would work better for example, but it's less fun.
When no path is found the snake goes into evasion mode, simply checking if the next neighbour has an entry and exit. If it does it moves to it, if not it checks another neighbour.
