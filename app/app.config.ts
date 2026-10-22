export default defineAppConfig({
  global: {
    picture: {
      dark: "/me.png",
      light: "/me.png",
      alt: "Gilbert Ndresaj",
    },
    seo: {
      siteName: "Gilbert Ndresaj",
      authorName: "Gilbert Ndresaj",
      defaultTitle: "Frontend & Creative Developer",
      defaultDescription:
        "Portfolio of Gilbert Ndresaj, a Frontend and Creative Developer building expressive web experiences with Vue, Nuxt, TypeScript, and design.",
      defaultImage: "/me.png",
      locale: "en_US",
      twitterHandle: "@g1lg1l",
    },
    meetingLink: "mailto:gilbert.ndresaj@gmail.com",
    email: "gilbert.ndresaj@gmail.com",
    available: true,
  },
  ui: {
    colors: {
      primary: "violet",
      neutral: "neutral",
    },
    icons: {
      arrowLeft: "i-pixelarticons-arrow-left",
      arrowRight: "i-pixelarticons-arrow-right",
      check: "i-pixelarticons-check",
      chevronDown: "i-pixelarticons-chevron-down",
      chevronLeft: "i-pixelarticons-chevron-left",
      chevronRight: "i-pixelarticons-chevron-right",
      chevronUp: "i-pixelarticons-chevron-up",
      close: "i-pixelarticons-close",
      copy: "i-pixelarticons-copy",
      copyCheck: "i-pixelarticons-check",
      external: "i-pixelarticons-external-link",
      search: "i-pixelarticons-search",
    },
    // Pixel type on everything you can press
    button: { slots: { base: "font-pixel" } },
    badge: { slots: { base: "font-pixel" } },
    navigationMenu: { slots: { link: "font-pixel" } },
    pageHero: {
      slots: {
        container: "py-12 sm:py-16 lg:py-20",
        title: "mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl",
        description:
          "mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted",
      },
    },
  },
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()} Gilbert Ndresaj`,
    colorMode: false,
    links: [
      {
        icon: "i-pixelarticons-github",
        to: "https://github.com/g1lg1l",
        target: "_blank",
        "aria-label": "Gilbert on GitHub",
      },
      {
        icon: "i-pixel-itchio",
        to: "https://g1lg1l.itch.io/",
        target: "_blank",
        "aria-label": "Gilbert's games on itch.io",
      },
      {
        icon: "i-pixelarticons-linkedin",
        to: "https://linkedin.com/in/gilbertndr/",
        target: "_blank",
        "aria-label": "Gilbert on LinkedIn",
      },
      {
        icon: "i-pixelarticons-bluesky",
        to: "https://bsky.app/profile/g1lg1l.bsky.social",
        target: "_blank",
        "aria-label": "Gilbert on Bluesky",
      },
      {
        icon: "i-pixelarticons-music",
        to: "https://open.spotify.com/user/fmlddu645fmfbxo6z10moaydu?si=3c8a3739b95441b8",
        target: "_blank",
        "aria-label": "Gilbert on Spotify",
      },
      {
        icon: "i-pixelarticons-instagram",
        to: "https://www.instagram.com/g1l_g1l/",
        target: "_blank",
        "aria-label": "Gilbert on Instagram",
      },
    ],
  },
});
