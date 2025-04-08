export default class Score {
    constructor(value) {
        this.value = value;
    }

    draw(ctx) {
        ctx.fillStyle = "#fff";
        ctx.font = "25px Pixel"
        ctx.fillText(`SCORE: ${this.value}`, 60, 45);
    }
}