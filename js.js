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
    const board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
    const playerScore = [0, 0];
    let currentPlayer = playerOne;
    let moves = 0;

    const getBoard = () => `${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n${board[6]} ${board[7]} ${board[8]}`;
    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => [playerOne, playerTwo];

    const placeSymbol = function(n, player) {
        if (n < 0 || n > 8 || board[n] != ".") {
            console.log(`ERROR - ${player.getSymbol()} could not be placed at (${n})`)
            return false
        } else {
            board[n] = player.getSymbol();
            moves += 1;
            console.log(`${player.getSymbol()} placed at (${n})`)
            return true
        }
    }

    const checkWin = function(player){
        let winnerID = -1
        let winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                            [0, 3, 6], [1, 4, 7], [2, 5, 8],
                            [0, 4, 8], [2, 4, 6]]
        
        for (line of winningLines) {
            if (line.map(n => board[n]).filter(symbol => symbol === player.getSymbol()).length === 3) {
                winnerID = player.getID();
            }
        }

        // board full
        if (moves == 9) {
            winnerID = 0;
        }

        return winnerID;
    }

    const rotateCurrentPlayer = function() {
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
    }

    return {getBoard,
            getCurrentPlayer,
            getPlayers,
            placeSymbol,
            rotateCurrentPlayer,
            checkWin}
}

// Main control
const GameControl = function() {
    let myGame;
    
    // init
    const init = function(playerOneName, playerTwoName) {
        myGame = Game(Player(playerOneName, "O", 1), Player(playerTwoName, "X", 2));
        this.playGame();
    }

    // loops rounds until winStatus is determined
    const playGame = function() {
        let winnerID = -1;    // 0 = draw; 1 = playerOne wins; 2 = playerTwo wins; -1 = undertermined
        while (winnerID === -1) {
            winnerID = this.playRound();
            console.log(winnerID)
        }
        winnerID === 0 ? console.log("Draw - nobody won") : console.log(`${myGame.getCurrentPlayer().getName()} won`)
    }
    
    // returns win status of each round through checkWin()
    const playRound = function() {
        let coord, symbolPlaced;
        while (symbolPlaced != true) {
            coord = prompt(`${myGame.getCurrentPlayer().getName()}'s move: [x]`);
            symbolPlaced = myGame.placeSymbol(coord, myGame.getCurrentPlayer());
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
    
    return {init, playGame, playRound}
}

/*
// Display control
const DisplayControl = function() {
    let game = GameControl();
    
    const startButton = document.body.querySelector("#start-game");
    const dialog = document.body.querySelector("#names-entry");

    const startGame = function() {
        const nameInputs = document.body.querySelectorAll("input");
        let [playerOneName, playerTwoName] = [...nameInputs].map(i => i.value.trim() || i.getAttribute("placeholder"));
        dialog.close()
        game.init(playerOneName, playerTwoName)
    }
    
    startButton.addEventListener("click", startGame)

    

    return {startGame}
}
*/

//// display render
// players shown -> enter name with input
// div.player {
//     a.name
//     p.score
// }