import React, { useState, useEffect } from 'react';
import './App.css';

const Minesweeper = () => {
  const [gridSize, setGridSize] = useState(9);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameStarted]);

  // Change grid size 
  const handleGridSizeChange = (event) => {
     setGridSize(event.target.value);

  };

  // Launching a game
  const startGame = () => {
    // Generate grid with random mines
    const newGrid = Array.from({ length: gridSize }, (_, rowIndex) =>
      Array.from({ length: gridSize }, (_, colIndex) => {
        const randomNum = Math.random();
        return randomNum < 0.15 ? 'mine' : null;
      })
    );

    setGrid(newGrid);
    setRevealed(Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => false)));
    setGameStarted(true);
  };

  // User click
  const revealAdjacentCells = (grid, revealed, rowIndex, colIndex) => {
    let count = 0;
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const [rowDiff, colDiff] of directions) {
      const newRowIndex = rowIndex + rowDiff;
      const newColIndex = colIndex + colDiff;
      if (
        newRowIndex >= 0 &&
        newRowIndex < grid.length &&
        newColIndex >= 0 &&
        newColIndex < grid[0].length
      ) {
        if (grid[newRowIndex][newColIndex] === 'mine') {
          count++;
        }
      }
    }
  
    const newRevealed = [...revealed];
    newRevealed[rowIndex][colIndex] = true;
    setRevealed(newRevealed);
  
    if (count === 0) {
      for (const [rowDiff, colDiff] of directions) {
        const newRowIndex = rowIndex + rowDiff;
        const newColIndex = colIndex + colDiff;
        if (
          newRowIndex >= 0 &&
          newRowIndex < grid.length &&
          newColIndex >= 0 &&
          newColIndex < grid[0].length &&
          !revealed[newRowIndex][newColIndex]
        ) {
          revealAdjacentCells(grid, newRevealed, newRowIndex, newColIndex);
        }
      }
    }
  };
  
  // User click
  const handleCellClick = (rowIndex, colIndex) => {
    if (grid[rowIndex][colIndex] === 'mine') {
      // Game over
      alert("Game Over! You've hit a mine.");
      setRevealed(Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => true)));
    } else {
      // Reveal adjacent cells
      revealAdjacentCells(grid, revealed, rowIndex, colIndex);
    }
  };

  // Abandoned 
  const abandoned = () => {
    setGameStarted(false);
    setGridSize(9);
    setTimer(0)
  };

  return (
    <div id='main'>
      <h1>Minesweeper</h1>
      {!gameStarted && (
        <div>
          <label htmlFor="grid-size-select">Select Grid Size:</label>
          <select id="grid-size-select" onChange={handleGridSizeChange}>
            <option value={9}>Débutant : 9x9</option>
            <option value={16}>Intermédiaire : 16x16</option>
            <option value={22}>Expert : 22x22</option>
            <option value={30}>Maître : 30x30</option>
          </select>
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
      {gameStarted && (
        <div>
          <h2>Timer: {timer} seconds</h2>
          <table>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <button id='cell' onClick={() => handleCellClick(rowIndex, colIndex)}>
                        {revealed[rowIndex][colIndex] ? (cell === 'mine' ? ' X ' : ' O ') : '?'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={abandoned}>Abandonné</button>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
