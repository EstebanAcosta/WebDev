run();

let score = 0;
let bestScore = 0;

function run() {
  createRandomizedGrid();

  addEventListenerToNewGameButton();
}

function createRandomizedGrid() {
  // # of rows in the 2048 grid
  const numRow = 4;

  // # of columns in the 2048 grid
  const numCol = 4;

  //create an array of buttons
  let allButtons = [];

  //go through each row of the table
  for (let row = 0; row < numRow; row++) {
    //grab the row of buttons
    let thisRowOfButtons = document.getElementById("row" + String(row + 1));

    //and push them into the 2D matrix
    allButtons.push(thisRowOfButtons.children);
  }

  let randomRow = 0;
  let randomCol = 0;
  let startNum = 0;

  //loop two times to create two random numbers
  //and find a place for them on the grid
  for (let i = 0; i < 2; i++) {
    //get a random row (that is within the grid)
    randomRow = Math.floor(Math.random() * 4);

    //get a random column (that is within the grid)
    randomCol = Math.floor(Math.random() * 4);

    //if the random number is even, set the starting number to 2
    //otherwise, set the starting number to 4
    startNum = Math.floor(Math.random() * 10) % 2 === 0 ? 2 : 4;

    //if a number has been placed in that specific spot
    //of the grid in the last iteration
    if (
      i >= 1 &&
      (allButtons[randomRow][randomCol].value === 2 ||
        allButtons[randomRow][randomCol].value === 4)
    ) {
      //subtract one from i so we can retry finding a place for the second number
      i -= 1;
    }
    //if that spot is vacant
    else {
      //set that spot to the random value
      allButtons[randomRow][randomCol].value = startNum;
    }
  }

  window.addEventListener("keydown", checkKey);

  //console.table(allButtons);
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

function addEventListenerToNewGameButton() {}

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
