// The runner on the Game Boy's screen: an 8x8 body with two dark eyes.
// Digits index the 4-tone violet palette, '.' is transparent.
export const PALETTE = ['#1e1035', '#4c2889', '#8b5cf6', '#ede9fe']

const head = [
  '..3333..',
  '.333333.',
  '.300300.',
  '.333333.',
  '..3333..',
  '.333333.'
]

export const SPRITE = {
  runA: [...head, '..3..3..', '.3....3.'],
  runB: [...head, '..3.3...', '..3..3..'],
  jump: [...head, '.3....3.', '........']
}

export type SpriteFrame = string[]

// The site icon, 16x16: me as a sticker (hair and beard, violet glasses, a white outline), from public/sticker.png.
// k hair, w face, v glasses, o outline. public/favicon.* are drawn from it.
export const LOGO = [
  '.....oooooo.....',
  '...ookkkkkkoo...',
  '..okkkkkkkkkko..',
  '.okkkkkkkkkkkko.',
  '.okkkkkkkkkkkko.',
  '.okkkwwwwwwkkko.',
  '.okkwwwwwwwwwko.',
  'ovvvvvwwvvvvwko.',
  'okvwkvvvvwkvvko.',
  'okvwwvwwvwwvkko.',
  'okvvvvwwvvvvkko.',
  'okkwwwwkwwwwkko.',
  '.okkwwkkkwwkko..',
  '.okkkwwwwkkkko..',
  '..okkkkkkkkko...',
  '...ookkkkkoo....'
]

export const LOGO_COLORS: Record<string, string> = {
  k: '#171717',
  w: '#ffffff',
  v: '#a78bfa',
  o: '#ffffff'
}
