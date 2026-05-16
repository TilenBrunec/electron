const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

test.describe('Socialno omrežje testi', () => {
  let electronApp
  let mainWnd

  test.beforeEach(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    mainWnd = await electronApp.firstWindow()
    await mainWnd.waitForLoadState('domcontentloaded')
  
    await mainWnd.waitForSelector('#btn-load', { timeout: 15000 })
    await mainWnd.waitForSelector('#filter-input', { timeout: 15000 })
  })

  test.afterEach(async () => {
    await electronApp.close()
  })

  test('Filtriranje po avtorju najde rezultate', async () => {
    await mainWnd.locator('#filter-attr').selectOption('avtor')
    await mainWnd.locator('#filter-input').fill('Tomo')
    await mainWnd.waitForTimeout(500)
    const count = await mainWnd.locator('.objava').count()
    expect(count).toBeGreaterThan(0)
  })

  test('Filtriranje brez rezultatov vrne prazno', async () => {
    await mainWnd.locator('#filter-input').fill('xyzxyzxyz123')
    await mainWnd.waitForTimeout(500)
    const count = await mainWnd.locator('.objava').count()
    expect(count).toBe(0)
  })

  test('Filtriranje po kategoriji najde rezultate', async () => {
    await mainWnd.locator('#filter-attr').selectOption('kategorija')
    await mainWnd.locator('#filter-input').fill('Tehnologija')
    await mainWnd.waitForTimeout(500)
    const count = await mainWnd.locator('.objava').count()
    expect(count).toBeGreaterThan(0)
  })

  test('Sortiranje po avtorju prikaže objave', async () => {
    await mainWnd.locator('#sort-attr').selectOption('avtor')
    await mainWnd.waitForTimeout(500)
    const count = await mainWnd.locator('.objava').count()
    expect(count).toBeGreaterThan(0)
  })

  test('Sortiranje po likes prikaže objave', async () => {
    await mainWnd.locator('#sort-attr').selectOption('likes')
    await mainWnd.waitForTimeout(500)
    const count = await mainWnd.locator('.objava').count()
    expect(count).toBeGreaterThan(0)
  })

  test('Nastavitveno okno se odpre ob kliku', async () => {
    const windowPromise = electronApp.waitForEvent('window')
    await mainWnd.locator('#btn-settings').click()
    const settingsWnd = await windowPromise
    await settingsWnd.waitForLoadState('domcontentloaded')
    await expect(settingsWnd.locator('h2')).toBeVisible({ timeout: 10000 })
  })

  test('Gumb nalozi podatke je viden', async () => {
    await expect(mainWnd.locator('#btn-load')).toBeVisible({ timeout: 10000 })
  })
})