export default class Alien {
  constructor(x, y, [spriteA, spriteB]) {
    this.x = x;
  	this.y = y;
    this._spriteA = spriteA;
    this._spriteB = spriteB;
    this.seeCount = 0;
  }

  get w() {
    return this._spriteA.w
  }

  get h() {
    return this._spriteA.h
  }

  draw(ctx, time) {
    let sp = (Math.ceil(time / 1000) % 2 === 0) ? this._spriteA : this._spriteB;

    ctx.drawImage(
      sp.img,
      sp.x, sp.y, sp.w, sp.h,
      this.x, this.y, sp.w, sp.h
    )
  }

  checkCollision(bullet, time) {
    let sp = (Math.ceil(time / 1000) % 2 === 0) ? this._spriteA : this._spriteB;
    return (this.x < bullet.x + bullet.w) && (bullet.x < this.x + sp.w) && (this.y < bullet.y + bullet.h) && (bullet.y < this.y + sp.h);
  }
}
