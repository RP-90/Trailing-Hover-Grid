// HoverGrid.jsx
import React, { useRef, useEffect } from 'react';

// Constants defining grid and color settings
const CELL_SIZE = 40; // Size of each cell in the grid
const COLOR_R = 77; // Red component for stroke color
const COLOR_G = 77; // Green component for stroke color
const COLOR_B = 255; // Blue component for stroke color
const STARTING_ALPHA = 200; // Initial opacity of the mouse hover effect
const BACKGROUND_COLOR = '#020510'; // Canvas background color
const PROB_OF_NEIGHBOR = 0.5; // Probability of including neighboring cells in the hover effect
const AMT_FADE_PER_FRAME = 5; // Amount of fade applied per frame to each cell

function HoverGrid() {
  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set initial canvas size to match the container dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Determine grid dimensions based on canvas size and cell size
    let numRows = Math.ceil(canvas.height / CELL_SIZE);
    let numCols = Math.ceil(canvas.width / CELL_SIZE);
    let currentRow = -2; // Track the current row of the mouse position
    let currentCol = -2; // Track the current column of the mouse position
    let allNeighbors = []; // Array to store cells to fade out around the cursor

    let mouseX = -1; // Current X position of the mouse
    let mouseY = -1; // Current Y position of the mouse

    let animationFrameId; // ID for the animation frame request

    // Main drawing function, called for each animation frame
    const draw = () => {
      // Clear the canvas with the background color
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate the row and column of the cell the mouse is over
      let row = Math.floor(mouseY / CELL_SIZE);
      let col = Math.floor(mouseX / CELL_SIZE);

      // If the mouse moves to a different cell, add new neighbors
      if (row !== currentRow || col !== currentCol) {
        currentRow = row;
        currentCol = col;
        // Generate neighbors for the new cell position
        allNeighbors.push(...getRandomNeighbors(row, col));
      }

      // Draw the cell directly under the mouse with a highlighted border
      let x = col * CELL_SIZE;
      let y = row * CELL_SIZE;
      ctx.strokeStyle = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${STARTING_ALPHA / 255})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

      // Draw and update each neighboring cell in the `allNeighbors` array
      for (let neighbor of allNeighbors) {
        let neighborX = neighbor.col * CELL_SIZE;
        let neighborY = neighbor.row * CELL_SIZE;
        // Fade out the cell by reducing its opacity
        neighbor.opacity = Math.max(0, neighbor.opacity - AMT_FADE_PER_FRAME);
        let alpha = neighbor.opacity / 255;
        ctx.strokeStyle = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${alpha})`;
        ctx.strokeRect(neighborX, neighborY, CELL_SIZE, CELL_SIZE);
      }
      // Filter out neighbors that are fully faded out (opacity <= 0)
      allNeighbors = allNeighbors.filter((neighbor) => neighbor.opacity > 0);

      // Request the next animation frame to keep the draw loop going
      animationFrameId = requestAnimationFrame(draw);
    };

    // Function to get random neighboring cells around the specified cell
    const getRandomNeighbors = (row, col) => {
      let neighbors = [];

      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          let neighborRow = row + dRow;
          let neighborCol = col + dCol;

          let isCurrentCell = dRow === 0 && dCol === 0; // Skip the central cell

          // Check if the neighbor cell is within bounds
          let isInBounds =
            neighborRow >= 0 &&
            neighborRow < numRows &&
            neighborCol >= 0 &&
            neighborCol < numCols;

          // Only add neighbors based on probability and bounds
          if (
            !isCurrentCell &&
            isInBounds &&
            Math.random() < PROB_OF_NEIGHBOR
          ) {
            neighbors.push({
              row: neighborRow,
              col: neighborCol,
              opacity: 255, // Start with full opacity
            });
          }
        }
      }

      return neighbors;
    };

    // Event handler to track mouse movement on the canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    // Event handler to resize the canvas and grid dimensions on window resize
    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      numRows = Math.ceil(canvas.height / CELL_SIZE);
      numCols = Math.ceil(canvas.width / CELL_SIZE);
    };

    // Attach event listeners for mouse movement and window resize
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Start the drawing loop
    draw();

    // Cleanup function to remove event listeners and cancel animation on unmount
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Render the canvas element, styled to fill the container and cover the background
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

export default HoverGrid;