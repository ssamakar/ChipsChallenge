var game = new Phaser.Game(480, 480, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });

function preload() {
	game.load.spritesheet('chip', '../Assets/tileset.bmp', 32,32);
	game.load.tilemap('map', '../Assets/mapWithLayers.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', '../Assets/tileset.bmp')
}

var timeCheck;
var map;
var tiles;

function create() {

	//timeCheck is used to delay user input later in the update() function.
	timeCheck = game.time.now;
	game.world.setBounds(0, 0, 600, 600);

	//this loads a physics system into the game.
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//Adding a map with two layers: lots of ground tiles we can walk on, 
	//and some wall tiles that we won't be able to walk on.
	map = game.add.tilemap('map');
	map.addTilesetImage('tileset','tiles');
	map.createLayer('Tile Layer 1');
	wall = map.createLayer('Tile Layer 2');

	//The player will collide with the tile at index 11 on Tile Layer 2.
	map.setCollision(11, true, 'Tile Layer 2');

	//adding the character sprite.
	player = game.add.sprite(64,64, 'chip');
	game.physics.arcade.enable(player);

	//Chip won't be able to leave the bounds of the game world.
	player.body.collideWorldBounds = true;

	//Animations for walking. We define em here but we don't call em till later.
	player.animations.add('up', [90]);
	player.animations.add('down', [104]);
	player.animations.add('left', [97]);
	player.animations.add('right', [111]);

	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	//trying to test collisions here...
	// if (cursors.right.isDown){
	// 	player.body.velocity.x += 8;
	// 	console.log(game.physics.arcade.collide(player, wall))
	// }
	//moves chip
	move(player);

	//check for collisions
	game.physics.arcade.collide(player, wall)

}

function move(player) {
	//waits 200 milliseconds and then checks for arrow key movement
	if(game.time.now - timeCheck > 200){
		if (cursors.left.isDown){
			player.animations.play('left');
			player.body.position.x -= 32;
			timeCheck = game.time.now;
		} else if (cursors.right.isDown){
			player.animations.play('right');
			player.body.position.x += 16;
			timeCheck = game.time.now;
		} else if (cursors.up.isDown){
			player.animations.play('up');
			player.body.position.y -= 32;
			timeCheck = game.time.now;
		} else if (cursors.down.isDown){
			player.animations.play('down');
			player.body.position.y += 32;
			timeCheck = game.time.now;}
	}
}
