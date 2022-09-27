//keeps track of the total of the expression
let runningTotal = 0;

//stores the value that was just entered into the calculator
let previousVal = 0;

//stores the last operation that was perfomed
let previousOperation = "";

//stores how many times the equal operatiom has been called 
let countEqualCall = 0;

//keeps track of when we are/aren't doing arithmetic operations
let doingArithmetic = false;

//stores a string version of all the mathematical operations we've done on the calculator
let history = "";

/**
 * Makes sure to not start anything until the document is loaded
 */
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
    //reset all values
    display.value = "0";

    runningTotal = 0;

    previousVal = 0;

    history = "";
  });

  //negate button functionality
  $("#negate").on("click",function()
  {
    display.value = String(-1*parseFloat(display.value));
    previousVal = parseFloat(display.value);
  });

  //percentage button functionality
  $("#percentage").on("click",function()
  {
    display.value = String(parseFloat(display.value) / 100);
    previousVal = parseFloat(display.value);
  });

  //decimal point functionality
  $("#decimal").on("click",function()
  {
    if(!display.value.includes("."))
    {
      display.value+="."; 
      previousVal = parseFloat(display.value);
    }  
  });

  $(".operations").on("click", doArithmetic);

  $("#darkMode").on("click", enableDarkMode);

 });

  /**
   * arithmetic operations functionality
   */
   function doArithmetic(event)
   {
     let operation = event.target.value;
   
     let display = document.getElementById("display");
   
     //if the operation is an equals, add one to the var that keeps track of the num of times equal is called, otherwise reset it to zero. We reset it to zero in the second scenario because the equals button was not clicked more than two consecutive times
      operation === "=" ? countEqualCall++ : countEqualCall = 0;
   
      //if the operation we are performing isn't equals or if the equal sign hasn't been called more than two consecutive times, add the the number we just entered into history
     if(operation !== "=" || countEqualCall < 2 ) history += previousVal;
     //if there is no runningTotal (as in no math has been done yet), set it to the last number that was input
     if(runningTotal === 0) runningTotal = previousVal;
   
     //if there is a running total (we've already started doing some arithmetic)
     // and the last operation that was done is the same operation that we want to use now
     //perform the respective arithmetic operation
     else if(previousOperation === operation)
     {
         switch(operation)
         {
           case "+":
             runningTotal+=previousVal;
             break;
   
           case "-":
             runningTotal-=previousVal 
             break;
   
           case "*":
             runningTotal*=previousVal;
             break;
           
           case "/":
             runningTotal/=previousVal;
             break; 
   
           case "=":
             display.value = eval(history);
             break;
         }
         if(operation !== "=") display.value = String(runningTotal);
   
     }
   
     //if there is a running total (we've already started doing some arithmetic)
     // and the last operation that was done isn't the same operation that we want to use now
     else if(previousOperation !== operation)
     {
         //evaluate the expression before we perform the new operation
         //and display it on the calculator display
       runningTotal = eval(history);
   
       display.value = eval(history);
   
     }
   
    //add the new operation to the history as long as it's not an equals symbol
     if(operation != "=") history+=operation;
   
     console.log(history);
   
     //after we've used an operation, set that operation as the previous operation
     previousOperation = operation;
   
     //every time we've perfomed some kind of arithmetic, set this to true 
     //setting this to true tells the calculator when we
     //want to put more numbers after the operation
     doingArithmetic = true;
   }
   
   //shows the scientific buttons
   function showScientificOptions()
   {
     //gets the calculator display 
     let display = document.getElementById("display");
   
     //gets the scientific button from the calculator
     let scientificButton = document.getElementById("scientific");
   
     //creates a custom list of additional functions that will be added to the calculator
     const functions = ["sin", "cos" , "tan" , "sin-1" , "cos-1" , "tan-1" , "ln" , "log" , "x!" , "√" , "(" , ")" , "inv" , "x^2" , "x^3"];
   
     const trigFunctions = ["sin", "cos", "tan","sin-1" , "cos-1" , "tan-1"];
   
     const logFunctions = ["ln" , "log"];

     const canBeInversed = ["sin", "cos", "tan", "ln", "log"];
   
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

         if(canBeInversed.includes(button.value))
         {
            button.classList.add("inversed");
         }
   
         if(button.value === "inv")
         {
           button.addEventListener("click", inverseFunctions);
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
               button.addEventListener("click", function()
               {
                 display.value = String(factorial(parseFloat(display.value)));
               });
               break;
   
             case "√":
               button.addEventListener("click",function() 
               {
                 let display = document.getElementById("display");
               
                  display.value = String(Math.sqrt(parseFloat(display.value)));
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
   
                 display.value = String(Math.pow(parseFloat(display.value),2));
               });
               break;
   
             case "x^3":
               button.addEventListener("click",function() 
               {
                 let display = document.getElementById("display");
   
                 display.value = String(Math.pow(parseFloat(display.value),3));
               });
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
   
     //if the scientific button has basic on it
     else {
       //change the face of the button to say scientific
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
           //and remove the table data elements
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
   
   function doTrigFunctions(event)
   {
     let display = document.getElementById("display")
   
     switch(event.target.value)
     {
       case "sin":
         display.value = String(Math.sin(parseFloat(display.value)));
         break;
       case "cos":
        display.value = String(Math.cos(parseFloat(display.value)));
         break;
       case "tan":
        display.value = String(Math.tan(parseFloat(display.value)));
         break;
       case "sin-1":
        display.value = String(Math.asin(parseFloat(display.value)));
         break;
       case "cos-1":
        display.value = String(Math.acos(parseFloat(display.value)));
         break;
       case "tan-1":
        display.value = String(Math.atan(parseFloat(display.value)));
         break;
     }
   }
   
   function doLogFunctions(event)
   {
     let display = document.getElementById("display")
  
     switch(event.target.value)
     {
       case "ln":
         display.value = Math.log(parseFloat(display.value));
         break;
       case "log":
         display.value = Math.log10(parseFloat(display.value));
         break;
        case "e^x":
          display.value = Math.exp(parseFloat(display.value));
          break;
     }
   }
   
   function inverseFunctions()
   {
     let canBeInversed = document.querySelectorAll(".inversed");

     let trigFun = ["sec","csc","cot"];

     let logFun = ["e^x"];
   }
   
   function enableDarkMode()
   {

   }
   
   function disableDarkMode()
   {
     
   }

   function factorial(n)
   {
    if(n === 0 || n === 1) return 1;

    return n * factorial(n - 1);
   }
   
  



