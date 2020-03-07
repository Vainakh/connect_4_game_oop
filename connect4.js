/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 class Player {
   constructor(color, name) {
     this.color = color;
     this.name = name;
   }
  }

class Game {
  constructor(height=7, width=6) {
    this.height = height;
    this.width = width; 
    this.board = [];
    this.gameRunning = false;
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
    this.p1;
    this.p2;
    this.currPlayer = this.p1;
    let button = document.getElementById("start");
    button.addEventListener('click', this.startGame);
  }


  
  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard(){
    for (let y = 0; y < this.height; y++) {
      let row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(null);
      }
      this.board.push(row);
    }
    console.log(this.board);
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    let htmlBoard = document.getElementById('board');
    // make column tops (clickable area for adding a piece to that column)
    let top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      let headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      let row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        let cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }
  
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
   
    for (let y = this.height - 1; y >= 0; y--) {
      if (!(this.board[y][x])) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    let piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style["background-color"] = this.currPlayer.color;
    console.log("Current player:" + this.currPlayer.name);
    console.log("Current player color:" + this.currPlayer.color);
    piece.style.top = -50 * (y + 2);

    let spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  
  /** endGame: announce game end */
  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }
  
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {

    if(this.gameOver){
      return;
    }

    if (this.gameRunning === false) {
      return;
    }
    // get x from ID of clicked cell
    let x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    
    let y = this.findSpotForCol(x);
    console.log("Column to add piece:" + y);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

      //let anotherWin = _win.bind(this);

      const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if ( _win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL) ) {
          return true;
        }
      }
    }
  }

startGame = () => {

   if (this.gameRunning) {
      location.reload();
   } else {
      this.gameRunning = true;
      let p1Color = document.getElementById("p1color").value;
      let p2Color = document.getElementById("p2color").value; 
      this.p1 = new Player(p1Color, "Adlan");
      this.p2 = new Player(p2Color, "Graham");
      this.currPlayer = this.p1;

    } 
 }
 
}

let game = new Game(6, 7);

