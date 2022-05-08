var sudokuGrid;
var numberOfGivens = 10;
var drawGrid, drawElement, drawSolutionNow, takesTooLongToExecute;

function generateGivensOnLoad() {
	// initialize the sudoku Grid
	sudokuGrid = [	[0,3,0,0,0,0],
					[0,0,0,1,0,0],
					[0,0,0,0,0,0],
					[0,0,0,0,6,0],
					[0,0,0,0,0,0],
					[0,0,0,0,0,0]	];
	
	drawGridWithGivens();
}

function generateGivens() {
	var i, j, candidate, indexX, indexY, position;
	
	disableButtons();
	emptyMessages();
	
	// New "empty" grid
	for (i = 0; i < 6; i++)
		for (j = 0; j < 6; j++)
			sudokuGrid[i][j] = 0;
	clearGrid();
	
	// Put random candidates and check if they conflict one another
	for (i = 0; i < numberOfGivens; i++) {
		do {
			candidate = Math.floor((Math.random() * 6) + 1); // 1 - 9
			do {
				indexX = Math.floor((Math.random() * 6) + 0); // 0 - 8
				indexY = Math.floor((Math.random() * 6) + 0); 
			} while (!sudokuGrid[indexX][indexY] == 0); // find an empty cell
		} while (!createsNoConflicts(indexX,indexY,candidate));
		sudokuGrid[indexX][indexY] = candidate;
	}
	
	drawGridWithGivens();
	enableButtons();
}

function drawGridWithGivens() {
	var i, j, indexId;
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 6; j++) {
			indexId = i + "" + j; 
			if (sudokuGrid[i][j] != 0) {
				document.getElementById(indexId).innerHTML = sudokuGrid[i][j];
				document.getElementById(indexId).setAttribute("class", "givenNumber");
			} else {
				document.getElementById(indexId).setAttribute("class", "solvingNumber");
			}
		}
	}
}

function drawFullGridSolution() {
	var i, j, indexId;
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 6; j++) {
			indexId = i + "" + j;
			document.getElementById(indexId).innerHTML = sudokuGrid[i][j];
		}
	}
}

function clearGrid() {
	var i, j, indexId;
	for (i = 0; i < 6; i++) {
		for (j = 0; j < 6; j++) {
			indexId = i + "" + j; 
			document.getElementById(indexId).innerHTML = "";
		}
	}
}

function createsNoConflicts(indexX,indexY,candidate) {
	var row, column, subGridLeftUpperRow, subGridLeftUpperColumn;
	
	// check row conflict
	for (column = 0; column < 6; column++) {
		if (sudokuGrid[indexX][column] == candidate) return false;
	}
	
	// check column conflict
	for (row = 0; row < 6; row++) {
		if (sudokuGrid[row][indexY] == candidate) return false;
	}
	
	// check sub-grid (3x3) conflict
	subGridLeftUpperRow = indexX - indexX % 2;
	subGridLeftUpperColumn = indexY - indexY % 2;
	 for (row = 0; row < 2; row++)
        for (column = 0; column < 2; column++)
			if (sudokuGrid[subGridLeftUpperRow + row][subGridLeftUpperColumn + column] == candidate) return false;
	
	return true;
}

async function solveSudokuPuzzle() {
	disableButtons();
	await sleep(100);
	
	drawGrid = [];
	takesTooLongToExecute = 0;
	
	if (solveUsingBacktrack()) {
		drawWithPauses();
		showImidiateSolutionButton(1);
	}
	else {
		createNewGenerationMessage();
		enableGenerateButton();
		disableSolveButton();
	}
}

function DrawSolutionNow() {
	drawSolutionNow = 1;
	drawFullGridSolution();
	showImidiateSolutionButton(0);
	disableSolveButton();
}

function solveUsingBacktrack() {
	var positionOfEmptyGrid, positionOfCandidate, candidate, row, column;
	
	positionOfEmptyGrid = findEmptyGrid();
	if (positionOfEmptyGrid == "") return true;
	
	row = positionOfEmptyGrid.charAt(0);
	column = positionOfEmptyGrid.charAt(1);
	positionOfCandidate = positionOfEmptyGrid;
	
	for (candidate = 1; candidate <= 6; candidate++) {
		if (createsNoConflicts(row,column,candidate)) {
			sudokuGrid[row][column] = candidate;
			
			//drawCandidate(row, column);
			drawElement = [positionOfCandidate, candidate];
			drawGrid.push(drawElement);
			
			if (solveUsingBacktrack())
				return true;
			sudokuGrid[row][column] = 0;
			
			// stop execution if drawGrid gets too large
			// This means that it takes too much time to find 
			// an actual solution using this backtrack algorithm
			if (drawGrid.length > 9000000) {
				takesTooLongToExecute = 1;
				return false;
			}
			
			//removeCandidateFromGrid(positionOfCandidate);
			drawElement = [positionOfCandidate,"0"];
			drawGrid.push(drawElement);
		}
	}
	return false;
}

async function drawWithPauses() {
	var i, j, position, candidate, row, column;
	console.log(drawGrid.length); // the bigger this is, the more time it will take to draw the solution
	
	drawSolutionNow = 0;
	for (i = 0; i < drawGrid.length; i++) {
			if (drawSolutionNow) 
				break;
			drawElement = drawGrid[i];
			position = drawElement[0];
			candidate = drawElement[1];
			if (candidate == "0") 
				document.getElementById(position).innerHTML = ""; // remove candidate from grid
			else
				document.getElementById(position).innerHTML = candidate; // draw the candidate
			await sleep(1);
	}
	enableGenerateButton();
	disableSolveButton();
	showImidiateSolutionButton(0);
	emptyMessages();
}

function findEmptyGrid() {
	var i, j, position = "";
	for (i = 0; i < 6; i++)
		for (j = 0; j < 6; j++)
			if (sudokuGrid[i][j] == 0) {
				position = i + "" + j;
				return position;
			}
	return position;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createNewGenerationMessage() {
	if (takesTooLongToExecute) {
		console.log(drawGrid.length);
		document.getElementById("messages").innerHTML = "Using a backtracking algorithm takes too long to find a solution - if there is one!" +
		" Try generating a new puzzle...";
	} else document.getElementById("messages").innerHTML = "This puzzle does not have a solution - try generating a new one!";
}

function showImidiateSolutionButton(show) {
	if (show) document.getElementsByClassName("solveButtonWithImidiateDrawing")[0].hidden = false;
	else document.getElementsByClassName("solveButtonWithImidiateDrawing")[0].hidden = true;
}

function emptyMessages() {
	document.getElementById("messages").innerHTML = "";
}

function disableButtons() {
	disableGenerateButton();
	disableSolveButton();
}

function disableGenerateButton() {
	document.getElementsByClassName("generateButton")[0].disabled = true;
}

function disableSolveButton() {
	document.getElementsByClassName("solveButton")[0].disabled = true;
}

function enableButtons() {
	enableGenerateButton();
	enableSolveButton();
}

function enableGenerateButton() {
	document.getElementsByClassName("generateButton")[0].disabled = false;
}

function enableSolveButton() {
	document.getElementsByClassName("solveButton")[0].disabled = false;
}

function drawCandidate(row, column) {
	var position = row + "" + column;
	document.getElementById(position).innerHTML = sudokuGrid[row][column];
}

function removeCandidateFromGrid(position) {
	document.getElementById(position).innerHTML = "";
}