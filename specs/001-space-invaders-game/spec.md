Build a game with Typescript that runs in a web browser. 

The game is fully contained on a single screen that can be resized with the browser. 

The top part of the display will show the number of lives the player has on the left, the name of the game, Space InvAIders, in the centre and the current score on the right. 

Below this area is the play field which is divided into three uneven blocks. 

The topmost block allows a single UFO sprite to enter the display from the left or right, chosen randomly, and proceed towards the opposite side of the display at a constant rate where it will leave and disappear. 

In the next block down we draw six rows of 8 sprites representing aliens. These are computer controlled non-player characters. 

The next block down is the city. In this block we draw five rectangles evenly sized and spaced. These represent buildings. 

The next block down is the lowest and is where we display the player's sprite that should resemble a cannon which points directly upwards to the top of the screen and can be moved left or right by the player. The aliens can drop bombs which will gradually destroy the buildings with each hit, or cause the player to lose a life if the cannon is hit. The player can shoot missiles upwards which can also gradually destroy the buildings, or instantly destroy the alien characters, or the UFO depending on what it hits. As soon as a bomb or missile hits something it is itself destroyed and removed from the game. Each alien is worth 100 points. The UFO is worth 200.

The aliens move slowly and regularly from left to right. Three or four of them will drop bombs at a time, at random intervals. When any alien encounters the right edge of the display window they all pause, move down one row and then start moving towards the left, until any alien encounters the left edge of the display when they all stop, move down one row and begin moving right again. This repeats until the player has destroyed all the aliens or they have "landed" by destroying the buildings and reaching the player.

If the player clears the screen of aliens and UFOs the display should be cleared and fully redrawn with a new set of aliens and buildings. 

If the player's cannon is hit by an alien's bomb, it explodes and the player's life counter is reduced by one and a new cannon sprite is spawned below the buildings so that play can continue. If the player loses all lives the game is over and the aliens win.

Each time the screen is initiated with a new collection of aliens and buildings, this is a "level". 

If the player clears 20 levels, they beat the game and the aliens are vanquished.

Throughout the game a UFO should be spawned at random times but at intervals not less than 30 seconds and not more than 90 seconds.

If the player succeeds in destroying all the aliens, spawn a bonus UFO in the appropriate block with a points value of double the usual value.

