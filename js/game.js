var game = new Phaser.Game(480, 480, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('chip', '../Assets/tiles/chip.png');
	game.load.tilemap('map', '../Assets/map.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('level', '../Assets/tiles.bmp')
}

var timeCheck;
var map;
var level;

function create() {
	timeCheck = game.time.now;
	game.world.setBounds(0, 0, 600, 600);

	//Ground and Platforms

	//this loads a physics system into the game.
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//this adds the Sky background. it comes first because everything 
	//else is gonna be overlayed on top.
	//the 0,0 args place the 'sky' image in the upper left corner of the screen.
	map = game.add.tilemap('map');
	map.addTilesetImage('level');
	layer = map.createLayer('Tile Layer 1');

	//by making the platforms variable a group via game.add.group(),
	//we can make changes to every object in the group at once.
	platforms = game.add.group();
	//enableBody gives the objects in the group mass,
	//so that we can collide and interact with them.
	platforms.enableBody = true;


	player = game.add.sprite(0,0, 'chip');
	game.physics.arcade.enable(player);

	player.body.collideWorldBounds = true;

	// player.gravity = 200;

	//Animations for walking. We define em here but we don't call em till later.
	player.animations.add('left', [0,1,2,3], 10, true);
	player.animations.add('right', [5,6,7,8], 10, true);

	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();

}

function update() {

	//check for collisions
	game.physics.arcade.collide(player, platforms);
	
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
	} else {
		player.animations.stop();
		player.frame = 4;
	}

}



