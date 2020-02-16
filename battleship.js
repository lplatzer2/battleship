

let clickedCoord;
let shipIndex=0; //start on carrier
let currentShip;
let shipFinished=false;

const grid={
 column:["A","B","C","D","E","F","G","H","I","J"],
 row:[0,1,2,3,4,5,6,7,8,9]
}


function Player(idPrefix,ships){
	this.idPrefix=idPrefix;
	this.unusedCoords=setGrid(idPrefix);
	this.lockedCoords=[];
	this.ships=ships;
	let parent =this;
	// [
	// 	{
	// 		name:"carrier",
	// 		size:5,
	// 		coordinates:[], 
	// 		color:"blue", 
	// 		// setShip: function(){
	// 		// 	console.log(this.name);
	// 		// 	this.coordinates.push(clickedCoord);
	// 		// 	console.log(this.coordinates);
	// 		// 	console.log(`going into drawShip, this is:${this.name}`)
	// 		// 	drawShip(this);
	// 		// }		
	// 	},
	// 	{	name:"battleship",
	// 		size:4,
	// 		coordinates:[],
	// 		color:"grey",
	// 		// setShip:function(){
	// 		// 	console.log(this.name);
	// 		// 	this.coordinates.push(clickedCoord);
	// 		// 	console.log(this.coordinates);
	// 		// 	drawShip(this);
	// 		// }	
	// 	},
	// 	{	name:"submarine",
	// 		size:3,
	// 		coordinates:[],
	// 		color:"green", 
	// 		// setShip:function(){
	// 		// 	console.log(this.name);
	// 		// 	this.coordinates.push(clickedCoord);
	// 		// 	console.log(this.coordinates);
	// 		// 	drawShip(this);
	// 		// }	
	// 	},
	// 	{	name:"cruiser",
	// 		size:3,
	// 		coordinates:[],
	// 		color:"orange",
	// 		// setShip:function(){
	// 		// 	console.log(this.name);
	// 		// 	this.coordinates.push(clickedCoord);
	// 		// 	console.log(this.coordinates);
	// 		// 	drawShip(this);
	// 		// }	
	// 	},
	// 	{	name:"destroyer",
	// 		size:2,
	// 		coordinates:[],
	// 		color:"gold",
	// 		// setShip:function(){
	// 		// 	console.log(this.name);
	// 		// 	this.coordinates.push(clickedCoord);
	// 		// 	console.log(this.coordinates);
	// 		// 	drawShip(this);
	// 		// }	
	// 	}
	// ];

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
	//lock coordinates
	// console.log(this.coordinates);
	spliceCoords(player,clickedCoord);
	drawShip(this);
};




const opponent= new Player("O",[
	new Ship("carrier", 5, "blue"),
	new Ship("battleship", 4, "grey"),
	new Ship("submarine", 3, "green"),
	new Ship("cruiser", 3, "orange"),
	new Ship("destroyer", 2, "gold")
	]);

const player = new Player("P",[
	new Ship("carrier", 5, "blue"),
	new Ship("battleship", 4, "grey"),
	new Ship("submarine", 3, "green"),
	new Ship("cruiser", 3, "orange"),
	new Ship("destroyer", 2, "gold")
	]);
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

let opponentGrid=document.querySelectorAll(".row-content-container.opponent>div");
let playerGrid=document.querySelectorAll(".row-content-container.player>div");

let nextBtn=document.querySelector(".forward");
let resetBtn=document.querySelector(".reset");

nextBtn.addEventListener("click",()=>{
	if(shipIndex<4){
		shipIndex++; 
	}
	if(shipIndex===4){
		nextBtn.innerHTML="Finish";
	}
	//reset highlights
	// playerGrid.forEach(tile=>{
	// 	 tile.classList.remove("highlight");
	// 	 tile.classList.remove("lowlight");
	// });

	//lock placed coords before resetting guides
	resetGuides();
	shipFinished=true;
});
resetBtn.addEventListener("click", clearShip);


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

