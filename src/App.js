import React, { useState, useEffect } from 'react';
import './App.css';

const Minesweeper = () => {
  const [gridSize, setGridSize] = useState(9);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [ranking, setRanking] = useState([]);

  // Temps de jeu
  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameStarted]);

  // Classement => localStorage
  useEffect(() => {
    const rankingFromLocalStorage = JSON.parse(localStorage.getItem('ranking'));
    if (rankingFromLocalStorage) {
      setRanking(rankingFromLocalStorage);
    }
  }, []);

  // Change la taille de la grille
  const handleGridSizeChange = (event) => {
    setGridSize(event.target.value);
  };

  // Lance la partie
  const startGame = () => {
    // Génèreration de la grille et des mines
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

  // Demande le nom du joueur
  const askplayername = () => {
    const nom = prompt("Bravo, vous avez gagné ! Entrez votre nom pour enregistrer votre score :");
    return nom
  };

  // Gestion de la victoire
  const handleWin = (score) => {
    const playerName = askplayername()
    const newScore = score + 1;
    const newPlayer = { name: playerName, score: newScore };
    const newRanking = [...ranking, newPlayer].sort((a, b) => b.score - a.score).slice(0, 30);
    setRanking(newRanking);
    setScore(newScore);
    localStorage.setItem('ranking', JSON.stringify(newRanking));
  }

  // Verification de la victoire
  const checkForWin = (grid, revealed) => {
    let win = true;

    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
        if (grid[rowIndex][colIndex] !== 'mine' && !revealed[rowIndex][colIndex]) {
          win = false;
          break;
        }
      }
    }
    
    if (win) {
      handleWin(score);
      return;
    }
  }

  // Découvre les cases adjacentes
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

  // Comptage des mines adjacentes
  function getAdjacentMinesCount(grid, rowIndex, colIndex) {
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
    return count;
  }

  // Gestion d'un clic sur une case
  const handleCellClick = (rowIndex, colIndex) => {
    if (revealed[rowIndex][colIndex]) {
      // Case déjà découverte
      return;
    }
  
    if (grid[rowIndex][colIndex] === 'mine') {
      // Fin de partie
      alert("Game Over! You've hit a mine.");
      setRevealed(Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => true)));
    } else {
      // Découvre les cases adjacentes
      revealAdjacentCells(grid, revealed, rowIndex, colIndex);
      checkForWin(grid, revealed);
      setScore(score + getAdjacentMinesCount(grid, rowIndex, colIndex));
    }
  };

  // Mettre les drapeaux 
  const handleRightClick = (e, rowIndex, colIndex) => {
    const newRevealed = [...revealed];
    if (newRevealed[rowIndex][colIndex] === 'flag') {
      newRevealed[rowIndex][colIndex] = false;
    } else {
      newRevealed[rowIndex][colIndex] = 'flag';
    }
    setRevealed(newRevealed);
    e.preventDefault();
    return false;
  };

  // Rejouer 
  const replay = () => {
    setGameStarted(false);
    setGridSize(9);
    setTimer(0);
    setScore(0)
  };

  return (
    <div id='main'>
      <h1>Démineur</h1>
      {!gameStarted && (
        <div>
          <label class="button" htmlFor="grid-size-select">Sélectionner une difficulté:</label>
          <select class="button" id="grid-size-select" onChange={handleGridSizeChange}>
            <option value={9}>Débutant : 9x9</option>
            <option value={16}>Intermédiaire : 16x16</option>
            <option value={22}>Expert : 22x22</option>
            <option value={30}>Maître : 30x30</option>
          </select>
          <div>
          <button class="button" onClick={startGame}>Commencer la partie !</button>
          </div>
        </div>
      )}
      {gameStarted && (
        <div>
          <h2>Temps: {timer} secondes</h2>
          <h2>Score: {score}</h2>
          <table>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <button id='cell' onClick={() => handleCellClick(rowIndex, colIndex)} onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}>
                        {revealed[rowIndex][colIndex] === 'flag' ? ' ⚑ ' : revealed[rowIndex][colIndex] ? (cell === 'mine' ? "💣" : getAdjacentMinesCount(grid, rowIndex, colIndex)) : ' '}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button class="button" onClick={replay}>Rejouer</button>
        </div>
      )}
      <h2>Classement</h2>
      {ranking.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Nom</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Pas encore de classment ! Soit le premier !</p>
      )}
    </div>
  );
};

export default Minesweeper;