//// flow

// start game with init => creates a game session
// mechanism for game end detection in winning condition logic
// playGame = while not win {playRound}, show result
// playRound returns win status (p1 win, p2 win, tie)


// Player prototype
const Player = function(initName, symbol, id) {
    let playerName = initName;
    const playerSymbol = symbol;
    const playerID = id

    const getName = () => playerName;
    const getSymbol = () => playerSymbol;
    const getID = () => playerID;
    //const setName = (newName) => playerName = newName;

    return {getName, getSymbol, getID} //setName
}

// Game prototype
const Game = function(playerOne, playerTwo) {
    const board = [[".", ".", "."], [".", ".", "."], [".", ".", "."]];
    const playerScore = [0, 0];
    let currentPlayer = playerOne;
    let moves = 0;

    const getBoard = () => board.map(row => row.join(" ")).join("\n");
    const getCurrentPlayer = () => currentPlayer;

    const placeSymbol = function([y, x], player) {
        let symbolPlaced = false;
        if (0 <= y && y <= 2 && 0 <= x && x <= 2 && board[y][x] == ".") {
            board[y][x] = player.getID();
            symbolPlaced = true;
            moves += 1;
            console.log(`${player.getSymbol()} placed at (${y}, ${x})`)
        } else {
            console.log(`ERROR - ${player.getSymbol()} could not be placed at (${y}, ${x})`)
        }
        return symbolPlaced
    }

    const checkWin = function(player){
        let winnerID = -1;
        let playerID = player.getID();
        let matchID = (cell) => cell == playerID;
    
        // check rows
        for (row of board) {
            if (row.filter(cell => matchID(cell)).length === 3) {
                winnerID = player.getID()
            }
        }

        // check columns
        for (let i = 0; i <= 2; i++) {
            let currColumn = board.map(row => row[i])
            if (currColumn.filter(cell => matchID(cell)).length === 3) {
                winnerID = player.getID();
            }
        }

        // check diagonal
        if ([board[0][0], board[1][1], board[2][2]].filter(cell => matchID(cell)).length === 3 ||
            [board[2][0], board[1][1], board[0][2]].filter(cell => matchID(cell)).length === 3) {
                winnerID = player.getID();
            }

        // check if board is full (draw)
        if (winnerID === -1 && moves === 9) {
            winnerID = 0;
        }

        return winnerID;
    }

    const rotateCurrentPlayer = function() {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
    }

    return {getBoard, getCurrentPlayer, placeSymbol, rotateCurrentPlayer, checkWin}
}

// Main control
const GameControl = (function() {
    let myGame;
    
    // init
    const init = function() {
        let playerOneName = prompt("Player one: What's your name?");
        let playerTwoName = prompt("Player two: What's your name?");
        myGame = Game(Player(playerOneName, "O", 1), Player(playerTwoName, "X", 2));
        this.playGame();
    }

    // loops rounds until winStatus is determined
    const playGame = function() {
        let winStatus = -1;    // 0 = draw; 1 = playerOne wins; 2 = playerTwo wins; -1 = undertermined
        while (winStatus === -1) {
            winStatus = this.playRound();
            console.log(winStatus)
        }
        winStatus === 0 ? console.log("Draw - nobody won") : console.log(`${myGame.getCurrentPlayer().getName()} won`)
    }
    
    // returns win status of each round through checkWin()
    const playRound = function() {
        let coord, symbolPlaced;
        while (symbolPlaced != true) {
            coord = prompt(`${myGame.getCurrentPlayer().getName()}'s move: [y x]`).split(" ");
            symbolPlaced = myGame.placeSymbol([coord[0], coord[1]], myGame.getCurrentPlayer());
        }
        console.log(myGame.getBoard())
        roundResult = myGame.checkWin(myGame.getCurrentPlayer());

        // dont rotate current player if winning status is determined
        // used to log winning message, rotation should be done in resetGame()
        if (roundResult === -1) {
            myGame.rotateCurrentPlayer();
        }
        return roundResult;
    }
    

    // player 1 places
    // check for winning condtion
    // switch current player to player 2
    // player 2 places
    // check for winning condtion
    // switch current player to player 1
    // repeat


    return {init, playRound, playGame}
})()

GameControl.init()