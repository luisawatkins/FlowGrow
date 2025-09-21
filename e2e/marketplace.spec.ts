import { test, expect } from '@playwright/test'

test.describe('Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display marketplace title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Property Marketplace' })).toBeVisible()
    await expect(page.getByText('Browse and purchase property NFTs')).toBeVisible()
  })

  test('should show loading state initially', async ({ page }) => {
    await expect(page.getByText('Loading properties...')).toBeVisible()
  })

  test('should display properties after loading', async ({ page }) => {
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 })
    
    // Check that properties are displayed
    await expect(page.getByText('Downtown Luxury Condo')).toBeVisible()
    await expect(page.getByText('Suburban Family Home')).toBeVisible()
    await expect(page.getByText('Beachfront Villa')).toBeVisible()
  })

  test('should show property details correctly', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Check property information
    await expect(page.getByText('150.50 FLOW')).toBeVisible()
    await expect(page.getByText('1,200')).toBeVisible()
    await expect(page.getByText('123 Main St, Downtown, NY 10001')).toBeVisible()
  })

  test('should open property modal when view details is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Click view details button
    await page.getByRole('button', { name: 'View Details' }).first().click()
    
    // Check that modal opens
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Downtown Luxury Condo')).toBeVisible()
  })

  test('should close property modal when close button is clicked', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Open modal
    await page.getByRole('button', { name: 'View Details' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: '✕' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should show search functionality', async ({ page }) => {
    await page.waitForSelector('[data-testid="filter-bar"]')
    
    // Check search input is present
    const searchInput = page.getByPlaceholder('Search by name, location, or description...')
    await expect(searchInput).toBeVisible()
    
    // Test search functionality
    await searchInput.fill('Downtown')
    await expect(page.getByText('Downtown Luxury Condo')).toBeVisible()
    await expect(page.getByText('Suburban Family Home')).not.toBeVisible()
  })

  test('should show filter options', async ({ page }) => {
    await page.waitForSelector('[data-testid="filter-bar"]')
    
    // Check that filter button is present
    const filterButton = page.getByRole('button', { name: /Show Filters/i })
    await expect(filterButton).toBeVisible()
    
    // Click to show filters
    await filterButton.click()
    
    // Check that filter options are visible
    await expect(page.getByText('Price Range (FLOW)')).toBeVisible()
    await expect(page.getByText('Square Footage Range')).toBeVisible()
    await expect(page.getByText('Property Type')).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Check that properties are still visible on mobile
    await expect(page.getByText('Downtown Luxury Condo')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('Downtown Luxury Condo')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByText('Downtown Luxury Condo')).toBeVisible()
  })

  test('should show property images', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Check that property images are displayed
    const propertyImages = page.locator('[data-testid="property-card"] img')
    await expect(propertyImages.first()).toBeVisible()
  })

  test('should show "For Sale" badges for listed properties', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Check that "For Sale" badges are visible
    const forSaleBadges = page.getByText('For Sale')
    await expect(forSaleBadges.first()).toBeVisible()
  })

  test('should handle empty state when no properties match search', async ({ page }) => {
    await page.waitForSelector('[data-testid="filter-bar"]')
    
    // Search for non-existent property
    const searchInput = page.getByPlaceholder('Search by name, location, or description...')
    await searchInput.fill('Non-existent Property')
    
    // Check that no properties message is shown
    await expect(page.getByText('No properties match your search criteria')).toBeVisible()
  })

  test('should show sort options', async ({ page }) => {
    await page.waitForSelector('[data-testid="filter-bar"]')
    
    // Check that sort dropdown is present
    const sortSelect = page.locator('select').first()
    await expect(sortSelect).toBeVisible()
    
    // Check sort options
    await expect(sortSelect.locator('option[value="date"]')).toBeVisible()
    await expect(sortSelect.locator('option[value="price"]')).toBeVisible()
    await expect(sortSelect.locator('option[value="name"]')).toBeVisible()
  })

  test('should handle property card interactions', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Hover over property card
    const propertyCard = page.locator('[data-testid="property-card"]').first()
    await propertyCard.hover()
    
    // Check that hover effects are applied
    await expect(propertyCard).toHaveClass(/hover:shadow-lg/)
  })

  test('should show property prices in correct format', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Check that prices are formatted correctly
    await expect(page.getByText('150.50 FLOW')).toBeVisible()
    await expect(page.getByText('300.75 FLOW')).toBeVisible()
    await expect(page.getByText('500.00 FLOW')).toBeVisible()
  })

  test('should show USD conversion', async ({ page }) => {
    await page.waitForSelector('[data-testid="property-card"]')
    
    // Check that USD conversion is shown
    await expect(page.getByText('≈ $75.25 USD')).toBeVisible()
    await expect(page.getByText('≈ $150.38 USD')).toBeVisible()
    await expect(page.getByText('≈ $250.00 USD')).toBeVisible()
  })
})
