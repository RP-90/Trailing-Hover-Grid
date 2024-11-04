// HoverGrid.jsx
import React, { useRef, useEffect } from 'react';

const CELL_SIZE = 40; // size of each cell in the grid
const COLOR_R = 77;
const COLOR_G = 77;
const COLOR_B = 255;
const STARTING_ALPHA = 200;
const BACKGROUND_COLOR = '#020510';
const PROB_OF_NEIGHBOR = 0.5;
const AMT_FADE_PER_FRAME = 5;

function HoverGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the container
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let numRows = Math.ceil(canvas.height / CELL_SIZE);
    let numCols = Math.ceil(canvas.width / CELL_SIZE);
    let currentRow = -2;
    let currentCol = -2;
    let allNeighbors = [];

    let mouseX = -1;
    let mouseY = -1;

    let animationFrameId;

    const draw = () => {
      // Clear the canvas
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate the row and column of the cell that the mouse is currently over
      let row = Math.floor(mouseY / CELL_SIZE);
      let col = Math.floor(mouseX / CELL_SIZE);

      // Check if the mouse has moved to a different cell
      if (row !== currentRow || col !== currentCol) {
        currentRow = row;
        currentCol = col;
        // Add new neighbors to the allNeighbors array
        allNeighbors.push(...getRandomNeighbors(row, col));
      }

      // Use the calculated row and column to determine the position of the cell
      let x = col * CELL_SIZE;
      let y = row * CELL_SIZE;

      // Draw a highlighted rectangle over the cell under the mouse cursor
      ctx.strokeStyle = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${STARTING_ALPHA / 255})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

      // Draw and update all neighbors
      for (let neighbor of allNeighbors) {
        let neighborX = neighbor.col * CELL_SIZE;
        let neighborY = neighbor.row * CELL_SIZE;
        // Update the opacity of the neighbor
        neighbor.opacity = Math.max(0, neighbor.opacity - AMT_FADE_PER_FRAME); // Decrease opacity
        let alpha = neighbor.opacity / 255;
        ctx.strokeStyle = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${alpha})`;
        ctx.strokeRect(neighborX, neighborY, CELL_SIZE, CELL_SIZE);
      }
      // Remove neighbors with zero opacity
      allNeighbors = allNeighbors.filter((neighbor) => neighbor.opacity > 0);

      animationFrameId = requestAnimationFrame(draw);
    };

    const getRandomNeighbors = (row, col) => {
      let neighbors = [];

      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          let neighborRow = row + dRow;
          let neighborCol = col + dCol;

          let isCurrentCell = dRow === 0 && dCol === 0;

          let isInBounds =
            neighborRow >= 0 &&
            neighborRow < numRows &&
            neighborCol >= 0 &&
            neighborCol < numCols;

          if (
            !isCurrentCell &&
            isInBounds &&
            Math.random() < PROB_OF_NEIGHBOR
          ) {
            neighbors.push({
              row: neighborRow,
              col: neighborCol,
              opacity: 255, // Initial opacity of the neighbor
            });
          }
        }
      }

      return neighbors;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      numRows = Math.ceil(canvas.height / CELL_SIZE);
      numCols = Math.ceil(canvas.width / CELL_SIZE);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    draw();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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