function resetClasses(tile){
	
		tile.className="";
		tile.classList.add("grid");
		tile.classList.add("row");
	
}


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

	

	// console.log(tempCoords.every(noOverlap));
	
	if(tempCoords.every(coord=>noOverlap(coord,opponent))){
		buildShip(build.ship,tempCoords,build.axisType)
	}else{
		//console.log("ship overlaps, no good");
		getStartCoord(build.ship);
	}
	
};

function noOverlap(coord, person){
		// console.log(` no overlap coord is ${coord}`);
		return person.unusedCoords.includes(coord);
	}

function buildShip(ship,tempCoords,axisType){
	tempCoords.forEach((coord,index)=>{
		ship.coordinates.push(coord);
		//move to draw ship eventually
	
		ship.background.push(`${ship.name}/${ship.name}${index}${axisType}.png`);
		//console.log(`ship's backgrnd ${ship.background}`);

		//end move to draw ship
		
		// opponent.unusedCoords.splice((opponent.unusedCoords.findIndex(el=>el===coord)),1);
		spliceCoords(opponent,coord);
		drawShip(ship);
	})
};

function spliceCoords(person,coord){
	// console.log(`unused before: ${person.unusedCoords}`);
	person.unusedCoords.splice((person.unusedCoords.findIndex(el=>el===coord)),1);
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

//check if guess is a hit or miss

opponentGrid.forEach(tile=>{
	tile.addEventListener("click", checkGuess);
});

function checkGuess(e){
	console.log(this);
	let id =e.target.id;
	if(opponent.unusedCoords.includes(id)){
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
	opponent.ships.forEach(ship=>{
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

//create player grid

playerGrid.forEach(tile=>{
tile.addEventListener("click", chooseCoord);
});


function chooseCoord(e){
	console.log(`ship index is${shipIndex}`)
	clickedCoord=e.target.id;
	// console.log(`clickedCoord is ${clickedCoord}`);
	if((!shipFinished)||(shipIndex<4)){
		getRow(clickedCoord,e);
	}
	

	currentShip=player.ships[shipIndex];
	//console.log(`current ship coords are ${currentShip.coordinates}`);
		
		//check if all the pieces of a ship have been placed
		if(currentShip.coordinates.length<currentShip.size){
			shipFinished=false;
			currentShip.setShip();
		 	console.log(currentShip.coordinates);
		 	nextBtn.disabled=true;
		}
		//separate if statement so it takes place in same click
		if(currentShip.coordinates.length===currentShip.size){
			console.log(`finished placing ${currentShip.name}`);
			//shipIndex++; 
			nextBtn.disabled=false;
		}
		
		//stop setting pieces after all ships are placed
		 if(shipIndex===4 && shipFinished){
			nextBtn.disabled=true;
			playerGrid.forEach(tile=>{
				tile.removeEventListener("click", chooseCoord);
			});
		}	
};


function getRow(clickedCoord,e){
	// let playerArr=Array.from(playerGrid);
	// let filterArr=playerArr.filter(function(coord){
	// 	return playerArr[coord].id.includes(clickedCoord.charAt(1)|| clickedCoord.charAt(2));
	// });

	e.target.removeEventListener("click",chooseCoord);

	playerGrid.forEach(tile=>{
		// console.log(tile.id);

		let sameRow = tile.id.includes((clickedCoord.charAt(1)));
		let sameCol= tile.id.includes((clickedCoord.charAt(2)));
		//console.table(tile.id,a,b);
		if(noOverlap(clickedCoord,player) && (tile!==e.target) 
			&& (sameRow||sameCol)){ //ADD && exists in player.unusedCoords
		tile.classList.add("highlight");
		 console.log(tile);
		
		
		}else{
			tile.classList.add("lowlight");
			tile.removeEventListener("click", chooseCoord);
			
		}
	})
	

};

//erase ship from grid
function clearShip(){
	//resetGuides();

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
	// if(shipIndex!=0&&shipFinished){
	// 	shipIndex--;
	// };
};