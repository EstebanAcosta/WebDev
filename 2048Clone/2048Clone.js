//keeps track of the current score
let score = 0;

//keeps track of the best score
let bestScore = 0;

//create a 2D list that will contains all of the buttons in grid form
let buttonsGrid = [];

// # of rows in the 2048 grid
const numRow = 4;

// # of columns in the 2048 grid
const numCol = 4;

run();

//this starts the 2048 game
function run() {
  //ensure that the window is keeping track of any key presses
  //specificially arrow key presses
  window.addEventListener("keydown", checkKey);

  //add a listener to the new game button
  //that will reset the entire game
  document
    .querySelector("#newGameButton")
    .addEventListener("click", startNewGame);

  //create a grid with two numbers at two distinct random spots
  createRandomizedGrid();
}

function createRandomizedGrid() {
  //create an array of buttons
  let allButtons = document.querySelectorAll(".table-buttons");

  //create a list that will represent each row of the grid
  let buttonsInRow = [];

  //go through each button element in the list of button elements (16 iterations)
  for (let i = 0; i < allButtons.length + 1; i++) {
    //if we have added four buttons to the list from this specific row
    if (i > 0 && i % 4 === 0) {
      //add this list of buttons to the grid
      buttonsGrid.push(buttonsInRow);

      //remove all elements in this list
      buttonsInRow = [];
    }
    //add a button element to a list for this specific row
    buttonsInRow.push(allButtons[i]);
  }

  // console.table(buttonsGrid);

  let randomRow = 0;
  let randomCol = 0;
  let startNum = 0;

  //loop two times to create two random numbers
  //and find a place for each of them them on the grid
  for (let i = 0; i < 2; i++) {
    //if a number has been placed in that specific spot
    //of the grid in the last iteration
    //loop again
    do {
      //get a random row (that is within the grid)
      randomRow = Math.floor(Math.random() * numRow);

      //get a random column (that is within the grid)
      randomCol = Math.floor(Math.random() * numCol);
    } while (i === 1 && buttonsGrid[randomRow][randomCol].value !== "");

    //if the random number is even, set the starting number to 2
    //otherwise, set the starting number to 4
    startNum = Math.floor(Math.random() * 10) % 2 === 0 ? 2 : 4;
    //set that spot to the random value
    buttonsGrid[randomRow][randomCol].value = startNum;

    //if the starting number is a 2
    if (startNum === 2) {
      //set two's background color
      buttonsGrid[randomRow][randomCol].style.backgroundColor = "ghostwhite";
    }
    //if the starting number is a 4
    else if (startNum === 4) {
      //set four's background color
      buttonsGrid[randomRow][randomCol].style.backgroundColor = "antiquewhite";
    }

    //set the standard style for the starting two buttons
    buttonsGrid[randomRow][randomCol].style.fontWeight = "bold";
    buttonsGrid[randomRow][randomCol].style.fontSize = "3rem";
    buttonsGrid[randomRow][randomCol].style.color = "dimgray";
  }
}

function checkKey(e) {
  switch (e.keyCode) {
    case 38:
      //user pressed the up arrow
      moveUp();
      break;
    case 40:
      //user pressed the down arrow
      moveDown();
      break;
    case 37:
      //user pressed the left arrow
      moveLeft();
      break;
    case 39:
      //user pressed the right arrow
      moveRight();
      break;
  }
}

function createRandomTile() {
  //if a number has been placed in that specific spot
  //of the grid in the last iteration
  //loop again
  let randomRow = 0;
  let randomCol = 0;
  do {
    //get a random row (that is within the grid)
    randomRow = Math.floor(Math.random() * rowNum);

    //get a random column (that is within the grid)
    randomCol = Math.floor(Math.random() * rowCol);
  } while (
    buttonsGrid[randomRow][randomCol].value === "2" ||
    buttonsGrid[randomRow][randomCol].value === "4"
  );
}

function isGridFull() {
  for (let r = 0; r < numRow; r++) {
    for (let c = 0; c < numCol; c++) {
      if (buttonsGrid[r][c].value === "") {
        return false;
      }
    }
  }
  return true;
}

function moveUp() {
  console.log("Pressed up");
}

function moveDown() {
  console.log("Pressed Down");
}

function moveRight() {
  console.log("Pressed Right");
}

function moveLeft() {
  console.log("Pressed Left");
}

function startNewGame() {
  //reset the score
  score = 0;

  //reset the score on the page
  //first get the score_box element
  //get the last child (which is the element that displays the score)
  //and change its inner html to 0
  document.getElementById("score_box").lastElementChild.innerHTML = score;

  //reset the grid (remove all values on the grid)
  resetGrid();

  //create two numbers and place them in two distinct spots on the grid
  createRandomizedGrid();
}

function resetGrid() {
  //loop through the grid
  //and reset each element's value
  //and background color
  for (let r = 0; r < numRow; r++) {
    for (let c = 0; c < numCol; c++) {
      buttonsGrid[r][c].value = "";
      buttonsGrid[r][c].style.backgroundColor = "";
    }
  }
}

function canCombine() {}

function wonGame() {}

function lostGame() {}
