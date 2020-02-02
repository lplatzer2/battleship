//create ship objects
const ships=[
	{name:"carrier",size:5,coordinates:[]		},
	{name:"battleship",size:4,coordinates:[]	},
	{name:"submarine",size:3,coordinates:[]		},
	{name:"cruiser",size:3,coordinates:[]		},
	{name:"destroyer",size:2,coordinates:[]		}
]

const grid={
 column:["A","B","C","D","E","F","G","H","I","J"],
 row:[0,1,2,3,4,5,6,7,8,9]
}

// create function to determine coordinates
function getRandCoord(){
	let startRow =getRandomInt(9);
	let startColumn = grid.column[getRandomInt(9)];
	return {row:startRow, column:startColumn};
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



//build ship around random coordinate
ships.forEach(ship=>{

	//flip coin for 0 or 1
	let axis = getRandomInt(2);
	console.log(axis);
	//  0 = build along y-aix (increase row count 123)
	// 1 = build along x-axis (increase column count ABC)
	let startCoord=getRandCoord();
	let axisType=Object.keys(startCoord)[axis]; //map axis result to row or column
	console.log(`axis type is ${axisType}`);
	console.log(`starting coord is ${startCoord.row},${startCoord.column}`);
	
	console.log(startCoord[axisType]);

	checkCoordinates(axisType);


	function checkCoordinates(axisType){

		console.log(`within function, startCoord[row]: ${startCoord[axisType]}`);

		console.log(`start at index ${grid[axisType].indexOf(startCoord[axisType])}`);

		let index = grid[axisType].indexOf(startCoord[axisType]);
		console.log(`index is ${index}`);
		console.log(`index+ ship size is ${index+ship.size-1}`);

		if(!grid[axisType][index+ship.size-1]){
			console.log(`${ship.name} won't fit here`);
		}else{
			console.log(`${ship.name} should fit here`);	
		}
	}

	
	
	//add the ship's length to the starting coord to make sure space exists, if not flip directions + check again, if all 4 directions fail, pick another coordinate
});