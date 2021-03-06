let clickedCoord;
let shipIndex=0; //start on carrier
let currentShip;
let coordsLocked=false;
let playerTurn=true;
let keepGoing=false;


const grid={
 column:["A","B","C","D","E","F","G","H","I","J"],
 row:[0,1,2,3,4,5,6,7,8,9]
}


function Player(idPrefix){
	this.idPrefix=idPrefix;
	this.unusedCoords=setGrid(idPrefix);
	this.lockedCoords=[];
	this.ships=[	
		new Ship("carrier", 5, "blue"),
		new Ship("battleship", 4, "grey"),
		new Ship("submarine", 3, "green"),
		new Ship("cruiser", 3, "orange"),
		new Ship("destroyer", 2, "gold")
	];	
}

function Ship(name,size,color){
	this.name=name;
	this.size=size;
	this.coordinates=[];
	this.color=color;
	this.background=[];
}

Ship.prototype.setShip = function(){
	// console.log(this.name);
	this.coordinates.push(clickedCoord);
	// console.log(this.coordinates);
	spliceCoords(player.unusedCoords,clickedCoord);
	drawShip(this);
};



const opponent= new Player("O");
const player = new Player("P");

// console.log(player.ships);
// console.log(opponent.ships);
// opponent.ships[0].coordinates.push("3A");
// console.log(player.ships[0].coordinates);
// console.log(opponent.ships[0].coordinates);

// console.log(`player id is ${player.idPrefix}`);


//let unusedCoords=setGrid();
// console.log(unusedCoords);

//build grid of unused coordinates to pull from
function setGrid(idPrefix){
	let arr = [];
	grid.row.forEach(row=>{
		for(let i=0; i<grid.column.length; i++){
			arr.push(idPrefix+row+grid.column[i]);
		}
	});
	return arr;
}

//DOM selectors
const opponentGrid=document.querySelectorAll(".row-content-container.opponent>div");
const playerGrid=document.querySelectorAll(".row-content-container.player>div");

const nextBtn=document.querySelector(".forward");
const resetBtn=document.querySelector(".reset");
const instructions=document.querySelector(".instructions span");

//lock in coordinates and move to next ship
nextBtn.addEventListener("click",()=>{
	//lock placed coords before resetting guides
	coordsLocked=true;
	resetBtn.disabled=true;
	nextBtn.disabled=true;
	
	if(shipIndex<5){
		shipIndex++; 
		// console.log(`ship index now ${shipIndex}`);
	}

	if(shipIndex===4){
		nextBtn.innerHTML="Finish";
	}



	resetGuides();
	
	//stop setting pieces after all ships are placed
	 if(shipIndex===5){
	 	instructions.textContent=`Get ready to play!`
		playerGrid.forEach(tile=>{
			tile.removeEventListener("click", chooseCoord);
 		});
 		playerTurn=false;
 		opponentTurn();
	 }else{
	 	instructions.textContent=`Click grid below to place ${player.ships[shipIndex].name}`;
	 }	
	
});


//************************************RESETS*****************************************//
//undo ship placement
resetBtn.addEventListener("click", clearShip);

//remove from grid highlights indicating correct ship placement
function resetGuides(){
	playerGrid.forEach(tile=>{
	
		//tile.innerHTML="";
		
		 tile.classList.remove("highlight");
		 tile.classList.remove("lowlight");
		// tile.classList.remove("transparent");

		//prevents overwriting a placed ship
		if(player.unusedCoords.includes(tile.id)){
			tile.addEventListener("click", chooseCoord);
		}
	})

}

//remove all formatting classes from grid
function resetClasses(tile){
	
		tile.className="";
		tile.classList.add("grid");
		tile.classList.add("row");
	
}

