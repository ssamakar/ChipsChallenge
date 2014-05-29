var game = new Phaser.Game(576, 416, Phaser.CANVAS, 'gamediv', { preload: preload, create: create, update: update, render: render});


function preload() {
	game.load.spritesheet('sprites', '../Assets/finaltileset.png', 32,32);
	game.load.tilemap('map', '../Assets/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', '../Assets/finaltileset.png');
	game.load.image('frame', '../Assets/frame.png');
}

//some variables we'll be needing down the road.
var timeCheck,
	inventory = {
		blue: 0, 
		red: 0, 
		green: 0, 
		yellow: 0, 
		chips: 0
	},
	totalChips = 11;

function create() {

	//timeCheck is used to delay user input later in the update() function.
	timeCheck = game.time.now;

	//0,0 is the upper left boundary of the world.
	//1024,1024 is the size of the game world, even though we're restricted to the small game field made up by the walls.
	game.world.setBounds(0,0,1024,1024);

	//this loads a physics system into the game.
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//Adding a map with two layers: lots of ground tiles we can walk on, 
	//and some wall tiles that will block our path.
	map = game.add.tilemap('map');
	map.addTilesetImage('tileset','tiles');
	map.createLayer('Tile Layer 1');
	wall = map.createLayer('Tile Layer 2');

	//The player will collide with the tiles at index 8 and 11 on Tile Layer 2.
	map.setCollision([8,11], true, 'Tile Layer 2');

	//adding the character sprites.
	//the first two arguments are x and y coordinates.
	//the third is the name of the spritesheet from which we're selecting an image.
	//the last argument is the spritesheet cell index we want.
	baddy = game.add.sprite(224,64, 'sprites', 40);

	//we create groups for certain elements because we want them to have similar behavior.
	doorsGroup = game.add.group();
	doorsGroup.create(416,416, 'sprites', 50); //red door
	doorsGroup.create(416,544, 'sprites', 43); //blue door

	keysGroup = game.add.group();
	keysGroup.create(576, 544, 'sprites', 41); //red key
	keysGroup.create(544,544, 'sprites', 34); //blue key

	chipsGroup = game.add.group();
	chipsGroup.create(416,352, 'sprites', 14);
	chipsGroup.create(608,352, 'sprites', 14);
	chipsGroup.create(352,448, 'sprites', 14);
	chipsGroup.create(672,448, 'sprites', 14);
	chipsGroup.create(448,480, 'sprites', 14);
	chipsGroup.create(576,480, 'sprites', 14);
	chipsGroup.create(352,512, 'sprites', 14);
	chipsGroup.create(672,512, 'sprites', 14);
	chipsGroup.create(512,544, 'sprites', 14);
	chipsGroup.create(480,640, 'sprites', 14);
	chipsGroup.create(544,640, 'sprites', 14);

	motherboard = game.add.sprite(512,384, 'sprites', 16);

	//adding the player last so he's rendered above everything else.
	player = game.add.sprite(game.world.width/2, game.world.height/2 - 32, 'sprites', 104);

	//enabling physics for the elements we just added.
	//we can toss everything into an array and enable physics for all of em at once.
	game.physics.arcade.enable([
		player,
		baddy,
		wall,
		doorsGroup,
		keysGroup,
		chipsGroup,
		motherboard
		]
		);

	//after enabling physics, we want to set the 'bodies' of some sprites to immovable.
	//if we collide with a baddy we don't want to be able to nudge him out of his path.
	//if we collide with a wall we don't want the wall to move.
	baddy.body.immovable = true;
	doorsGroup.setAllChildren('body.immovable', true);
	motherboard.body.immovable = true;


	//Chip won't be able to leave the bounds of the game world.
	//This is kind of unnecessary because he's walled in, but just in case.
	player.body.collideWorldBounds = true;

	//This makes sure the camera is fixed to Chip's x and y coordinates.
	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();

	//this is a tween function. This makes a predetermined path for our sprite to move.
	//to see this baddy in action, disable collisions between player and wall in the update function.
	//x coordinates have to be hardcoded. :(
	//.yoyo() also will not work here.
	var baddyMotion = game.add.tween(baddy).to({ x: 224 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 256, frame: 54 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 288 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 320 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 352 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 384 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 416 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 384, frame: 40 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 352 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 320 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 288 }, 1, Phaser.Easing.Linear.None, true, 300)
    .to({ x: 256 }, 1, Phaser.Easing.Linear.None, true, 300)
    .loop()
    .start();

}


