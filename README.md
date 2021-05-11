# tic-tac-toe
A JavaScript Tic Tac Toe game with 3 difficulty levels and a 2 player option. The 3 difficulty levels are:

* Easy - The opponent places the piece randomly
* Medium - The opponent places the piece in a square which would result in a winning move. If this is not possible, the piece is placed randomly.
* Difficult - The opponent places the piece in a square which would result in a winning move. If this is not possible, they block any winning line that the player is about to make. Otherwise the piece is placed randomly.

## Issues I Encountered
The winning line animation was the most difficult part of this project. The first issue was that I had to store the winning lines so these could be animated later, and also handle the scenario where there was more than 1 winning line. As this was an idea I had after I had finished coding the game, I hadn't accounted for this when planning my code. I ended up having to amend some of the checkWin() code to not return after it had found a winning line (in case there was more than 1) and to also store the winning lines in an array. 
The checkWin() function is also used to check for any player winning moves that need to be blocked by the opponent (in Difficult mode), so in those scenarios these winning lines need to be cleared afterwards. This is not ideal, but the only alternative would be to check the entire board again, which would be inefficient. 
It was also very challenging to create a line animation in CSS. For this I used CSS variables, calc() function and the [class*=] selector to avoid repeating too much CSS.

## Future Improvements
* Improve the computer opponent in Medium and Difficult mode to make it more challenging. 