//erase ship from grid
function clearShip(){
	//resetGuides();
	nextBtn.disabled=true;
	console.log(`ship coords before: ${currentShip.coordinates}`);
	//console.log(`unusedCoords before:${player.unusedCoords}`);
	currentShip= player.ships[shipIndex];
	console.log(`current ship: ${currentShip.name}`);
	let tile;
	let length = currentShip.coordinates.length;
	console.log(`length:${length}`);
	for(let i=length-1; i>=0; i--){
		console.log(`current ship coord:${currentShip.coordinates[i]}`);
		
		//remove from drawing
		 tile = document.getElementById(`${currentShip.coordinates[i]}`);
		// tile.classList.add("transparent");
		 tile.innerHTML="";
		 resetClasses(tile);
	
		//remove from grid
		let popCoord =currentShip.coordinates.pop();
		//console.log(`popped coord: ${popCoord}`);
		player.unusedCoords.push(popCoord);

	};
	resetGuides();
	console.log(`ship coords: ${currentShip.coordinates}`);
	//console.log(`unusedCoords after:${player.unusedCoords}`);
	
};

//***********************************************************************************//





//********************************BUILDS*********************************************//
//build ship around random coordinate
opponent.ships.forEach(ship=>{
	getStartCoord(ship);
	
});

