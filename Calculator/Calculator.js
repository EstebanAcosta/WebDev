//keep adding a digit to the end of the number until an arithmetic button is pressed
function displayNumber(number)
{
  let display = document.getElementById("display");

  if(display.value === "0")
  {
    display.value = number;
  }
  else
  {
      display.value += number;
  }
}

function arithmetic(operation)
{
  console.log(operation);
  
  if(operation === "+")
  {

  }
  else if(operation === "-")
  {

  }
  else if(operation === "*")
  {

  }
  else
   {

  }
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

}
