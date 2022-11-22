import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    render() {
        const squares = this.props.squares;
        return (
            <div>
                {squares.map((row, rindex) => {
                    return (
                        <div className='board-row'>
                            {row.map((col, cindex) => {
                                return (
                                    <Square
                                        value={squares[rindex][cindex]}
                                        onClick={() => this.props.onClick(rindex, cindex)}
                                    />)
                            })}
                        </div>
                    )
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array.from(Array(3), () => new Array(3).fill(null)),
                moves: [null, null]
            }],
            xIsNext: true,
            stepNumber: 0,
        }


    }

    handleClick(r, c) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[r][c]) {
            return;
        }
        squares[r][c] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moves: [r,c]
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Перейти к ходу #' + move :
                'К началу игры';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })


        let status;
        if (winner) {
            status = 'Выиграл ' + winner;
        } else {
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                        onClick={(r, c) => this.handleClick(r, c)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <ol>{this.state.history.map(item => (
                        <li>{item.moves}</li>
                    ))}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {
    const lines = [
        [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],// [0, 1, 2],
        [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],// [3, 4, 5],
        [{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }],// [6, 7, 8],
        [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],// [0, 3, 6],
        [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],// [1, 4, 7],
        [{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],// [2, 5, 8],
        [{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],// [0, 4, 8],
        [{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],// [2, 4, 6],
        // [[0, 0], [0, 1], [0, 2]],   
        // [[1, 0], [1, 1], [1, 2]],   
        // [[2, 0], [2, 1], [2, 2]],   
        // [[0, 0], [1, 0], [2, 0]],   
        // [[0, 1], [1, 1], [2, 1]],   
        // [[0, 2], [1, 2], [2, 2]],   
        // [[0, 0], [1, 1], [2, 2]],  
        // [[0, 2], [1, 1], [2, 0]],   
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a.r][a.c] && squares[a.r][a.c] === squares[b.r][b.c] && squares[a.r][a.c] === squares[c.r][c.c]) {
            return squares[a.r][a.c];
        }
    }
    return null;
}