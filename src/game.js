import Sprite from './sprite'
import Cannon from './cannon'
import Bullet from './bullet'
import Alien from './alien'
import InputHandler from './input-handler'
import Score from './score'
import Life from './life'

import assetPath from '../assets/invaders.png'
import fontPath from 'url:../assets/PixelifySans-Regular.ttf'

let assets;
let seconds = 0;
const sprites = {
  aliens: [],
  cannon: null,
  bunker: null
};
const gameState = {
  bullets: [],
  aliens: [],
  cannon: null,
  score: null,
  life: null
};
const inputHandler = new InputHandler();

export function preload(onPreloadComplete) {
  assets = new Image();
	assets.addEventListener("load", () => {
    sprites.cannon = new Sprite(assets, 62, 0, 22, 16);
    sprites.bunker = new Sprite(assets, 84, 8, 36, 24);
    sprites.aliens = [
      [new Sprite(assets,  0, 0, 22, 16), new Sprite(assets,  0, 16, 22, 16)],
			[new Sprite(assets, 22, 0, 16, 16), new Sprite(assets, 22, 16, 16, 16)],
			[new Sprite(assets, 38, 0, 24, 16), new Sprite(assets, 38, 16, 24, 16)]
    ]
    const font = new FontFace("Pixel", `url(${fontPath})`);
    document.fonts.add(font)
    font.load().then(()=>onPreloadComplete());
  });
	assets.src = assetPath;
}

export function init(canvas) {
  const lines = [9, 9]
  const offsets = [60, 90]
	for (var i = 0, len = 5; i < len; i++) {
		for (var j = 0; j < lines[i%2]; j++) {
      const alienType = Math.floor(Math.random() * 3);

      let alienX = offsets[i%2] + j*60;
      let alienY = 90 + i*30;

      if (alienType === 1) {
        alienX += 3; // (kostyl) aliens of this type is a bit thinner
      }

			gameState.aliens.push(
        new Alien(alienX, alienY, sprites.aliens[alienType])
			);
		}
	}

  gameState.cannon = new Cannon(
    canvas.width/2, canvas.height - 100,
    sprites.cannon
  );

  gameState.score = new Score(0);
  gameState.life = new Life(3, sprites.cannon)
}

export function update(canvas, time, stopGame) {
	if (inputHandler.isDown('ArrowLeft')) {
		gameState.cannon.x -= 4;
    if (gameState.cannon.x < 0) {
      gameState.cannon.x = 0;
    }
	}

	if (inputHandler.isDown('ArrowRight')) {
		gameState.cannon.x += 4;
    if (gameState.cannon.x > canvas.width - 22) {
      gameState.cannon.x = canvas.width - 22;
    }
	}

  if (inputHandler.isPressed('Space')) {
    const bulletX = gameState.cannon.x + 10;
    const bulletY = gameState.cannon.y;
		gameState.bullets.push(new Bullet(bulletX, bulletY, -8, 2, 6, "#fff"));
	}

  gameState.bullets.forEach(b => b.update(time));
  gameState.bullets = gameState.bullets.filter(b=>b.y>60 && b.y <canvas.height-80);
  gameState.bullets.forEach(b=>
    {if (b.color=="#fff") gameState.aliens=gameState.aliens.filter(a=>{if (a.checkCollision(b, time)) 
      gameState.score.value++; 
      return !a.checkCollision(b, time)});
    });
  if (Math.ceil(time/1000) > seconds) {
    seconds++;
    gameState.aliens.forEach(a=>{
      a.x+=Math.floor(Math.random()*6)-3; 
      a.y+=2;
      if (Math.abs(a.x - gameState.cannon.x) < 100) {
        a.seeCount++;
      }
    })
    gameState.aliens.forEach(a=>{
      if (a.seeCount==2) {
        a.seeCount--;
        gameState.bullets.push(new Bullet(a.x + a._spriteA.w/2, a.y, 8, 2, 6, "#0f0"));
      }
    })
    gameState.bullets.forEach(b=>{
      if (b.color=="#0f0" && gameState.cannon.checkCollision(b)) {
        gameState.life.value--;
      }
    })
  }
}

export function draw(canvas, time) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gameState.aliens.forEach(a => a.draw(ctx, time));
  gameState.cannon.draw(ctx);
  gameState.bullets.forEach(b => b.draw(ctx));
  gameState.score.draw(ctx);
  gameState.life.draw(ctx, canvas);
}
