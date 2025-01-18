// Player prototype
const Player = function(initName, symbol) {
    let playerName = initName;
    const playerSymbol = symbol;

    const getName = () => playerName;
    const getSymbol = () => playerSymbol;
    //const setName = (newName) => playerName = newName;

    return {getName, getSymbol} //setName
}

// Game prototype
const Game = function(playerOne, playerTwo) {
    const board = [[".", ".", "."], [".", ".", "."], [".", ".", "."]];
    const players = [playerOne, playerTwo];

    const getBoard = () => board.map(row => row.join(" ")).join("\n");
    const getPlayers = () => players;

    return {getBoard, getPlayers}
}

// Main control
const GameControl = (function() {
    let myGame;

    // init
    const init = function() {
        let playerOneName = prompt("Player one: What's your name?");
        let playerTwoName = prompt("Player two: What's your name?");
        myGame = Game(Player(playerOneName, "O"), Player(playerTwoName, "X"));
    }
    
    const getPlayers = () => myGame.getPlayers()
    
    

    // player 1 places
    // check for winning condtion
    // placyer 2 places
    // repeat


    return {init, getPlayers} //playRound
})()

GameControl.init()

//// flow

// start game with init => creates a game session
// mechanism for game end detection in winning condition logic
// playGame = while not win {playRound}, show result
// playRound returns win status (p1 win, p2 win, tie)