import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Projects',
  icon: 'i-pixelarticons-folder',
  to: '/projects'
},
// {
//   label: 'Blog',
//   icon: 'i-pixelarticons-file-text',
//   to: '/blog'
// },
// {
//   label: 'Speaking',
//   icon: 'i-pixelarticons-mic',
//   to: '/speaking'
// },
{
  label: 'Games',
  icon: 'i-pixelarticons-gamepad',
  to: '/games'
}, {
  label: 'About',
  icon: 'i-pixelarticons-user',
  to: '/about'
}]
