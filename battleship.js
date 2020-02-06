//create ship objects
const ships=[
	{name:"carrier",size:5,coordinates:[], color:"blue"		},
	{name:"battleship",size:4,coordinates:[],color:"grey"	},
	{name:"submarine",size:3,coordinates:[],color:"green"	},
	{name:"cruiser",size:3,coordinates:[],color:"orange"	},
	{name:"destroyer",size:2,coordinates:[],color:"gold"	}
]

const grid={
 column:["A","B","C","D","E","F","G","H","I","J"],
 row:[0,1,2,3,4,5,6,7,8,9]
}


let unusedCoords=setGrid();
// console.log(unusedCoords);

//build grid of unused coordinates to pull from
function setGrid(){
	let arr = [];
	grid.row.forEach(row=>{
		for(let i=0; i<grid.column.length; i++){
			arr.push(row+grid.column[i]);
		}
	});
	return arr;
}

//build ship around random coordinate
ships.forEach(ship=>{
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
	console.log(axis);
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
	console.log(`second axis type is ${secondAxisType}`);

	console.log(`primary axis type is ${axisType}`);
	console.log(`starting coord is ${startCoord.row},${startCoord.column}`);
	
	//avoids passing too many params
	let build= 	{
				startCoord:startCoord,
				axisType:axisType,
				secondAxisType:secondAxisType
			};
	checkCoordinates(ship,build);
}


//add the ship's length to the starting coord to make sure space exists, if not flip directions + check again, if all 4 directions fail, pick another coordinate
	function checkCoordinates(ship,build){

		// console.log(`within function, startCoord[row]: ${startCoord[axisType]}`);

		// console.log(`start at index ${grid[axisType].indexOf(startCoord[axisType])}`);

		let index = grid[build.axisType].indexOf(build.startCoord[build.axisType]);
		console.log(`index is ${index}`);
		console.log(`index+ ship size is ${index+ship.size-1}`);

		//using build for all variables that would normally be global
		build.index=index;
		build.ship=ship;

		if(!grid[build.axisType][index+ship.size-1]){
			console.log(`${ship.name} won't fit here`);
			getStartCoord(build.ship);

		}else{
			console.log(`${ship.name} should fit here`);
			mapCoordinates(build);	
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

		let coord= rowCoord+colCoord;
		// if(!(unusedCoords.includes(coord))){
		// 	console.log("ship overlaps, no good");
		// 	break;
		// }
		// console.log(`in build ship, 2nd axis is ${secondAxisType}`);

		console.log(`coord is ${build.axisType}:${grid[build.axisType][i]},${build.startCoord[secondAxisType]}`);

		
		tempCoords.push(coord); //will check these for overlap
		console.log(tempCoords);
		// console.log(unusedCoords);
		// console.log(`ship has coordinates:${build.ship.coordinates}`);
	}

	function noOverlap(coord){
		return unusedCoords.includes(coord);
	}

	console.log(tempCoords.every(noOverlap));
	
	if(tempCoords.every(noOverlap)){
		buildShip(build.ship,tempCoords)
	}else{
		console.log("ship overlaps, no good");
		getStartCoord(build.ship);
	}
	
};

function buildShip(ship,tempCoords){
	tempCoords.forEach(coord=>{
		ship.coordinates.push(coord);
		unusedCoords.splice((unusedCoords.findIndex(el=>el===coord)),1);
		drawShip(ship);
	})
}

function drawShip(ship){ 
	ship.coordinates.forEach(coordinate=>{
		let tile=document.getElementById(coordinate);
		tile.innerHTML="Y";
		tile.style.backgroundColor=ship.color;
		// console.log(tile);
	})
};

//check if guess is a hit or miss
let opponentGrid=document.querySelectorAll(".row-content-container>div");
opponentGrid.forEach(tile=>{
	tile.addEventListener("click", checkGuess);
});

function checkGuess(e){
	console.log(this);
	let id =e.target.id;
	if(unusedCoords.includes(id)){
		console.log(`Miss on ${id}`);
		this.style.backgroundColor="white";
	}else{
		console.log(`Hit on ${id}`);
		this.style.backgroundColor="red";
		hitShip(id);
	}
};
//determine which ship was hit
function hitShip(id){
	ships.forEach(ship=>{
		if(ship.coordinates.includes(id)){
			console.log(`${ship.name} was hit!`);
			//remove tile from ship's coordinates
			ship.coordinates.splice((ship.coordinates.findIndex(el=>el===id)),1);
			console.log(`ship's coordinates length now${ship.coordinates.length}`);
			//check if sunk
			hasSunk(ship);
		}
	})
}
//check if ship has sunk
function hasSunk(ship){
	if(ship.coordinates.length===0){
		console.log(`${ship.name} has sunk!`);
		document.getElementById(ship.name).style.textDecoration="line-through";

	}


}