// create function to determine coordinates
function getRandCoord(){
	let startRow =getRandomInt(grid.row.length);
	let startColumn = grid.column[getRandomInt(grid.column.length)];
	return {row:startRow, column:startColumn};
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getStartCoord(ship){

//flip coin for 0 or 1
	let axis = getRandomInt(2);
	let secondAxis;
	// console.log(axis);
	if(axis===0){
		secondAxis=1;
	}else{
		secondAxis=0;
	}
	//  0 = build along y-aix (increase row count 123)
	// 1 = build along x-axis (increase column count ABC)
	let startCoord=getRandCoord();
	let axisType=Object.keys(startCoord)[axis]; //map axis result to row or column
	let secondAxisType=Object.keys(startCoord)[secondAxis];
	// console.log(`second axis type is ${secondAxisType}`);

	// console.log(`primary axis type is ${axisType}`);
	// console.log(`starting coord is ${startCoord.row},${startCoord.column}`);
	
	//avoids passing too many params
	let build= 	{
				startCoord:startCoord,
				axisType:axisType,
				secondAxisType:secondAxisType
			};
	checkCoordinates(ship,build);
}


//add the ship's length to the starting coord to make sure space exists, if not, pick another starting coord
function checkCoordinates(ship,build){

	// console.log(`within function, startCoord[row]: ${startCoord[axisType]}`);

	// console.log(`start at index ${grid[axisType].indexOf(startCoord[axisType])}`);

	let index = grid[build.axisType].indexOf(build.startCoord[build.axisType]);
	// console.log(`index is ${index}`);
	// console.log(`index+ ship size is ${index+ship.size-1}`);

	//using build for all variables that would normally be global
	build.index=index;
	build.ship=ship;

	if(!grid[build.axisType][index+ship.size-1]){
		//console.log(`${ship.name} won't fit here`);
		getStartCoord(build.ship);

	}else{
		//console.log(`${ship.name} should fit here`);
		let tempCoords =mapCoordinates(build);	

			// check for overlap before building
		if(tempCoords.every(coord=>noOverlap(coord,opponent))){
			buildShip(build.ship,tempCoords,build.axisType)
		}else{
			//console.log("ship overlaps, no good");
			getStartCoord(build.ship);
		}

	}

}

function mapCoordinates(build){
	let tempCoords =[];
	for(let i=build.index; i<build.index+build.ship.size; i++){
		let secondAxisType=build.secondAxisType;
		let rowCoord, colCoord; //build in same order as HTML "id"s
		if(build.axisType==="row"){
			rowCoord=grid[build.axisType][i];
			colCoord=build.startCoord[secondAxisType];
		}else{
			rowCoord=build.startCoord[secondAxisType];
			colCoord=grid[build.axisType][i];
		}

		let coord= "O"+rowCoord+colCoord;
		// if(!(unusedCoords.includes(coord))){
		// 	console.log("ship overlaps, no good");
		// 	break;
		// }
		// console.log(`in build ship, 2nd axis is ${secondAxisType}`);

		//console.log(`coord is ${build.axisType}:${grid[build.axisType][i]},${build.startCoord[secondAxisType]}`);

		
		tempCoords.push(coord); //will check these for overlap
		// console.log(`tempCoords are ${tempCoords}`);
		// console.log(unusedCoords);
		// console.log(`ship has coordinates:${build.ship.coordinates}`);
		
	}

	return tempCoords;
	//HOW MAPCOORDS LOOKED WITHOUT RETURNING. this was moved to checkCoords
	// console.log(tempCoords.every(noOverlap));
	
	// if(tempCoords.every(coord=>noOverlap(coord,opponent))){
	// 	buildShip(build.ship,tempCoords,build.axisType)
	// }else{
	// 	//console.log("ship overlaps, no good");
	// 	getStartCoord(build.ship);
	// }
	
};



function buildShip(ship,tempCoords,axisType){
	tempCoords.forEach((coord,index)=>{
		ship.coordinates.push(coord);
		//move to draw ship eventually
	
		ship.background.push(`${ship.name}/${ship.name}${index}${axisType}.png`);
		//console.log(`ship's backgrnd ${ship.background}`);

		//end move to draw ship
		
		// opponent.unusedCoords.splice((opponent.unusedCoords.findIndex(el=>el===coord)),1);
		spliceCoords(opponent.unusedCoords,coord);
		drawShip(ship);
	})
};

function spliceCoords(array,coord){
	// console.log(`unused before: ${person.unusedCoords}`);
		array.splice((array.findIndex(el=>el===coord)),1);
	// person.unusedCoords.splice((person.unusedCoords.findIndex(el=>el===coord)),1);
	// console.log(`unused after: ${person.unusedCoords}`);
};

function drawShip(ship){ 
	// console.log(`in drawShip, ship is${ship.name}`);
	// console.log(`ship coordinates are ${ship.coordinates[0]}`);
	let tile;
	ship.coordinates.forEach((coordinate,index)=>{
		// if(grid===playerGrid){
		// console.log(`matched grid to player grid`);
	
		tile=document.getElementById(coordinate);
		
		// }else{
		// 	console.log(`matched grid to opponent grid`);
		// 	tile=document.getElementById(`O0A`);
		// }
		
		tile.innerHTML="Y";
	
		tile.style.backgroundImage=`url(${ship.background[index]})`;
		tile.style.backgroundPosition="center";
		tile.style.backgroundRepeat= "no-repeat";
		tile.style.backgroundSize="contain";
			//tile.style.backgroundColor=ship.color;
			tile.classList.add(`${ship.name}`);
		// console.log(tile);
	})
};



//***************************PLAYER BUILDS*********************************************//

//create player grid

playerGrid.forEach(tile=>{
tile.addEventListener("click", chooseCoord);
});

//add selected tile to ship coordinate
function chooseCoord(e){
	coordsLocked=false;
	
	resetBtn.disabled=false;
	// console.log(`next button disabled is ${nextBtn.disabled}`);
	// console.log(`ship index is ${shipIndex}`)
	clickedCoord=e.target.id;
	// console.log(`clickedCoord is ${clickedCoord}`);
	
	currentShip=player.ships[shipIndex];

	if((!coordsLocked)||(shipIndex<4)){
		getRow(clickedCoord,e,currentShip);
	}
	
	//console.log(`current ship coords are ${currentShip.coordinates}`);
		
		//check if all the pieces of a ship have been placed
		if(currentShip.coordinates.length<currentShip.size){
			currentShip.setShip();
		 	// console.log(currentShip.coordinates);
		}


		//separate if statement so it takes place in same click
		if(currentShip.coordinates.length===currentShip.size){
			// console.log(`finished placing ${currentShip.name}`);
			nextBtn.disabled=false;
			// console.log(`next button disabled is ${nextBtn.disabled}`);
		}
		
		
			
};



//highlight rows and columns where ship placement is available
function getRow(clickedCoord,e,ship){


	//prevent placing 2 ship tiles on same coordinate
	e.target.removeEventListener("click",chooseCoord);
	
	//determine acceptable range based on ship size
	// let row,column,sameRow,sameCol;
	// row=clickedCoord.charAt(1);
	// column=clickedCoord.charAt(2);
	// let indexRow=grid['row'].indexOf(parseInt(row));
	// let indexCol=grid['column'].indexOf(column);
	// let rowMaxRange=indexRow+ship.size-1;
	// let rowMinRange=indexRow-(ship.size-1);
	// let colMaxRange=indexCol+ship.size-1;
	// let colMinRange=indexCol-(ship.size-1);
	
	
	// [row,column,rowMaxRange,rowMinRange,colMaxRange,colMinRange]=getMaxRange(clickedCoord,ship.size);
	let range=getMaxRange(clickedCoord,ship.size);
	 console.log(range);
	
	[row,column]=range;
	 // console.log(`row is ${row}, and row index is ${indexRow}`);
	 // 	console.log(`column is ${column}, and col index is ${indexCol}`);
	
	
	playerGrid.forEach(tile=>{
		
		let index = getIndex(tile.id);
		// let index=[tileRowIndex,tileColIndex];
		//console.log(index);
		
		//console.log(`tile:${tile.id} tileColIndex:${tileColIndex}`);
		
		//how to calculate distance between two grid points?
		//console.log(`${tile.id}Passes rowMaxRange test${tileRowIndex<=rowMaxRange}`);
		//console.log(`${tile.id}Passes rowMinRange test${tileRowIndex>=rowMinRange}`);
		// console.log(`${tile.id}Passes colMinRange test${tileColIndex>=colMinRange}`);
		// console.log(`${tile.id}Passes colMaxRange test${tileColIndex>=colMaxRange}`);


		//console.table(tile.id,a,b);
		// if(noOverlap(clickedCoord,player) && (tile!==e.target) 
		// 	&& (sameRow||sameCol) && (tileRowIndex<=rowMaxRange) && (tileRowIndex>=rowMinRange) && (tileColIndex<=colMaxRange) && (tileColIndex>=colMinRange)){ 
			// console.log(`inRange: ${inRange(index,range)}`);

		if(noOverlap(clickedCoord,player) && (tile!==e.target) 
			&& sameRowOrCol(tile.id,row,column) && (inRange(index,range))){
				
			tile.classList.add("highlight");
		// console.log(tile);
		
		
		}else{
			tile.classList.add("lowlight");
			tile.removeEventListener("click", chooseCoord);
			
		}
	})
	

};


//********************************GUESSING*********************************************//
//check if guess is a hit or miss

let guesses = [];
let  nextguess =[];
let orderedGuess=[];
let firstHit, secondHit;

opponentGrid.forEach(tile=>{
	tile.addEventListener("click", checkPlayerGuess);
});

function checkPlayerGuess(e){
	console.log(this);
	let id =e.target.id;
	if(opponent.unusedCoords.includes(id)){
		console.log(`Miss on ${id}`);
		this.style.backgroundColor="white";
	}else{
		console.log(`Hit on ${id}`);
		this.style.backgroundColor="red";
		hitShip(id,opponent);
	}
};


function checkOppGuess(guess){
	let id = document.getElementById(guess);

	console.log(id.id);
	if(player.unusedCoords.includes(id.id)){
		console.log(`Miss on ${id.id}`);
		// lastHit=false;
		id.style.backgroundColor="white";
	}else{
		console.log(`Hit on ${id.id}`);
		console.log("initializing nextguess");
		if(!keepGoing){
			orderedGuess=getOrderedGuess(id.id);
		}
		
		keepGoing=true;
		console.log(`keep going is true`);
		hitShip(id.id,player);
		//lastHit=true;
		id.style.backgroundColor="red";
		
		
	}
	return id.id ;
}


//determine which ship was hit
function hitShip(id,person){
	
	person.ships.forEach(ship=>{
		if(ship.coordinates.includes(id)){
			console.log(`${ship.name} was hit!`);
			if(!firstHit){
				firstHit=id;
				console.log(`firstHit is ${firstHit}`);
			}else{
				secondHit=id;
				console.log(`secondHit is ${secondHit}`);
			}
			
			//remove tile from ship's coordinates
			ship.coordinates.splice((ship.coordinates.findIndex(el=>el===id)),1);
			console.log(`ship's coordinates length now${ship.coordinates.length}`);
			//check if sunk
			hasSunk(ship,person);
		
		}
	})
	
}
//check if ship has sunk
function hasSunk(ship,person){
	if(ship.coordinates.length===0){
		console.log(`${ship.name} has sunk!`);
		console.log(person.ships.findIndex(el=>el.name===ship.name,1))
		person.ships.splice(person.ships.findIndex(el=>el.name===ship.name),1);
		person.ships.forEach(ship=>console.log(`ships include ${ship.name}`));
			// console.log(`ships are now ${person.ships}`);
		// lastHit=false;
		// shipSunk=true;
		keepGoing=false;
		console.log(`keep going is false`);
		firstHit="";
		secondHit="";
		nextguess=[];
		document.getElementById(ship.name).style.textDecoration="line-through";
	
	}
	// }else{
	// 	// shipSunk=false;	
	// }

}

//create array of next guesses ordered by hit probability
function getOrderedGuess(lastGuess){
	
	let space = largestShip();

	let range =getMaxRange(lastGuess,space);
		[row,column]=range;
		console.log(range);
	let closest =getMaxRange(lastGuess,2);
		console.log(closest);
	nextguess=[];	
	playerGrid.forEach(tile=>{
		let index = getIndex(tile.id);


		if((!guesses.includes(tile.id)) && (tile.id!==lastGuess) && (sameRowOrCol(tile.id,row,column)) && (inRange(index,range))){
			nextguess.push(tile);
		// 	console.log(`last was ${lastGuess}, ${coord} passes the tests`); 
		// }
		}

	});

	//FIX THIS
	
	orderedGuess=[];
	 for(let i=2; i<=space; i++){ //ship sizes
		nextguess.forEach(tile=>{
			closest=getMaxRange(lastGuess,i);
			let index=getIndex(tile.id);
			//console.log(orderedGuess.includes(tile));
			if(!orderedGuess.includes(tile) && inRange(index,closest)){
				tile.innerHTML=`${i}`;
				orderedGuess.push(tile);
			}
		})
		
		console.log(orderedGuess);
	 }



	//console.log(orderedGuess);

	return orderedGuess;

}

function makeGuess(lastGuess){
	let coord;
	
	// let space = largestShip();

	if(keepGoing){ //guess based on last hit coordinate
		
		// let range =getMaxRange(lastGuess,space);
		// [row,column]=range;
		// console.log(range);
		
		// playerGrid.forEach(tile=>{
		// 	let index = getIndex(tile.id);


		// 	if((!guesses.includes(tile.id)) && (tile.id!==lastGuess) && (sameRowOrCol(tile.id,row,column)) && (inRange(index,range))){
		// 		nextguess.push(tile);
		// 	// 	console.log(`last was ${lastGuess}, ${coord} passes the tests`); 
		// 	// }
		// 	}
		// });

		// console.log(nextguess);
		

		//ORDERED GUESS[0].id WAS HERE


		//coord ="P"+guess.row+guess.column;

		let [row,column]=getIndex(firstHit);
	 if(secondHit){
	 	console.log("check for sharedAttr");
	 	
	 	let sharedAttr=getSharedAttr(secondHit,row,column);
	 	console.log(`firstHit:${firstHit}, secondHit:${secondHit}`);
	 	console.log(`sharedAttr  is ${sharedAttr}`);
		orderedGuess= orderedGuess.filter(coord=>coord.id.includes(sharedAttr));
		console.log(orderedGuess);
	 }
	 console.log(orderedGuess.length);
		coord=orderedGuess[0].id;
		orderedGuess.shift();
		console.log("after splicing, orderedGuess is");
		console.log(orderedGuess);
		console.log(orderedGuess.length);
	
	}else{ //guess at random
		let guess = getRandCoord();
		coord ="P"+guess.row+guess.column;
		console.log(coord);

		//make sure coord hasn't been guessed before
		while(guesses.includes(coord)){
		//console.log(`already guessed ${coord}`);
			guess=getRandCoord();
			coord="P"+guess.row+guess.column;
		}

	}
		
	guesses.push(coord);

	//console.log(guesses);
	return coord;
	
}



function opponentTurn(){
	let lastGuess;
	for(i=0; i< 30; i++){
	
		let guess =makeGuess(lastGuess);
		lastGuess=checkOppGuess(guess);
	
		console.log(`just checked ${lastGuess}`);
		
	}

}





/**************************************UTILITY FUNCTIONS******************************************/
function getIndex(tile){
	let row = tile.charAt(1);
	let column=tile.charAt(2);
	let tileRowIndex=grid["row"].indexOf(parseInt(row));
	let tileColIndex=grid["column"].indexOf(column);

	//restore these if there's a problem
	// let tileRowIndex=grid["row"].indexOf(parseInt(tile.charAt(1)));
	// let tileColIndex=grid["column"].indexOf(tile.charAt(2));
	// return [tileRowIndex,tileColIndex];

	return [row,column,tileRowIndex,tileColIndex];
}

function sameRowOrCol(tile,row,column){

	sameRow = tile.includes(row);
	sameCol= tile.includes(column);
	//console.log(`same row:${sameRow} sameCol${sameCol}`);

	return sameRow || sameCol;
}

function getSharedAttr(tile,row,column){
	if(tile.includes(row)){
		return row;
	}else{
		return column;
	}
}

function inRange(index,range){

	[row,column,rowMaxRange,rowMinRange,colMaxRange,colMinRange]=range;
	[,,tileRowIndex,tileColIndex]=index;

	 // console.log(`row is ${row}`);
	 // 	console.log(`column is ${column}`);
	 // 	console.log(`max distance from row index:${rowMaxRange}`);
	 // 	console.log(`min distance from row index:${rowMinRange}`);
	 // 	console.log(`max distance from col index:${colMaxRange}`);
	 // 	console.log(`Min distance from col index:${colMinRange}`);
	 // 	console.log(`tileRowIndex is ${tileRowIndex}`);
	 // 	console.log(`tileColIndex is ${tileColIndex}`);



	// console.log((tileRowIndex<=rowMaxRange) && (tileRowIndex>=rowMinRange) && (tileColIndex<=colMaxRange) && (tileColIndex>=colMinRange));
	return (tileRowIndex<=rowMaxRange) && (tileRowIndex>=rowMinRange) && (tileColIndex<=colMaxRange) && (tileColIndex>=colMinRange);

}

function noOverlap(coord, person){
		// console.log(` no overlap coord is ${coord}`);
		return person.unusedCoords.includes(coord);
	}

function getMaxRange(coord,size){
	
	// console.log(`calculating max range based off ${coord} `);


	//restore these if there's a problem
	// 	let row,column;
	// row=coord.charAt(1);
	// column=coord.charAt(2);
	// let indexRow=grid['row'].indexOf(parseInt(row));
	// let indexCol=grid['column'].indexOf(column);

	let [row,column, tileRowIndex, tileColIndex]=getIndex(coord);

	let rowMaxRange=tileRowIndex+(size-1);
	let rowMinRange=tileRowIndex-(size-1);
	let colMaxRange=tileColIndex+(size-1);
	let colMinRange=tileColIndex-(size-1);


	
	return [row,column,rowMaxRange,rowMinRange,colMaxRange,colMinRange];

}


function smallestShip(){
	//return size of smallest ship still standing
	let smallest =5;
	player.ships.forEach(ship=>{
		if(ship.size<smallest){
			smallest=ship.size;
		}
	})
	console.log(`smallest ship standing is ${smallest}`);
	return smallest;
}

function largestShip(){
	let largest=2;
	player.ships.forEach(ship=>{
		if(ship.size>largest){
			largest=ship.size;
		}
	})
	console.log(`largest ship standing is ${largest}`);
	return largest;
}

//check guess()
	//if(checkHit){ 
		//mark red on ship + update ship coordinate length

		//if (checkSunk){
			// run function determining the smallest ship stilll standing, use its length as the max range for next guess distance from the random hit coord,
			//e.g when destroyer sinks:
			//update next get random to within 2 spaces

			//e.g. when sub and cruiser sink:
			//update next get random to within 3 spaces
			//when battleship sinks:
			//update next get random to within 4 spaces
		//}else{
			//get next random coord from within 1 spaces of hit
		//}
	
		
		

	// if miss, mark white space on player grid


	//run function determining largest ship still standing, use its length as max empty space in grid to guess from
			//e.g. if battleship is largest, only guess in places where there are 4 empty spots



			//if you have a hit, initialize array of possible guesses based on that hit. keep using that array regardless of hits or misses until the ship sinks. when the ship sinks, reset possible guess array  to [];

			//a hit triggers intitalize array and turns keepgoing ON
			//initialize array
			//sinking a ship turns keepgoing OFF and triggers reset
			//reset


			//compare first hit and second hit to see whether they share a row or share a column. only guess tiles that have that same shared attribute.
