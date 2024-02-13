import { useState } from "react";

const TURNS = {
  X: "x",
  O: "o",
};
const WINNER_COMBO = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//TABLERO
const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;

  //ACTUALIZACION DE ESTADO CON CLICK
  const handleClick = () => {
    updateBoard(index);
  };
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};
function App() {
  //ESTADO INICIAL
  const [board, setBoard] = useState(Array(9).fill(null));

  //PRIMER TURNO X
  const [turn, setTurn] = useState(TURNS.X);
  //ESTADO PARA GANADOR
  const [winner, setWinner] = useState(null);
  //CHECK PARA SABER GANADOR SEGUN COMBINACIONES
  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBO) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  //RESET GAME
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
  };

  //CHECK FIN DEL JUEGO

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };
  //NUEVO TURNO
  const updateBoard = (index) => {
    //NO ACTUALIZA ESTADO SI YA TIENE ALGO
    if (board[index] || winner) return;

    // ACTUALIZA EL TABLERO
    const newBoard = [...board];
    // PASAR ESTADO NUEVO
    newBoard[index] = turn;
    setBoard(newBoard);
    //CAMBIA TURNO
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    //CHECK DE GANADOR
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };
  return (
    <main className="board">
      <h1>3 en linea</h1>
      <button onClick={resetGame}> Reset del Juego </button>
      <section className="game">
        {board.map((square, index) => {
          return (
            //UPDATE NO SE PASA COMO FUNCION SINO COMO PARAMETRO
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner !== null && (
        <section className="winner">
          <div className="text">
            <h2>{winner === false ? "Empate" : "Ganó:"} </h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>
            <footer>
              <button onClick={resetGame}> EMPEZAR DE NUEVO </button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
