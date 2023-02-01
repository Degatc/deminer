import React, { useState } from 'react';

const Minesweeper = () => {
  const [gridSize, setGridSize] = useState(9);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);

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
  const handleCellClick = (rowIndex, colIndex) => {
    if (grid[rowIndex][colIndex] === 'mine') {
      // Game over
      alert("Game Over! You've hit a mine.");
      setRevealed(Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => true)));
    } else {
      // Revealed case
      const newRevealed = [...revealed];
      newRevealed[rowIndex][colIndex] = true;
      setRevealed(newRevealed);
    }
  };
  console.log(revealed)

  return (
    <div>
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
          <table>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <button onClick={() => handleCellClick(rowIndex, colIndex)}>
                        {revealed[rowIndex][colIndex] ? (cell === 'mine' ? ' X ' : ' O ') : '_?_'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;
