import SquareClass from "../models/SquareClass";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';


let mouseDown = false;
let timeoutId: number | null = null;

export default function Square({
                                   square,
                                   onClickSquare,
                                   gameOver,
                                   onFlagSquare,
                               }: {
    square: SquareClass;
    onClickSquare: (square: SquareClass) => void;
    gameOver: boolean;
    onFlagSquare: (square: SquareClass) => void;
}) {
    function handleMouseDown() {
        mouseDown = true;
        timeoutId = setTimeout(function () {
            if (mouseDown) {
                onFlagSquare(square);
            }
        }, 200);
    }

    return (
        <button
            className={`md:w-9 md:h-9 w-5 h-5 m-0.5 p-1 flex justify-center items-center ${
                square.isRevealed ? "bg-gray-100" : `bg-gray-400 ${gameOver ? "" : "cursor-pointer"}`
            }`}
            disabled={square.isRevealed}
            type="button"
            onClick={() => onClickSquare(square)}
            onMouseDown={handleMouseDown}
            onMouseUp={() => {
                mouseDown = false;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            }}
        >
            {square.isFlagged && (
                <AssistantPhotoIcon color="error"/>
            )}
            {square.isRevealed && (
                (square.isBomb ? (
                    <SentimentVeryDissatisfiedIcon color="error" fontSize="small"/>
                ) : (
                    <span className={`font-bold ${getTextColor(square.neighbourBombsNumber)}`}>
                        {square.neighbourBombsNumber || ""}
                    </span>
                ))
            )}
        </button>
    );
}

function getTextColor(neighbourBombsNumber: number) {
    switch (neighbourBombsNumber) {
        case 1:
            return "text-blue-500";
        case 2:
            return "text-green-500";
        case 3:
            return "text-red-500";
        case 4:
            return "text-purple-500";
        case 5:
            return "text-yellow-500";
        case 6:
            return "text-cyan-500";
        case 7:
            return "text-pink-500";
        case 8:
            return "text-gray-500";
        default:
            return "text-black";
    }
}