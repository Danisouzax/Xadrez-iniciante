document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const turnDisplay = document.getElementById("turn");
  const resetBtn = document.getElementById("reset");

  let turn = "white";

  // Peças em Unicode
  const pieces = {
    white: { pawn: "♙", rook: "♖", knight: "♘", bishop: "♗", queen: "♕", king: "♔" },
    black: { pawn: "♟", rook: "♜", knight: "♞", bishop: "♝", queen: "♛", king: "♚" }
  };

  // Posição inicial
  let boardState = [
    [pieces.black.rook, pieces.black.knight, pieces.black.bishop, pieces.black.queen, pieces.black.king, pieces.black.bishop, pieces.black.knight, pieces.black.rook],
    Array(8).fill(pieces.black.pawn),
    ...Array(4).fill(Array(8).fill("")),
    Array(8).fill(pieces.white.pawn),
    [pieces.white.rook, pieces.white.knight, pieces.white.bishop, pieces.white.queen, pieces.white.king, pieces.white.bishop, pieces.white.knight, pieces.white.rook],
  ];

  function renderBoard() {
    board.innerHTML = "";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
        square.textContent = boardState[row][col];
        board.appendChild(square);
      }
    }
  }

  resetBtn.addEventListener("click", () => {
    location.reload();
  });

  renderBoard();
});
