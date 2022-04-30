class Piece {
  constructor(color, pos, rank = 'man') {
    this.color = color;
    this.pos = pos;
    this.rank = rank;
  }

  draw() {
    let imgPath = `./img/${this.color}-${this.rank}.png`;
    let pieceImgElement = posToSqaure(this.pos).getElementsByTagName('img')[0];
    pieceImgElement.src = imgPath;
    pieceImgElement.alt = '';
  }
}
