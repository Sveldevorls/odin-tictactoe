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
const Game = function(playerOneName, playerTwoName) {
    let [playerOne, playerTwo] = [Player(playerOneName, "X", 0), Player(playerTwoName, "O", 1)]
    const board = [".", ".", ".", ".", ".", ".", ".", ".", "."];
    let currentPlayer = playerOne;
    let moves = 0;

    const getCurrentPlayer = () => currentPlayer;

    const placeSymbol = function(n) {
        if (n < 0 || n > 8 || board[n] != ".") {
            console.log(`ERROR - ${this.getCurrentPlayer().getSymbol()} could not be placed at (${n})`)
            return false
        } else {
            board[n] = this.getCurrentPlayer().getSymbol();
            moves += 1;
            console.log(`${this.getCurrentPlayer().getSymbol()} placed at (${n})`)
            return true
        }
    }

    const checkWin = function(){
        let winnerID = -1
        let winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        // board full, will be overwritten if last move results in a win
        if (moves == 9) {
            winnerID = 0;
        }

        // check each line to match condition
        for (line of winningLines) {
            if (line.map(n => board[n]).filter(symbol => symbol === this.getCurrentPlayer().getSymbol()).length === 3) {
                winnerID = 1;
            }
        }

        return winnerID;
    }

    const rotateCurrentPlayer = function() {
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    }

    return {getCurrentPlayer,
            placeSymbol,
            rotateCurrentPlayer,
            checkWin}
}

// Main control
/* 
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
    const playRound = function(n) {
        let symbolPlaced;
        while (symbolPlaced != true) {
            symbolPlaced = this.placeSymbol(coord);
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

    const placeSymbol = (n) => myGame.placeSymbol(n, myGame.getCurrentPlayer())
    
    return {init, playGame, playRound, placeSymbol}
}
*/

// Display control
const DisplayControl = (function() {

    let game;
    let roundFinished = false;
    let winner = -1;
    let playerDivs = [];

    const launchButton = document.getElementById("launch-game");
    const startButton = document.getElementById("start-game");
    
    const dialog = document.getElementById("names-entry");
    const titleScreen = document.body.querySelector(".title-screen");
    const gameScreen = document.body.querySelector(".game-screen");
    const scoreDiv = document.body.querySelector(".score");
    const gameboard = document.body.querySelector(".gameboard")
    
    const launchGame = function() {
        titleScreen.style.display = "none";
        dialog.showModal();
    }

    // get player name => create player objects

    const startGame = function() {
        const nameInputs = document.body.querySelectorAll("input");
        let playerNames = [...nameInputs].map(i => i.value.trim() || i.getAttribute("placeholder"));

        for (playerName of playerNames) {
            let playerDiv = newElement("div", ["className", "player"], ["innerHTML", `<p class="name">${playerName}</p><p class="player-score">0</p>`]);
            playerDivs.push(playerDiv);
            scoreDiv.appendChild(playerDiv);
        }

        playerDivs[0].classList.toggle("active")
        
        dialog.close();
        gameScreen.style.visibility = "visible";
        game = Game(playerNames[0], playerNames[1]);
        
        // Gameboard construction
        for (i = 0; i <= 8; i++) {
            let cell = newElement("div", ["id", i], ["innerText", ""], ["className", "cell"]);
            cell.addEventListener("click", () => {
                if (!roundFinished) {
                    playMove(cell);
                }
            })
            gameboard.appendChild(cell);
        }
    }   

    const playMove = function(cell) {
        let moveMade = game.placeSymbol(cell.id);
        if (moveMade) {
            updateActive(getCurrentPlayerDiv())
            cell.innerText = game.getCurrentPlayer().getSymbol();
            winner = game.checkWin(game.getCurrentPlayer());
            if (winner === -1) {
                game.rotateCurrentPlayer();
                updateActive(getCurrentPlayerDiv())
            } else {
                roundFinished = true;
                winner != 0 ? console.log(`${game.getCurrentPlayer().getName()} won`) : console.log("Draw")
                if (winner === 1) updateScore(getCurrentPlayerDiv());
            }
        }
    }


    // two updates -> switch .active and score update
    const updateActive = function(playerDiv){
        playerDiv.classList.toggle("active");
    }

    const updateScore = function(playerDiv){
        playerDiv.children[1].innerText = parseInt(playerDiv.children[1].innerText, 10) + 1;
    }

    const getCurrentPlayerDiv = () => playerDivs[game.getCurrentPlayer().getID()];

    const newElement = function(type, ...attributesArr) {
        let myElement = document.createElement(type);
        if (attributesArr) {
            for ([attribute, value] of attributesArr) {
                myElement[attribute] = value;
            }
        }
        return myElement
    }
    
    launchButton.addEventListener("click", launchGame)
    startButton.addEventListener("click", startGame)
})()

//// display render
// players shown -> enter name with input
// div.player {
//     a.name
//     p.score
// }

// click on cell => game.placeSymbol(cell.id)