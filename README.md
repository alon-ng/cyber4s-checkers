# cyber4s-checkers

** in this document I'll refer to normal playing pieces as Men, and Kings **

In this project I'm trying to create the checkers game with the following rules:
1. Placement: each player will start with 3 rows of men on the black squares (12 in total).
2. Man's Movement: Men can move only one square diagonally forward, they can jump over the opponent's pieces and capture them, In addition, they can jump multiple opponent's pieces in one turn as long as they are sequenced accordingly (they can capture backwards starting from the second capture). If one's pieces has a possible jump, the player must take it (The player can choose which jump to take as long as he have multiple choices).
3. Promotion: If one's man get all over to the other side of the board (white - row 8, black - row 0), this man will be promoted to a king.
4. King's Movement: A king can move anywhere diagonally as long as there's no piece in the way. A king can jump over a opponent's piece and capture it and it will be done accordingly: The king will move to the square from the other side of the opponent's piece and the piece will be removed.
5. Winning: a game is done when one of the players has no more pieces or the pieces he has have no more valid moves.

Special Features:
 - When a piece has more than one available move, the player can select the piece again and one move at the time will be shown (keep clicking to shuffle through the moves).
 - When multiple jumping, a yellow square will be drawn in each stopover.
 - An AI can be played against (Work in progress).

Explaining video: https://youtu.be/G6DxmCY8qMg
