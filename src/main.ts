import { Piece } from "./Piece";
import { SQ, ROW, COL, VACANT, PIECES } from "./constants";

const cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('tetris');
const ctx = cvs.getContext('2d');

export class GlobalVars {
    static piece: Piece;
    static score: number = 0;
    static gameOver: boolean = false;
    static scoreEL: HTMLElement;
}

GlobalVars.scoreEL = document.getElementById('score');

export function drawSquare(x: number, y: number, color: string) {
    ctx.fillStyle = color;

    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = 'BLACK';
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}


// create board

export let board: any[] = [];

for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// draw board
export function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);        
        }
    }
}

drawBoard();

export function randomPiece() {
    let randomN = Math.floor(Math.random() * PIECES.length);

    return new Piece(PIECES[randomN][0], PIECES[randomN][1]);;
}

// init a piece

GlobalVars.piece = randomPiece();


let dropStart = Date.now();

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if(event.keyCode === 37) {
        GlobalVars.piece.moveLeft(); 
        dropStart = Date.now();
    }
    else if(event.keyCode === 38) {
        GlobalVars.piece.rotate();
        dropStart = Date.now();
    }
    else if(event.keyCode === 39) {
        GlobalVars.piece.moveRight();
        dropStart = Date.now();
    }
    else if(event.keyCode === 40) {
        GlobalVars.piece.moveDown();
    }
});

function drop() {
    let now = Date.now();
    let delta = now - dropStart;

    if(delta > 1000) {
        GlobalVars.piece.moveDown();
        dropStart = Date.now();
    }

    if(!GlobalVars.gameOver) {
        requestAnimationFrame(drop)
    }
}

drop();