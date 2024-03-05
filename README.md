# Pathfinding Visualizer

This is a visualization tool designed to demonstrate the inner workings of various pathfinding algorithms as they navigate from point A to point B. It also offers an engaging look at different maze/pattern generation algorithms and how they craft intricate mazes/patterns. Explore and enjoy the tool!

## Live Demo

[View Live Site Here](https://tylermommsen-pathfinding-visualizer.vercel.app/)

## Built With

<div>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="react icon">
  </br>
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript icon">
  </br>
  <img src="https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white" alt="sass icon">
</div>

## Pathfinding Algorithms

- **A\*** - A\* pathfinding is a heuristic algorithm that efficiently finds the shortest path from a start to a target node in a graph. It evaluates nodes based on their current cost and an estimated remaining cost to the target.

- **Dijkstra** - Dijkstra's algorithm finds the shortest path from a start node to all other nodes in a weighted graph. It maintains a priority queue of nodes, continually updating the shortest known distance from the start. It explores nodes with the lowest distance first, guaranteeing an optimal path when finished.

- **Bidirectional Search** - Bidirectional search simultaneously explores from both the start and target nodes in a graph. It aims to meet in the middle, reducing the search space and finding the shortest path faster than traditional search methods like Dijkstra's or A\*.

## Maze/Pattern Algorithms

- **Recursive Division** - Recursive division maze generation splits a maze into sections with walls, then recursively divides those sections with walls perpendicular to each other, creating a maze pattern. It repeats until the desired level of complexity is achieved, generating intricate mazes.

- **Binary Tree** - Binary tree maze generation builds a maze by dividing it into a grid. It starts at the top-left corner, then randomly carves a passage either to the right or downward, repeating for each cell. This process creates a grid-like maze with vertical and horizontal paths, often resulting in a less complex structure.

- **Sidewinder** - Sidewinder maze generation creates mazes by working row by row. It starts at the top row and randomly connects adjacent cells either to the right or upwards. When a passage goes upwards, it occasionally "closes" the current row and starts a new one. This process creates mazes with longer horizontal passages and shorter vertical ones.

- **Prims's** - Prim's maze generation begins with a grid of walls. It selects a random starting point and adds it to the maze. Then, it considers neighboring cells that are not yet part of the maze and connects one of them to the existing maze through the shortest available path. This process repeats until all cells are included in the maze, resulting in a maze with a tree-like structure.

- **Hunt And Kill** - Hunt and Kill maze generation begins with a random starting point. It explores the maze like a random walker until it gets stuck (has no unvisited neighbors). When stuck, it "hunts" for an unvisited cell by scanning the maze from top-left to bottom-right, and when it finds one, it connects the current position to that unvisited cell and continues walking randomly. The process repeats until there are no unvisited cells left, creating a maze with more organic and irregular paths.

## Gifs
![mazegengif](https://github.com/TylerMommsen/pathfinding-visualizer/assets/65496518/8f9b3f81-e434-45e3-9950-d88d6a21fbd1)
![viewalgorithmgif](https://github.com/TylerMommsen/pathfinding-visualizer/assets/65496518/f0eade3d-1dc6-4b04-8044-5b6ad6cd219a)

## Development
Follow these steps to run the project locally.
1. Clone the repository.
   
  HTTPS
  ```sh
  git clone https://github.com/TylerMommsen/pathfinding-visualizer.git
  ```
  SSH
  ```sh
  git clone git@github.com:TylerMommsen/pathfinding-visualizer.git
  ```

2. Install dependenices
  ```sh
  npm install
  ```

3. Run the project
  ```sh
  npm run dev
  ```