function update() {


	// moves chip
	move(player);

	//check for collisions
	//comment out this line to leave the game bounds and check out the baddy in the upper left of the game world!
	game.physics.arcade.collide(player, wall);

	// these all call functions that make keys disappear and add to inventory,
	// doors open up if you have the proper key, and chips disappear and join your inventory when you collect them.
	// five arguments each: 
	// 1, 2) the two elements you're checking for collision/overlap
	// 3) the function you want to execute if overlap/collision occur (1 and 2 will be passed as arguments)
	// 4) a context function. the previous function (3) will only fire if (4) returns true.
	// 5) the context for function (3)
	game.physics.arcade.overlap(player, keysGroup, keyKiller, null, this);
	game.physics.arcade.collide(player, doorsGroup, doorKiller, null, this);
	game.physics.arcade.overlap(player, chipsGroup, chipKiller, null, this);
	game.physics.arcade.collide(player, motherboard, motherboardKiller, null, this);

	youWin(player);

	//collision detection doesn't work when tweening with absolute position,
	//so since all of our movement is tile based, this serves as bootleg collision detection.
	if (player.x == baddy.x && player.y == baddy.y) {
		alert("Game over, maaaaan!")
	}

}


function render(){
	// uncomment this to see some useful(?) info for debugging.
	// game.debug.spriteInfo(player, 32, 32);
}

function keyKiller(player, key){
	if (player.x == key.x && player.y == key.y){
		if (key.frame == 41){
			inventory.red++;	
		} else if (key.frame == 34){
			inventory.blue++;
		}
		key.destroy();
	} 
}

function doorKiller(player, door){
	if (door.frame == 50 && inventory.red > 0){
		door.destroy();
		inventory.red--;
	} else if (door.frame == 43 && inventory.blue > 0){
		door.destroy();
		inventory.blue--;
	}
}

function chipKiller(player, chip){
	//if we walk on a chip...
	if (player.x == chip.x && player.y == chip.y){
		//add that chip to our inventory...
		inventory.chips++;
		//and then remove the sprite from the game. 
		chip.destroy();
	}
}

function motherboardKiller(player, mb){
	//if we collect all the chips, remove the "motherboard" that blocks the path.
	if (inventory.chips == totalChips){
		mb.destroy();
	}
}

function youWin(player){
	if (player.x == 512 && player.y == 352){
		player.frame = 66;
	}
}

function move(player) {
	// waits 100 milliseconds and then checks for arrow key movement
	if(game.time.now - timeCheck > 100){
		if (cursors.left.isDown){
			//change the player's sprite to one that corresponds with the direction of the movement
			player.frame = 97;
			//move the player 16 pixels to the left.
			//tiles are 32x32, but if we move 32 pixels, we won't be able to check for collision detection.
			player.body.x -= 16;
			//reset the movement timer.
			timeCheck = game.time.now;
		} else if (cursors.right.isDown){
			player.frame = 111;
			player.body.x += 16;
			timeCheck = game.time.now;
		} else if (cursors.up.isDown){
			player.frame = 90;
			player.body.position.y -= 16;
			timeCheck = game.time.now;
		} else if (cursors.down.isDown){
			player.frame = 104;
			player.body.position.y += 16;
			timeCheck = game.time.now;
		}
	}
}