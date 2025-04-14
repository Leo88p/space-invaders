import {
  preload,
  init,
  update,
  draw,
  finish
} from './game'

const canvas = document.getElementById("cnvs");
canvas.width = 600;
canvas.height = window.innerHeight;

const tickLength = 15; //ms
let lastTick;
let lastRender;
let stopCycle;
let ended = false;

document.addEventListener("keydown", ()=>{
  if (ended) {
    ended = false;
    onPreloadComplete();
  }
})

function run(tFrame) {
    stopCycle = window.requestAnimationFrame(run);

    const nextTick = lastTick + tickLength;
    let numTicks = 0;

    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - lastTick;
        numTicks = Math.floor(timeSinceTick / tickLength);
    }

    for (let i = 0; i < numTicks; i++) {
        lastTick = lastTick + tickLength;
        update(canvas, lastTick, stopGame);
    }

    draw(canvas, tFrame);
    lastRender = tFrame;
}

async function stopGame() {
    await window.cancelAnimationFrame(stopCycle);
    finish(canvas);
    ended = true;
}

function onPreloadComplete() {
  lastTick = performance.now();
  lastRender = lastTick;
  stopCycle = null;
  init(canvas);
  run();
}

preload(onPreloadComplete);
