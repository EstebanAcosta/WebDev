
run();

function run()
{
  createRandomizedGrid();

  addEventListnerToNewGameButton();

  addEventListenersToButtonsOnGrid();

}

function createRandomizedGrid() {

  let allButtons = [];

  // # of rows in the 2048 grid
  const numRow = 4;

  // # of columns in the 2048 grid
  const numCol = 4;

  //go through each row of the table
  for (let row = 0; row < numRow; row++) {
    //grab the row
    let thisRow = document.getElementById("row" + String(row + 1));

    //create an array of buttons
    //and push them into the 2D matrix
    allButtons.push(thisRow.children);
  }  

  let randomRow, randomCol, randomNum, startNum;

  //loop two times to create two random numbers 
  //and find a place for them on the grid
  for(let i = 0 ; i < 2; i++)
  {
    //get a random row (that is within the grid)
    randomRow = Math.floor(Math.random() * 4);

    //get a random column (that is within the grid)
    randomCol = Math.floor(Math.random() * 4);

    //get a random number from 0 - 9
    randomNum = Math.floor(Math.random() * 10);

    //if the random number is even, set the starting number to 2
    //otherwise, set the starting number to 4
    startNum = randomNum % 2 === 0 ? 2 : 4;

    //if a number has been placed in that specific spot
    //of the grid in the last iteration
    if(i >=1 && (allButtons[randomRow][randomCol].value === 2 || 
      allButtons[randomRow][randomCol].value === 4 ))
    {
      //subtract one from i so we can retry finding a place for the second number
      i-=1;
    }
    //if that spot is vacation
    else
    {
    //set that spot to the random value
    allButtons[randomRow][randomCol].value = startNum;
    }

  
  }


  console.table(allButtons);
}

function addEventListenersToButtonsOnGrid()
{
 // # of rows in the 2048 grid
 const numRow = 4;

 // # of columns in the 2048 grid
 const numCol = 4;

 //go through each row of the table
 for (let row = 0; row < numRow; row++) {

 }
}

function addEventListnerToNewGameButton()
{

}


function moveUp(e)
{

}

function moveDown(e)
{
  
}

function moveRight(e)
{
  
}

function moveLeft(e)
{
  
}





