document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const turnDisplay = document.getElementById("turn");
  const resetBtn = document.getElementById("reset");

  let turn = "white";
  let selected = null;

  // Peças em Unicode
  const pieces = {
    white: { pawn: "♙", rook: "♖", knight: "♘", bishop: "♗", queen: "♕", king: "♔" },
    black: { pawn: "♟", rook: "♜", knight: "♞", bishop: "♝", queen: "♛", king: "♚" }
  };

  // Posição inicial
  let boardState = [
    [pieces.black.rook, pieces.black.knight, pieces.black.bishop, pieces.black.queen, pieces.black.king, pieces.black.bishop, pieces.black.knight, pieces.black.rook],
    Array(8).fill(pieces.black.pawn),
    ...Array(4).fill(null).map(() => Array(8).fill("")),
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
        square.dataset.row = row;
        square.dataset.col = col;
        square.textContent = boardState[row][col];

        square.addEventListener("click", () => handleClick(row, col));

        board.appendChild(square);
      }
    }
  }

  function handleClick(row, col) {
    const piece = boardState[row][col];

    if (selected) {
      const [selRow, selCol] = selected;
      const selectedPiece = boardState[selRow][selCol];

      if (isValidMove(selectedPiece, selRow, selCol, row, col)) {
        boardState[row][col] = selectedPiece;
        boardState[selRow][selCol] = "";
        turn = turn === "white" ? "black" : "white";
        turnDisplay.textContent = `Vez das ${turn === "white" ? "Brancas" : "Pretas"}`;
      }

      selected = null;
      renderBoard();
    } else if (piece && getColor(piece) === turn) {
      selected = [row, col];
    }
  }

  // Identifica cor da peça
  function getColor(piece) {
    if (!piece) return null;
    return Object.values(pieces.white).includes(piece) ? "white" : "black";
  }

  // Regras de movimento
  function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
    if (!piece) return false;
    const dr = toRow - fromRow;
    const dc = toCol - fromCol;
    const target = boardState[toRow][toCol];

    if (target && getColor(target) === getColor(piece)) return false;

    switch (piece) {
      case pieces.white.pawn:
        return validatePawn("white", fromRow, fromCol, toRow, toCol, dr, dc, target);
      case pieces.black.pawn:
        return validatePawn("black", fromRow, fromCol, toRow, toCol, dr, dc, target);
      case pieces.white.rook:
      case pieces.black.rook:
        return validateLinear(fromRow, fromCol, toRow, toCol, "rook");
      case pieces.white.bishop:
      case pieces.black.bishop:
        return validateLinear(fromRow, fromCol, toRow, toCol, "bishop");
      case pieces.white.queen:
      case pieces.black.queen:
        return validateLinear(fromRow, fromCol, toRow, toCol, "queen");
      case pieces.white.king:
      case pieces.black.king:
        return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
      case pieces.white.knight:
      case pieces.black.knight:
        return (Math.abs(dr) === 2 && Math.abs(dc) === 1) || (Math.abs(dr) === 1 && Math.abs(dc) === 2);
    }

    return false;
  }

  function validatePawn(color, fromRow, fromCol, toRow, toCol, dr, dc, target) {
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;

    if (dc === 0 && !target) {
      if (dr === direction) return true;
      if (fromRow === startRow && dr === 2 * direction) return true;
    }

    if (Math.abs(dc) === 1 && dr === direction && target) {
      return true;
    }

    return false;
  }

  function validateLinear(fromRow, fromCol, toRow, toCol, type) {
    const dr = toRow - fromRow;
    const dc = toCol - fromCol;

    if (type === "rook" && dr !== 0 && dc !== 0) return false;
    if (type === "bishop" && Math.abs(dr) !== Math.abs(dc)) return false;
    if (type === "queen" && !(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return false;

    const stepRow = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepCol = dc === 0 ? 0 : dc / Math.abs(dc);

    let r = fromRow + stepRow;
    let c = fromCol + stepCol;
    while (r !== toRow || c !== toCol) {
      if (boardState[r][c]) return false;
      r += stepRow;
      c += stepCol;
    }

    return true;
  }

  resetBtn.addEventListener("click", () => location.reload());

  renderBoard();
});
