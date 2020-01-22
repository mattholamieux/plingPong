// plingPong

let spr;
let blocks;
let balls;
let scl = 20;
let synths = [];
let walls;
let notes = ["C2", "D2", "E2", "G2", "A3", "B3", "C3", "D3", "E3", "G3"];
let reverb;
let opacity;
let open = true;

function setup() {
  createCanvas(1000, 600);
  spr = createSprite(width / 2 - scl / 2, height / 2 - scl / 2, scl, scl);
  spr.shapeColor = color(255);
  balls = new Group();
  blocks = new Group();
  walls = new Group();
  opacity = 90;

  // blocks
  for (i = 0; i < 10; i++) {
    let bl1 = createSprite(([i] * 90 + 90), height / 1.3, scl * 4.4, scl);
    let bl2 = createSprite(([i] * 90 + 90), height / 4.5, scl * 4.4, scl);
    bl1.shapeColor = color(255, 90);
    bl2.shapeColor = color(255, 90);
    blocks.add(bl1);
    blocks.add(bl2);
  }

  // walls
  for (i = 0; i < 11; i++) {
    let w = createSprite(([i] * 90 + 45), 0, 2, height * 2);
    w.shapeColor = color(0, 0, 0, 0);
    walls.add(w);
  }

  // synths
  compressor = new Tone.Compressor({
    ratio: 12,
    threshold: -24,
    release: 0.25,
    attack: 0.003,
    knee: 30
  });
  compressor.connect(Tone.Master);
  reverb = new Tone.Freeverb().connect(compressor);
  delay = new Tone.PingPongDelay().connect(compressor);
  delay.wet.value = 0;
  delay.delayTime.value = 0.25;
  delay.feedback.value = 0;
  reverb.wet.value = 0.4;
  reverb.roomSize.value = 0.4;
  reverb.dampening.value = 300;
  for (i = 0; i < 10; i++) {
    synths[i] = new Tone.Synth().chain(delay, reverb);
    synths[i].oscillator.type = 'sine';
  }

}

function draw() {
  background(50);
  balls.collide(blocks, collision);
  if (open) {
    openScreen();
  } else {
      drawSprites();
    sproutBalls();
    removeBalls();
    spr.displace(blocks);
    balls.collide(blocks, collision);
    blocks.collide(walls);
    constraints();
    nav();
    touchStarted();
    fade();
    if (keyWentDown(32)) {
      open = true;
    }
  }

  function constraints() {
    // constraints
    for (i = 0; i < blocks.length; i++) {
      blocks[i].position.y = constrain(blocks[i].position.y, scl, height - scl);
    }
    for (i = 0; i < balls.length; i++) {
      if (balls[i].position.x > width - 50 || balls[i].position.x < 50) {
        balls[i].velocity.x *= -1;
      }
    }

  }


  function sproutBalls() {
    if (keyWentDown('z')) {
      let b = createSprite(spr.position.x, spr.position.y, scl, scl);
      b.velocity.y = scl / 4;
      balls.add(b);
    } else if (keyWentDown('x')) {
      let b = createSprite(spr.position.x, spr.position.y, scl, scl);
      b.velocity.y = scl / 8;
      balls.add(b);
    } else if (keyWentDown('c')) {
      let b = createSprite(spr.position.x, spr.position.y, scl, scl);
      b.velocity.y = scl / 16;
      balls.add(b);
    } else if (keyWentDown('v')) {
      let b = createSprite(spr.position.x, spr.position.y, scl, scl);
      b.velocity.y = scl / 32;
      balls.add(b);
    }
  }

  function removeBalls() {
    if (keyIsDown(SHIFT)) {
      for (i = 0; i < balls.length; i++) {
        if (spr.overlap(balls[i])) {
          balls[i].remove();
        }
      }
    }
  }

  function collision(a, b) {
    opacity = 255;
    let dur = 1 / 8;
    let v = random(0.2, 1);
    let n = b.position.x / 90 - 1;
    synths[n].triggerAttackRelease(notes[n], '16n');
    a.velocity.y *= -1;
  }

  function fade() {
    for (i = 0; i < blocks.length; i++) {
      blocks[i].shapeColor = color(255, 180);
      if (blocks[i].overlap(balls)) {
        blocks[i].shapeColor = color(255, 255);
      }
    }
  }

  function nav() {
    if (keyIsDown(LEFT_ARROW)) {
      spr.position.x -= scl / 4;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      spr.position.x += scl / 4;
    }
    if (keyIsDown(UP_ARROW)) {
      spr.position.y -= scl / 4;
    }
    if (keyIsDown(DOWN_ARROW)) {
      spr.position.y += scl / 4;
    }

    spr.position.x = constrain(spr.position.x, scl, width - scl);
    spr.position.y = constrain(spr.position.y, scl, height - scl);
  }

  function touchStarted() {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  }

  function openScreen() {
    let f = 100;
    let directions = ['plingPong', 'arrows navigate', 'z,x,c,v deploy notes', 'shift deletes notes', 'spacebar toggles instructions', 'nudge paddles to change vertical position','click anywhere to begin'];
    textSize(18);
    textLeading(scl);
    textFont('serif');
    for (i = 0; i < directions.length; i++) {
      fill(f);
      text(directions[i], scl*3, scl * [i] + scl*15);
      f += 15;
    }
    if (mouseIsPressed || keyWentDown(32)) {
      open = false;
    }
  }
}
