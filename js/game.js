var game = new Phaser.Game(480, 480, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('chip', '../Assets/tiles/chip.png');
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

	map = game.add.tilemap('map');
	map.addTilesetImage('tileset','tiles');
	layer = map.createLayer('Tile Layer 1');
	walls = map.createLayer('Tile Layer 2');
	walls.enableBody = true;
	// walls.body.immovable = true;
	//a group of walls we can collide with.
	platforms = game.add.group();
	platforms.enableBody = true;

	//adding the character sprite and 
	player = game.add.sprite(0,0, 'chip');
	game.physics.arcade.enable(player);

	player.body.collideWorldBounds = true;

	//Animations for walking. We define em here but we don't call em till later.
	player.animations.add('left', [0,1,2,3], 10, true);
	player.animations.add('right', [5,6,7,8], 10, true);

	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	//check for collisions
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(player, walls);

	//can we wrap this in a function? lots of repetition here...
	if (cursors.left.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.x -= 32;
		timeCheck = game.time.now;
	} else if (cursors.right.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.x += 32;
		timeCheck = game.time.now;
	} else if (cursors.up.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.y -= 32;
		timeCheck = game.time.now;
	} else if (cursors.down.isDown && (game.time.now - timeCheck > 170)){
		player.body.position.y += 32;
		timeCheck = game.time.now;
	} 

}



