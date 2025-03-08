import {useEffect, useState} from "react";
import Square from "./Square";
import SquareClass from "../models/SquareClass";
import ReplayIcon from "@mui/icons-material/Replay";


export default function Minesweeper() {
    const [gameOver, setGameOver] = useState(false);
    const [field, setField] = useState<SquareClass[][]>([]);

    function onClickSquare(square: SquareClass) {
        if (square.isFlagged || gameOver) {
            return;
        }

        if (!square.isRevealed) {
            revealFillSquare(square); // TODO: stop mutating field
            setField([...field]);
        }

        if (square.isBomb) {
            setGameOver(true);
        }
    }

    function revealFillSquare(
        square: SquareClass,
        visited: Set<string> = new Set()
    ) {
        square.isRevealed = true;

        if (
            square.neighbourBombsNumber === 0 &&
            !square.isBomb &&
            !visited.has(square.id)
        ) {
            visited.add(square.id);
            const neighbours = [
                {x: square.x - 1, y: square.y},
                {x: square.x + 1, y: square.y},
                {x: square.x, y: square.y - 1},
                {x: square.x, y: square.y + 1},
                {x: square.x - 1, y: square.y - 1},
                {x: square.x + 1, y: square.y + 1},
                {x: square.x - 1, y: square.y + 1},
                {x: square.x + 1, y: square.y - 1},
            ];
            for (const {x, y} of neighbours) {
                if (isValidCoordinate(x, y) && !field[y][x].isFlagged) {
                    revealFillSquare(field[y][x], visited);
                }
            }
        }
    }

    function onFlagSquare(square: SquareClass) {
        if (gameOver || square.isRevealed) {
            return;
        }
        square.isFlagged = !square.isFlagged;
        setField([...field]);
    }

    const rows = 16;
    const cols = 16;
    const mines = 40;

    function isValidCoordinate(x: number, y: number) {
        return x >= 0 && y >= 0 && x < cols && y < rows;
    }

    function reset() {
        setGameOver(false);
        setField(getField(rows, cols, mines));
    }

    useEffect(() => {
        setField(getField(rows, cols, mines));
    }, []);

    return (

        <div className="flex flex-col h-screen justify-center text-black">
            <div className="flex justify-center relative">
                {gameOver && (
                    <h1 className="text-center absolute flex gap-1 -top-10 text-2xl font-extrabold text-red-500">GAME
                        OVER</h1>
                )}
                <div className="relative">
                    <ReplayIcon className="absolute -top-10 right-1" fontSize="large" onClick={reset} cursor="pointer"/>
                    <div
                        className={`grid rounded-xl border-5 border-solid border-black overflow-hidden bg-black`}
                        style={{gridTemplateColumns: `repeat(${cols}, 1fr)`}}
                    >
                        {field.map((row) =>
                            row.map((square) => (
                                <Square
                                    key={square.id}
                                    square={square}
                                    onClickSquare={onClickSquare}
                                    gameOver={gameOver}
                                    onFlagSquare={onFlagSquare}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className="text-center text-xl mt-2 absolute -bottom-8">
                    Click to open. Hold to flag.
                </div>
            </div>
        </div>
    );
}

function getField(rows: number, cols: number, mines: number): SquareClass[][] {
    const field = Array(rows)
        .fill(null)
        .map((_, row_i) =>
            Array(cols)
                .fill(null)
                .map((_, col_i) => new SquareClass(col_i, row_i))
        );

    const coordinates = [...Array(rows * cols)].map((_, index) => ({
        x: index % cols,
        y: Math.floor(index / cols),
    }));

    const minesCoordinates = coordinates
        .sort(() => Math.random() - 0.5)
        .slice(0, mines);

    for (const {x, y} of minesCoordinates) {
        field[y][x].isBomb = true;
        for (const dx of [-1, 0, 1]) {
            for (const dy of [-1, 0, 1]) {
                if (dx === 0 && dy === 0) {
                    continue;
                }
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
                    continue;
                }
                field[ny][nx].neighbourBombsNumber += 1;
            }
        }
    }
    return field;
}
