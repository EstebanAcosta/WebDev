let runningTotal = 0;
let previousVal;
let previousOperation;
let doingArithmetic = false;

//Jquery functions that display values on the display, enable/disable scientific buttons options,
//clear values on the display, negate the value on the display, takes percentage of a vlue and adds
//a decimal point to the value
jQuery(function()
{
  let display = document.getElementById("display");

  $(".numbers").on("click", function()
  {
    let number = $(this).attr("value");

    //if the display shows a zero or if we are in the middle of doing any kind of
    //arithmetic, make sure to set the display value to that digit
    //otherwise concatonate that digit to the end of the display value
    display.value === "0" || doingArithmetic ? display.value = number : display.value += number;

    previousVal = parseFloat(display.value);

   //set this to false since we are only concatonating digits together
    doingArithmetic = false;
  });

  //scientific button functionality
  $("#scientific").on("click",showScientificOptions);

  //clear button functionality
  $("#clear").on("click",function()
  {
    display.value = "0";

    runningTotal = 0;

    previousVal = 0;
  });

  //negate button functionality
  $("#negate").on("click",function()
  {
    display.value = String(-1*parseFloat(display.value));
  });

  //percentage button functionality
  $("#percentage").on("click",function()
  {
    display.value = String(parseFloat(display.value) / 100);
  });

  //decimal point functionality
  $("#decimal").on("click",function()
  {
    if(!display.value.includes("."))  display.value+=".";
  });

  //arithmetic operations functionality
  $(".operations").on("click", doArithmetic);

  $("#darkMode").on("click", enableDarkMode);

});

function doArithmetic()
{
  let operation = event.target.value;

  let display = document.getElementById("display");

  let num = parseFloat(display.value);

  switch(operation)
  {
    case "+":
     runningTotal === 0? runningTotal = previousVal : runningTotal+=previousVal;
     break;

    case "-":
      runningTotal === 0? runningTotal = num: runningTotal-=num;
    break;

    case "*":
      runningTotal === 0 ? runningTotal = 1 * num : runningTotal*=num;
      break;
     
    case "/":
      runningTotal/=num;
    break; 

    case "=":
      break;
  }

  previousOperation = operation;

  display.value = String(runningTotal);

  doingArithmetic = true;

  // console.log(runningTotal);
}

//shows the scientific buttons
function showScientificOptions()
{
  //gets the calculator display 
  let display = document.getElementById("display");

  //gets the scientific button from the calculator
  let scientificButton = document.getElementById("scientific");

  //creates a custom list of additional functions that will be added to the calculator
  const functions = ["sin", "cos" , "tan" , "sin-1" , "cos-1" , "tan-1" , "ln" , "log" , "x!" , "√" , "(" , ")" , "inv" , "x^2" , "x^y"];

  const trigFunctions = functions.slice(0,6);

  const logFunctions = functions.slice(6,8);

  //keeps track of how many elements we want in a specific row
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

    //keeps track of how many elements we have in that table row
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

      button.value = functions[i];

      button.type = "button";

      button.style.width = "100px";

      button.style.height = "100px";

      if(button.value === "inv")
      {
        button.addEventListener("click", function()
        { 

        });
      }

      else if(trigFunctions.includes(button.value))
      {
        button.addEventListener("click",doTrigFunctions);
      }

      else if(logFunctions.includes(button.value))
      {
        button.addEventListener("click",doLogFunctions);
      }

      else
      {
        switch(button.value)
        {
          case "x!":
            break;
          case "√":
            button.addEventListener("click",function() 
            {
              let display = document.getElementById("display");

              let val = parseFloat(display.value);
            
               display.value = String(Math.sqrt(val));
            });
            break;
          case  "(":
            break;  
          case ")":
             break;  
          case "x^2":
            button.addEventListener("click",function() 
            {
              let display = document.getElementById("display");

              let val = parseFloat(display.value);
              
              display.value = String(Math.pow(val,2));
            });
            break;
          case "x^y":
            break;
        }
      }
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

    //go through each row of the table
    for(; rowNum < rowNums; rowNum++)
    {
      //get that specific row
      tableRow = document.getElementById("row" + String(rowNum));

      //start from the fourth element of that row
      while(tableRow.children.length > 4)
      {
        //and all the elements to the right of the fourth element on that row
       tableRow.children[4].remove();
      }
    }

    //change the width of the display to its original size
    display.style.width = String(100 * tableRow.children.length) + "px";

    display.parentElement.colSpan = String(tableRow.children.length);

    //round out the bottom right corner of the calculator
    tableRow.children[3].children[0].style.borderBottomRightRadius = "20px";
  }
}

function doTrigFunctions()
{
  let display = document.getElementById("display")

  let val = parseFloat(display.value);

  switch(event.target.value)
  {
    case "sin":
      Math.sin(val);
      break;
    case "cos":
      Math.cos(val);
      break;
    case "tan":
      Math.tan(val);
      break;
    case "sin-1":
      Math.asin(val);
      break;
    case "cos-1":
      Math.acos(val);
      break;
    case "tan-1":
      Math.atan(val);
      break;
  }
}

function doLogFunctions()
{
  let display = document.getElementById("display")

  let val = parseFloat(display.value);

  switch(event.target.value)
  {
    case "ln":
      Math.log(val);
      break;
    case "log":
      Math.log10(val);
      break;
  }
}

function inverseFunctions()
{

}

function enableDarkMode()
{

}

function disableDarkMode()
{
  
}


