let runningTotal = 0;
let doingArithmetic = false;

$(document).ready(function()
{
  $(".numbers").click(function()
  {
    let number = $(this).attr("value");

    let display = document.getElementById("display");

    //if the display shows a zero or if we are in the middle of doing any kind of
    //arithmetic, make sure to set the display value to that digit
    //otherwise concatonate that digit to the end of the display value
    display.value === "0" || doingArithmetic ? display.value = number : display.value += number;

   //set this to false since we are only concatonating digits together
    doingArithmetic = false;
  });
});

$(document).ready(function()
{
  $("#scientific").click(showScientificOptions);

  $("#clear").click(clearDisplay);

  $("#negate").click(negateNumber);

  $("#percentage").click(percentageOfNumber);
});

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

//converts the number to a decimal
function percentageOfNumber()
{
  let display = document.getElementById("display");

  display.value = String(parseFloat(display.value) / 100);
}


//shows the scientific buttons
function showScientificOptions()
{
  //gets the calculator display element
  let display = document.getElementById("display");

  //gets the scientific button on the calculator
  let scientificButton = document.getElementById("scientific");

  //creates a custom list of additional functions that will be added to the calculator
  const functions = ["sin", "cos" , "tan" , "sin-1" , "cos-1" , "tan-1" , "ln" , "log" , "x!" , "√" , "(" , ")" , "inv" , "x^2" , "x^y"];

  //this var keeps track of how many elements we want in a specific row
  const elementsInRow = 3;

  //keeps track of which row number in the table we are at
  let rowNum = 1;

  //gets the total row numbers by first accessing the table body and then getting the length of
  //the table body's children (in this case the table body's rows)
  const rowNums = document.getElementsByTagName("tbody")[0].children.length;

  //gets the table row in the table (starts off with the second row of the table since the display is on the first row)
  let tableRow = document.getElementById("row" + String(rowNum));

  //if the button has the word scientific on it
  if(scientificButton.value === "Scientific")
  {
    //change it to basic
    scientificButton.value = "Basic";

    //create a var that keeps track of how many elements we have in that row
    let howManyInNewRow = 0;

    //go through our custom list of functions
    for(let i = 0; i < functions.length; i++)
    {
      //if we have already added three new buttons to that specific row
      if(howManyInNewRow === elementsInRow)
      {
        //get the next table row
        tableRow = document.getElementById("row" + String(++rowNum));

        //reset the var that keeps track of the number of button elements in that specific row
        howManyInNewRow = 0;
      }

      //since we are adding one button element to this row, add one to the var
      howManyInNewRow++;

      //create a button element
      let button = document.createElement("input");

      //give each button a name, two class names, a type, a value, and set its width and height to 100px
      button.name = functions[i];

      button.classList.add("buttons", "scientificButtons");

      button.type = "button";

      button.value = functions[i];

      button.style.width = "100px";

      button.style.height = "100px";

      //if we are on the last row of the table and we are just about to start appending new buttons to this row
      if(howManyInNewRow === 1 && rowNum === (rowNums - 1))
      {
        //grab the last button on the last row and straighten the bottom right corner of that button
        tableRow.children[tableRow.children.length - 1].children[0].style.borderBottomRightRadius = "0px";
      }

      //if this is the last button being added to the scientific section of the calculator
      if(howManyInNewRow === 3 && rowNum === (rowNums - 1))
      {
        //make sure to round out the bottom right corner of the last button
        button.style.borderBottomRightRadius = "20px";

        //and expand the width of the display
        display.style.width = "700px";

        display.parentElement.colSpan = "7";
      }

      //create a td element
      let tableData = document.createElement("td");

      //add the new button element to that td element
      tableData.appendChild(button);

      //then add that td element to the current table row
      tableRow.appendChild(tableData);
    }
  }
  else {
    scientificButton.value = "Scientific";

    rowNum = 1;

    for(; rowNum < rowNums; rowNum++)
    {
      tableRow = document.getElementById("row" + String(rowNum));

      while(tableRow.children.length > 4)
      {
       tableRow.children[4].remove();
      }
    }

    display.style.width = String(100 * tableRow.children.length) + "px";

    display.parentElement.colSpan = String(tableRow.children.length);

    tableRow.children[3].children[0].style.borderBottomRightRadius = "20px";
  }
}
