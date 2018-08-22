import { drawSquare, board, randomPiece, GlobalVars, drawBoard } from "./main";
import { VACANT, COL, ROW } from "./constants";

export class Piece {
    public tetromino: any;
    public color: string;
    public tetrominoN: number;
    public activeTetromino: any;
    public x: number;
    public y: number;

    constructor(tetromino: any, color: string) {
        this.tetromino = tetromino;
        this.color = color;
        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.x = 3;
        this.y = -2;
    }

    fill(color: string) {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                // draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    draw() {
        this.fill(this.color);
    }

    unDraw() {
        this.fill(VACANT);
    }

    moveDown() {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            // we lock the piece and generate a new one
            this.lock();
            GlobalVars.piece = randomPiece();
        }
    }

    moveRight() {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        } else {
            // we lock the piece and generate a new one
        }
    }

    moveLeft() {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        } else {
            // we lock the piece and generate a new one
        }
    }

    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            // right wall caused collision
            if (this.x > COL / 2) {
                kick = -1; // move piece to left
            } else {
                kick = 1;
            }
        }

        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoN];
            this.draw();
        }
    }

    collision(x: number, y: number, piece: any[]) {
        for (let r = 0; r < piece.length; r++) {
            for (let c = 0; c < piece.length; c++) {
                // if square is empty we skip it
                if (!piece[r][c]) {
                    continue;
                }

                // coords of piece after movement
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if (newX < 0 || newX >= COL || newY >= ROW) {
                    return true;
                }

                // skip newY < 0
                if (newY < 0) {
                    continue;
                }

                // check if there is an locked piece
                if (board[newY][newX] !== VACANT) {
                    return true;
                }
            }
        }
        return false;
    }

    lock() {
        for (let r = 0; r < this.activeTetromino.length; r++) {
            for (let c = 0; c < this.activeTetromino.length; c++) {
                // we skip vacant square
                if (!this.activeTetromino[r][c]) {
                    continue;
                }

                // pieces to lock = game over
                if (this.y + r < 0) {
                    window.alert('game over');
                    // stop animation frame
                    GlobalVars.gameOver = true;
                    return;
                }

                // lock piece
                board[this.y + r][this.x + c] = this.color;
            }
        }
        // remove full rows
        for (let r = 0; r < ROW; r++) {
            let isRowFull = true;
            for (let c = 0; c < COL; c++) {
                isRowFull = isRowFull && (board[r][c] !== VACANT);
            }
            if (isRowFull) {
                // we move rows above it down
                for (let y = r; y > 1; y--) {
                    for (let c = 0; c < COL; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                for (let c = 0; c < COL; c++) {
                    board[0][c] = VACANT;
                }
                GlobalVars.score += 10;
                GlobalVars.scoreEL.innerText = GlobalVars.score.toString();
            }
        }
        drawBoard();
    }
}
