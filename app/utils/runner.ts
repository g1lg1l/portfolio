// The endless runner on the Game Boy's screen, drawn on an 80x53 canvas in the 4-tone palette.
// It plays itself (attract mode, "DEMO") until someone presses a button, and goes back to that
// after five seconds of no input.
export const RUNNER_W = 80
export const RUNNER_H = 53
const GROUND = 44

// 3x5 glyphs for the score and the few words on screen
const GLYPHS: Record<string, string> = {
  0: '111101101101111',
  1: '010110010010111',
  2: '111001111100111',
  3: '111001111001111',
  4: '101101111001001',
  5: '111100111001111',
  6: '111100111101111',
  7: '111001001001001',
  8: '111101111101111',
  9: '111101111001111',
  A: '010101111101101',
  D: '110101101101110',
  E: '111100110100111',
  M: '101111111101101',
  O: '111101101101111',
  P: '111101111100100',
  S: '111100111001111',
  U: '101101101101111'
}

export function createRunner() {
  const game = {
    x: 0,
    y: 0,
    vy: 0,
    score: 0,
    best: 0,
    crates: [60, 120],
    input: -Infinity, // when someone last pressed a button
    hit: -Infinity,
    paused: false
  }

  const text = (
    ctx: CanvasRenderingContext2D,
    str: string,
    x: number,
    y: number
  ) =>
    [...str].forEach((ch, i) =>
      [...(GLYPHS[ch] ?? '')].forEach((on, p) => {
        if (on === '1')
          ctx.fillRect(x + i * 4 + (p % 3), y + Math.floor(p / 3), 1, 1)
      })
    )

  const jump = () => {
    if (game.y === 0 && !game.paused) game.vy = -110
  }

  return {
    get hit() {
      return game.hit
    },
    /** A button was pressed: it's a player now, not the demo. */
    press(t: number) {
      game.input = t
      jump()
    },
    pause() {
      game.paused = !game.paused
    },
    step(dt: number, t: number) {
      if (game.paused) return
      const speed = 40
      const demo = t - game.input > 5
      game.x += speed * dt
      game.crates = game.crates.map((c) => c - speed * dt)
      if (game.crates[0]! < -8) {
        game.crates.shift()
        game.crates.push(game.crates.at(-1)! + 50 + Math.random() * 50)
        game.score++
        if (!demo) game.best = Math.max(game.best, game.score)
      }
      // Attract mode jumps right on time
      const next = game.crates.find((c) => c > 14)
      if (demo && next !== undefined && next - 22 < 4) jump()

      game.vy += 260 * dt
      game.y = Math.min(0, game.y + game.vy * dt)
      if (game.y === 0) game.vy = 0

      // Feet inside a crate: back to zero, and the screen fizzes
      const front = game.crates.find((c) => c < 21 && c > 9)
      if (front !== undefined && game.y > -6 && t - game.hit > 1) {
        game.hit = t
        game.score = 0
      }
    },
    draw(ctx: CanvasRenderingContext2D, t: number) {
      const [ink, dim, mid, light] = PALETTE
      ctx.fillStyle = ink!
      ctx.fillRect(0, 0, RUNNER_W, RUNNER_H)

      // Hills in the distance, scrolling slower than the ground
      ctx.fillStyle = dim!
      for (let i = 0; i < RUNNER_W; i++) {
        const h =
          6 +
          Math.sin((i + game.x * 0.3) / 9) * 3 +
          Math.sin((i + game.x * 0.3) / 4) * 1.5
        ctx.fillRect(i, GROUND - Math.round(h), 1, Math.round(h))
      }
      ctx.fillStyle = mid!
      ctx.fillRect(0, GROUND, RUNNER_W, 1)
      for (let i = 0; i < RUNNER_W; i += 6)
        ctx.fillRect(i - (Math.floor(game.x) % 6), GROUND + 3, 2, 1)

      for (const c of game.crates) {
        const x = Math.round(c)
        ctx.fillStyle = mid!
        ctx.fillRect(x, GROUND - 6, 6, 6)
        ctx.fillStyle = ink!
        ctx.fillRect(x + 1, GROUND - 5, 4, 4)
        ctx.fillStyle = mid!
        ctx.fillRect(x + 2, GROUND - 4, 2, 2)
      }

      const frame =
        game.y < 0
          ? SPRITE.jump
          : Math.floor(game.x / 6) % 2
            ? SPRITE.runA
            : SPRITE.runB
      frame.forEach((row, j) =>
        [...row].forEach((c, i) => {
          if (c === '.') return
          ctx.fillStyle = PALETTE[+c]!
          ctx.fillRect(14 + i, GROUND - 8 + Math.round(game.y) + j, 1, 1)
        })
      )

      ctx.fillStyle = light!
      text(ctx, String(game.score).padStart(3, '0'), RUNNER_W - 15, 4)
      const blinkOn = Math.floor(t * 1.5) % 2
      if (game.paused) {
        if (blinkOn) text(ctx, 'PAUSE', 30, 22)
      } else if (t - game.input > 5 && blinkOn) text(ctx, 'DEMO', 4, 4)
      else if (game.best) {
        ctx.fillStyle = mid!
        text(ctx, String(game.best).padStart(3, '0'), 4, 4)
      }
    }
  }
}
