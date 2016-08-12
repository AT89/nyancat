var loadState = {


  preload: function() {

    // var anh = game.add.text(game.world.width/2.5, game.world.height*3/4,
    // 'Dogemation games',
    // {font: '20px monospace', fill: 'white', align: 'center'})


    var loadingLabel = game.add.text(game.world.width/4, game.world.height*9/10,
      'loading the pew-pews...',
      {font: '30px monospace', fill: 'pink', align: 'center'});



    //sprites and images
    this.load.image('background', 'assets/props/bgspace.jpg');
    this.load.spritesheet('vortex', 'assets/props/vortex.jpg', 800, 600);
    this.load.spritesheet('player', 'assets/cat/nyancat.png', 61, 28);
    this.load.image('beam', 'assets/props/beam.png');
    this.load.image('bullet', 'assets/props/bullet.png');
    this.load.spritesheet('nyantail', 'assets/cat/tail.png', 38, 28);
    this.load.spritesheet('magusEnemy', 'assets/bogeys/mages.png', 19, 19);
    this.load.spritesheet('bombEnemy', 'assets/bogeys/bombs.png', 18, 18);
    //explosions
    this.load.spritesheet('explosion', 'assets/props/explosion.png', 94, 94);
    this.load.spritesheet('explosion2', 'assets/props/explosion2.png', 94, 94);
    this.load.spritesheet('explosion3', 'assets/props/explosion3.png', 94, 94);
    this.load.spritesheet('explosion4', 'assets/props/explosion4.png', 94, 94);
    this.load.spritesheet('explosion5', 'assets/props/explosion5.png', 94, 94);

    //reaperEnemy
    this.load.spritesheet('reaperEnemy', 'assets/reaper/reaper.png',70,77 );
    // this.load.spritesheet('reaperEnemy', 'assets/reaper/reaperSlice.png', 76, 99);

    // this.load.spritesheet('reaperSlice', 'assets/reaper/reaperSlice.png', 76, 99);

    this.load.spritesheet('fireReaper', 'assets/reaper/firereaperSlicing.png', 142, 139);
    this.load.spritesheet('reaperShot', 'assets/reaper/sliceShot.png', 17, 100);

    //sounds
    this.load.audio('sad','assets/sounds/sad.mp3');
    this.load.audio('pew','assets/sounds/pew.mp3');
    this.load.audio('reaperDeath','assets/sounds/reaperdeath.wav')
    this.load.audio('firereaperDeath','assets/sounds/reaperdeath2.wav')

  },

  create: function()  {
    game.state.start('menu')
  }
}
