var menuState = {

  create: function()  {
    // this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    // this.background.autoScroll(-80, 0);



    this.vortex = this.add.sprite(0, 0, 'vortex');
    this.vortex.animations.add('flying', [9,6, 4, 2, 0]);
    this.vortex.play('flying', 12, true, true);

    this.score = 0;

    //SCOREBOARD HERE TOP 5

    // var displayhi5 = game.add.text(game.world.width/4, game.world.height*1/10, hi5, {font: '20px monospace', fill:'#fff'})
    scoreCall();
    function  scoreCall (data, response){
      $.ajax({
        url: "http://localhost:3000/high_scores",
        type: 'GET',
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: success,
        error: error
      })
    }


    function success (data, response){
      game.hiFive = data; console.log(response);
      console.log(data + " - " + response);



      var score_1 = game.add.text(game.world.width /2,
        game.world.height * 2/10,
        ''+ game.hiFive[0].name+' '+ game.hiFive[0].player_score+'',
        {font: '47px monospace', fill:'#fff'});
        score_1.anchor.setTo(.5, 0);

      var score_2 = game.add.text(game.world.width /2,
        game.world.height * 3/10,
        ''+ game.hiFive[1].name+' '+ game.hiFive[1].player_score+'',
        {font: '40px monospace', fill:'#fff'});
        score_2.anchor.setTo(.5, 0);

      var score_3 = game.add.text(game.world.width /2,
        game.world.height * 4/10,
        ''+ game.hiFive[2].name+' '+ game.hiFive[2].player_score+'',
        {font: '36px monospace', fill:'#fff'});
        score_3.anchor.setTo(.5, 0);

      var score_4 = game.add.text(game.world.width /2,
        game.world.height * 5/10,
        ''+ game.hiFive[3].name+' '+ game.hiFive[3].player_score+'',
        {font: '34px monospace', fill:'#fff'});
        score_4.anchor.setTo(.5, 0);

      var score_5 = game.add.text(game.world.width /2,
        game.world.height * 6/10,
        ''+ game.hiFive[4].name+' '+ game.hiFive[4].player_score+'',
        {font: '32px monospace', fill:'#fff'});
        score_5.anchor.setTo(.5, 0);
    }

      function error (data, response){
        // console.log(response);
      }

    var topscores = game.add.text(game.world.width *1/2,
      game.world.height* 1/11,
       "=^.^= TOP SCORES =^.^=",
      {font: '50px monospace', fill:'#fff'} );
      topscores.anchor.setTo(0.5,0)




    var startLabel = game.add.text(game.world.width/4, game.world.height* 9/10,
    'Press spacebar to pew-pew',
    {font: '30px monospace', fill:'#fff'});

    var startKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    startKey.onDown.addOnce(this.start, this)
  },
  start: function() {
    game.state.start('nyanCat')
  }
}
