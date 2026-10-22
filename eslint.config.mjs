// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt({
  // Vendored Vue Bits components, kept close to upstream
  ignores: ['app/components/vuebits/**']
}, {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
}, eslintConfigPrettier)
