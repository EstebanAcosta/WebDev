let runningTotal = 0;
let doingArithmetic = false;

//keep adding a digit to the end of the number until an arithmetic button is pressed
function displayNumber(number)
{
  let display = document.getElementById("display");

  //if the display shows a zero or if we are in the middle of doing any kind of
  //arithmetic, make sure to set the display value to that digit
  //otherwise concatonate that digit to the end of the display value
  display.value === "0" || doingArithmetic ? display.value = number : display.value += number;

 //set this to false since we are only concatonating digits together
  doingArithmetic = false;
}

function arithmetic(operation)
{
  let display = document.getElementById("display");

  let num = parseFloat(display.value);

  if(operation === "+")
  {
    runningTotal+=num;

  }
  else if(operation === "-")
  {
  }
  else if(operation === "*")
  {
    runningTotal === 0 ? runningTotal = 1 * num : runningTotal*=num;
  }
  else
  {

    runningTotal/=num;
  }

  display.value = String(runningTotal);

  doingArithmetic = true;

  // console.log(runningTotal);
}

//add a decimal point to the end of the number if said decimal point isn't already there
function addDecimalPoint()
{
  let display = document.getElementById("display");

  if(!display.value.includes("."))
  {
    display.value+=".";
  }
}

//clear the number on the display
function clearDisplay()
{
  let display = document.getElementById("display");

  display.value = "0";

  runningTotal = 0;
}

//negate the number on the display
function negateNumber()
{
  let display = document.getElementById("display");

  display.value = String(-1*parseFloat(display.value));
}

//convert the number to a decimal
function percentageOfNumber()
{
  let display = document.getElementById("display");

  display.value = String(parseFloat(display.value) / 100);
}

function showAdvancedOptions()
{
  //gets the calculator display
  let display = document.getElementById("display");

  //gets the scientific button on the calculator
  let advancedButton = document.getElementById("scientific");

  //creates a custom list of additional functions that will be added to the calculator
  const functions = ["sin", "cos" , "tan" , "sin-1" , "cos-1" , "tan-1" , "ln" , "log" , "x!" , "√" , "(" , ")" , "inv" , "x^2" , "x^y"];

  //this constant number is how many elements we want in a specific row
  const elementsInRow = 3;

  //keeps track of which row number on the table we are at
  let rowNum = 1;

  //gets the table row in the table
  let tableRow = document.getElementById("row" + String(rowNum));

  //if the button has the word scientific on it
  if(advancedButton.value === "Scientific")
  {
    //change it to basic
    advancedButton.value = "Basic";

    //creates a var that keeps track of how many elements we have in that row
    let howManyInRow = 0;

    for(let i = 0; i < functions.length; i++)
    {

      //if we have already added three new buttons to that specific row
      if(howManyInRow === elementsInRow)
      {
        //get the next table row
        tableRow = document.getElementById("row" + String(++rowNum));

        //reset the var that keeps track of the number of elements in that specific row
        howManyInRow = 0;
      }

      howManyInRow++;

      //create a button element
      let button = document.createElement("input");

      button.name = functions[i];

      button.classList.add("buttons", "scientificButtons");

      button.type = "button";

      button.value = functions[i];

      button.style.width = "100px";

      button.style.height = "100px";

      if(howManyInRow === 3 && rowNum === 5)
      {
        button.style.borderBottomRightRadius = "20px";
      }

      //create a td element
      let tableData = document.createElement("td");

      //add the button to that td element
      tableData.appendChild(button);

      //then add that td element to the current table row
      tableRow.appendChild(tableData);
    }
  }
  else {
    advancedButton.value = "Scientific";
  }
}
