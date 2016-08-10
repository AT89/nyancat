#NYAN-CAT the side scrolling cute shoot em up (bullet hell) game adventure

##Planning
- Initial Planning
* Create a fun shoot-em-up aka bullet-hell game thats cute, attractive and possibly multiplayer

* Utilize and educate self on phaser.io (and learning how to google search terms and ask questions in this.community)

- Bonuses (in order)

* Add use of websockets (socket.io)

* Add a DB for inputting and saving player scores

* Putting it on Ionic so its native on mobile, making use of the gyroscope for player movement
##User-stories
* When I start the game, I want to play the game

* Game should be intuitive and only need to use a few buttons (move and shoot)

* Game must be cute, colorful, hilarious, explosions and dodging and with skill

* When an enemy is eliminated by my nyan-beam, it will explode and drop 'doge tokens'

* I want my nyan-cat to have a tail that grows based on how well I am doing at the game

* If the game has multiplayer functionality, I should be able to 'block' other players with my tail. either obscuring their vision or disabling them from grabbing 'tokens'

* When a player joins on multiplayer, expand the map 'down' by the original map size

* Players will have views only to the map size (so if they go out of bounds at the bottom, they will see a different 'scene'), similar to Zelda LTTP

* Bounds can repeat, as in if a player goes all the way North, he will arrive at the last Block view (South)

* Game should be mobile friendly, on mobile I want to tap the screen to shoot and enable the gyroscope of the device for movement. AND have a default horizontal orientation.


##Captains Log
- Friday 8/5/2016
* Planning.. and deciding what to work on!
- Monday 8/8/2016
* Looked at source code from basic shoot em up.
* Created the sprites and placed Nyan-cat (player), added Bogeys (enemies) the Bomb and the mage
* Spent a 2 hours trying out different methods to append a tail to the nyan-cat...
-- Need to:
* Spawn multiple enemies
* set up HP for enemies and player
* finish reading the learnpub

- Monday, Tues -collideWorldBounds

- Wednesday
* ok the basic game is good..Need to
* create 'bosses' from killing 15 bombs
* want to add a dynamic scoreboard and have player names showing (express?) + websockets
* Expand the map, reset all the little bombs, add a camera to 800x600


##Coding
* Used prototypes to keep the code-clean


##Made with:
- Education from WDI General Assembly, instructors Nick, Jesse, Adrian
- Javascript
- Runs on node.js with http-server
- Phaser.io
- Socket.io for websockets
- Heroku for hosting
- Heroku Rails for scoreboard
- Shoot em up in the afternoon learnpub tutorial (fantastic!)
- Inspired by Jamestown and Ikaruga
- pixlr and Adobe Photoshop for editing spritesheets
- http://spritedatabase.net/ for getting the sprites
- NYAN-CAT
- Soundtrack: Yum yum by Essence (200% speed inspired by Runling Run WC3 UMS  custom map https://www.youtube.com/watch?v=hjIvbZTcSow)
