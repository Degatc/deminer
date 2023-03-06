import React, { useState, useEffect } from 'react';
import './App.css';

const Minesweeper = () => {
  const [gridSize, setGridSize] = useState(9);
  const [gameStarted, setGameStarted] = useState(false);
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  let win = false;


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
      alert("You've won!");
    }
  }

  // User click
  const handleCellClick = (rowIndex, colIndex) => {
    if (grid[rowIndex][colIndex] === 'mine') {
      // Game over
      alert("Game Over! You've hit a mine.");
      setRevealed(Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => true)));
    } else {
      // Reveal adjacent cells
      revealAdjacentCells(grid, revealed, rowIndex, colIndex);
      checkForWin(grid, revealed)
      setScore(getAdjacentMinesCount(grid, rowIndex, colIndex));
    }
  };

  // Handle right click
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


  // Abandoned 
  const abandoned = () => {
    setGameStarted(false);
    setGridSize(9);
    setTimer(0);
    setScore(0)
  };

// Ajouter le classement 
let classement = [];

// Fonction pour ajouter le score du joueur 
const addClassement = (nom, score) => {
  classement.push({
    nom: nom,
    score: score
  });
};

// Fonction pour trier le classement 
const sortClassement = () => {
  classement.sort((a, b) => {
    return b.score - a.score;
  });
};


// Fonction pour afficher le classement sous le plateau 
const displayClassement = () => {
  const classementDiv = document.getElementById("classement");

  // Trier le classement 
  sortClassement();

  // Afficher le classement 
  const classementList = document.createElement("ol");
  classement.forEach((item) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(`${item.nom}: ${item.score}`));
    classementList.appendChild(li);
  });
  classementDiv.appendChild(classementList);
};

// Fonction pour demander le nom du joueur en cas de victoire 
const demanderNomJoueur = (score) => {
  const nom = prompt("Bravo, vous avez gagné ! Entrez votre nom pour enregistrer votre score :");
  addClassement(nom, score);
  displayClassement();
};


if (verifierVictoire(jeu)) {
  alert("Bravo, vous avez gagné !");
  demanderNomJoueur(score);
  resetJeu();
  return;
}

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
          <h2>Score: {score}</h2>
          <table>
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      <button id='cell' onClick={() => handleCellClick(rowIndex, colIndex)} onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}>
                        {revealed[rowIndex][colIndex] === 'flag' ? ' ⚑ ' : revealed[rowIndex][colIndex] ? (cell === 'mine' ? "💣"  : getAdjacentMinesCount(grid, rowIndex, colIndex)) : '?'}
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