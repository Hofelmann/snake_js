# snake_js
Simple snake game created in javascript.

Contains two variants of the game:
 - game.js, this launches the normal variant of snake and lets you play it using the arrow keys or wasd.
 - astar_snake.js, this launches a simple automatic snake player that uses the a* algorithm to find the best route to the food.
 
Inside astar_snake.js there is an astar class. This class contains the main algortihm for finding the optimal routes.
To run this algortihm you'll need two other classes. The node class that stores location and costs for reaching the node and the min-heap class which is a simple min-heap datastructure with a few modifications to have it work with the node structure mentioned before.
 
Currently the astar algorithm isn't working yet.
You are able to play the base game by simply opening the index.html file.
