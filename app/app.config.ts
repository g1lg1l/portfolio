export default defineAppConfig({
  global: {
    picture: {
      dark: '/me.png',
      light: '/me.png',
      alt: 'Gilbert Ndresaj'
    },
    meetingLink: 'mailto:gilbert.ndresaj@gmail.com',
    email: 'gilbert.ndresaj@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'purple',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-12 sm:py-16 lg:py-20',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()} Gilbert Ndresaj`,
    colorMode: false,
    links: [{
      'icon': 'simple-icons:github',
      'to': 'https://github.com/g1lg1l',
      'target': '_blank',
      'aria-label': 'Gilbert on GitHub'
    }, {
      'icon': 'simple-icons:linkedin',
      'to': 'https://linkedin.com/in/gilbertndr/',
      'target': '_blank',
      'aria-label': 'Gilbert on LinkedIn'
    }, {
      'icon': 'simple-icons:bluesky',
      'to': 'https://bsky.app/profile/g1lg1l.bsky.social',
      'target': '_blank',
      'aria-label': 'Gilbert on Bluesky'
    }, {
      'icon': 'simple-icons:spotify',
      'to': 'https://open.spotify.com/user/fmlddu645fmfbxo6z10moaydu?si=3c8a3739b95441b8',
      'target': '_blank',
      'aria-label': 'Gilbert on Spotify'
    }, {
      'icon': 'simple-icons:instagram',
      'to': 'https://www.instagram.com/g1l_g1l/',
      'target': '_blank',
      'aria-label': 'Gilbert on Instagram'
    }]
  }
})
