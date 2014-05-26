var game = new Phaser.Game(512, 512, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });


function preload() {
	game.load.spritesheet('sprites', '../Assets/tileset.bmp', 32,32);
	game.load.tilemap('map', '../Assets/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', '../Assets/tileset.bmp')
}

var timeCheck;
var map;
var tiles;
var newX;

function create() {

	//timeCheck is used to delay user input later in the update() function.
	timeCheck = game.time.now;

	//0,0 is the upper left boundary of the world.
	//1024,1024 is the size of the game world. twice as big as the actual game window to allow for camera movement.
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
	baddy = game.add.sprite(224,64, 'sprites', 40);
	redKey = game.add.sprite(256,224, 'sprites', 41);
	player = game.add.sprite(game.world.width/2, game.world.width/2 - 32, 'sprites', 104);
	// ghost = game.add.sprite(160,96, 'sprites', 105);

	//enabling physics for the elements we just added, except for the key.
	game.physics.arcade.enable([player, baddy, wall]);

	//if we collide with a baddy we don't want to be able to nudge him out of his path.
	baddy.body.immovable = true;

	//Chip won't be able to leave the bounds of the game world.
	player.body.collideWorldBounds = true;

	//This makes sure the camera is fixed to Chip's x and y coordinates.
	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();

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
	game.physics.arcade.collide(player, wall, function(){
		console.log('collision')
	});

	//collision detection doesn't work when tweening with absolute position,
	//so since all of our movement is tile based, this serves as bootleg collision detection.
	if (player.x == baddy.x && player.y == baddy.y) {
		// alert("Game over, maaaaan!")
	}
	if (player.x == redKey.x && player.y == redKey.y){
		redKey.destroy();
	} 
}

function move(player) {
	// waits 75 milliseconds and then checks for arrow key movement
	if(game.time.now - timeCheck > 75){
		if (cursors.left.isDown){
			player.frame = 97;
			player.body.x -= 16;
			timeCheck = game.time.now;
		} else if (cursors.right.isDown){
			newX = player.x + 32;
			player.frame = 111;
			// game.add.tween(player).to({ x: newX }, 2000, Phaser.Easing.Linear.None, true);
			player.body.x += 16;
			// if (player.x == newX){
			// 	player.body.velocity.x = 0;
			// }
			timeCheck = game.time.now;
		} else if (cursors.up.isDown){
			player.frame = 90;
			player.body.position.y -= 16;
			timeCheck = game.time.now;
		} else if (cursors.down.isDown){
			player.frame = 104;
			player.body.position.y += 16;
			timeCheck = game.time.now;}
	}
}