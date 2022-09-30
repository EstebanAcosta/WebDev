function createRandomizedGrid()
{
    let buttons = [];

    for(let row = 1; row < 5; row++)
    {
        let buttonRow = document.getElementById("row"+ String(row));

        buttons.push(buttonRow.children);
    }

    // console.table(buttons);


}

createRandomizedGrid();