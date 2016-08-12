var menuState = {

  create: function()  {
    // this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    // this.background.autoScroll(-80, 0);
    this.vortex = this.add.sprite(0, 0, 'vortex')
    this.vortex.animations.add('flying', [0, 2, 4, 6, 8], 5, true);
    this.vortex.play('flying', 10, true, true);



    var startLabel = game.add.text(game.world.width/4, game.world.height*9/10,
    'Press spacebar to pew-pew', {font: '30px monospace', fill:'#fff'})

    var startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    startKey.onDown.addOnce(this.start, this)
  },
  start: function() {
    game.state.start('nyanCat')
  }
}
