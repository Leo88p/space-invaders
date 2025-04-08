export default class Life {
    constructor(value, sprite) {
        this.value = value
        this._sprite = sprite
    }
    draw(ctx, canvas) {
        ctx.drawImage(
            this._sprite.img,
            this._sprite.x, this._sprite.y, this._sprite.w, this._sprite.h,
            60, canvas.height-60, this._sprite.w*1.5, this._sprite.h*1.5
          );
        ctx.fillStyle = "#0f0";
        ctx.font = "25px Pixel"
        ctx.fillText(`${this.value}`, 80 + this._sprite.w*1.5, canvas.height-40);
    }
}