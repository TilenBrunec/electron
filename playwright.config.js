const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  projects: [
    {
      name: 'electron',
      use: {}
    }
  ],
  reporter: [['html', { outputFolder: 'playwright-report' }]]
})