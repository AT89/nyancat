var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

PhaserGame = {
////////////////////PRELOAD////////////////////////
  preload: function() {
    this.load.image('background', 'assets/props/bgnight.png');
    this.load.spritesheet('player', 'assets/cat/nyancat.png', 61, 28);
    this.load.image('beam', 'assets/props/beam.png');
    this.load.image('bullet', 'assets/props/bullet.png');
    this.load.spritesheet('nyantail', 'assets/cat/tail.png', 38, 28);
    this.load.spritesheet('magusEnemy', 'assets/bogeys/mages.png', 19, 18);
    this.load.spritesheet('bombEnemy', 'assets/bogeys/bombs.png', 18, 18);
    this.load.spritesheet('explosion', 'assets/props/explosion.png', 95, 94)
  },

  ////////////////////CREATE////////////////////////
  create: function()  {
  //create the background
  this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
  this.background.autoScroll(-80, 0);

  //create nyan-cat
  this.player = this.add.sprite(64, 220, 'player');
  this.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.anchor.setTo(0.5, 0.5);
  this.player.animations.add('wiggle', [0, 1, 2, 3, 4], 10, true);
  this.player.animations.play('wiggle')

  //nyan-cat pew pew
  this.beam = this.add.sprite(80, 220, 'beam');
  this.physics.enable(this.beam, Phaser.Physics.ARCADE);
  this.beam.anchor.setTo(0.5,0.5)
  this.beam.body.velocity.x = 500;

  //create enemies
  this.enemy = this.add.sprite(500,220, 'magusEnemy');
  this.enemy.anchor.setTo(0.5, 0.5);
  this.physics.enable(this.enemy, Phaser.Physics.ARCADE);
  this.enemy.animations.add('mageMovement', [0, 1, 9], 5, true);
  this.enemy.animations.play('mageMovement')

  //enemy bullet
  this.bullet = this.add.sprite(480, 220,'bullet')
  this.bullet.anchor.setTo(0.5,0.5)
  this.physics.enable(this.bullet, Phaser.Physics.ARCADE);
  this.bullet.body.velocity.x = -500;


  },



  ////////////////////UPDATE////////////////////////
  update: function() {

  //U.PHYSICS!
  this.physics.arcade.overlap(
    this.bullet, this.player, this.playerHit, null, this
  );
  this.physics.arcade.overlap(
    this.beam, this.enemy, this.enemyHit, null, this
  );

  //U.ANIMATIONS!


  // this.bomb.animations.play('bombMovement')
  },
//check hitbox!
  render: function() {
    // this.game.debug.body(this.bullet);
    // this.game.debug.body(this.enemy);
    // this.game.debug.body(this.player);
  },
  //collisions!
    playerHit: function (bullet, player) {
      bullet.kill();
      player.kill();
      var explosion = this.add.sprite(player.x, player.y, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
      explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11], false);
      explosion.play('boom', 15, false, true);
    },
    enemyHit: function (beam, enemy) {
      beam.kill();
      enemy.kill();
      var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
      explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11], false);
      explosion.play('boom', 15, false, true);

    },

};
//end
game.state.add('Game', PhaserGame, true);
