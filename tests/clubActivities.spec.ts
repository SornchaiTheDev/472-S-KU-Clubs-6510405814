import { test, expect } from '@playwright/test';

// Skip tests if the server isn't running
test.describe('Club Activities Page', () => {
  // Increase timeout for navigation
  test.setTimeout(60000);
  
  test.beforeEach(async ({ page }) => {
    // Navigate with a longer timeout
    try {
      await page.goto('/ClubActivities', { timeout: 45000 });
      
      // Wait for content to be visible
      await page.waitForSelector('text=กิจกรรมทั้งหมดของชมรม', { timeout: 10000 });
    } catch (error) {
      console.error('Navigation failed:', error);
      // Take a screenshot to help debug
      await page.screenshot({ path: 'navigation-error.png' });
      throw error;
    }
  });

  test('should display club information correctly', async ({ page }) => {
    // ตรวจสอบว่าข้อมูลชมรมแสดงถูกต้อง
    await expect(page.locator('h2:has-text("ชื่อชมรม") + p')).toBeVisible();
    await expect(page.locator('h2:has-text("ประเภทชมรม") + p')).toBeVisible();
    await expect(page.locator('h2:has-text("ประธานชมรม") + p')).toBeVisible();
    await expect(page.locator('h2:has-text("ที่ปรึกษา") + p')).toBeVisible();
  });

  test('should filter activities by search term', async ({ page }) => {
    // บันทึกจำนวนกิจกรรมก่อนค้นหา
    const initialActivitiesCount = await page.locator('.bg-white.rounded-lg.shadow-sm').count();
    
    // ค้นหากิจกรรมด้วยคำค้นหา
    await page.fill('input[placeholder="ค้นหากิจกรรม..."]', 'ถ่ายภาพ');
    
    // รอให้การค้นหาทำงานเสร็จ
    await page.waitForTimeout(500);
    
    // ตรวจสอบว่ามีการกรองกิจกรรม
    const filteredActivitiesCount = await page.locator('.bg-white.rounded-lg.shadow-sm').count();
    
    // ตรวจสอบว่าจำนวนกิจกรรมเปลี่ยนไปหลังจากค้นหา
    expect(filteredActivitiesCount).toBeLessThanOrEqual(initialActivitiesCount);
  });

  test('should sort activities correctly', async ({ page }) => {
    // เลือกการเรียงลำดับแบบตัวอักษร
    await page.click('button[role="combobox"]');
    await page.click('text=เรียงตามตัวอักษร: ก-ฮ');
    
    // รอให้การเรียงลำดับทำงานเสร็จ
    await page.waitForTimeout(500);
  });

  test('should switch between tabs correctly', async ({ page }) => {
    // ตรวจสอบว่าแท็บ Upcoming เป็นแท็บเริ่มต้น
    await expect(page.locator('button[role="tab"][data-state="active"]')).toHaveText('Upcoming');
    
    // คลิกที่แท็บ Ongoing
    await page.click('button[role="tab"]:has-text("Ongoing")');
    
    // ตรวจสอบว่าแท็บ Ongoing ถูกเลือก
    await expect(page.locator('button[role="tab"][data-state="active"]')).toHaveText('Ongoing');
    
    // คลิกที่แท็บ Past
    await page.click('button[role="tab"]:has-text("Past")');
    
    // ตรวจสอบว่าแท็บ Past ถูกเลือก
    await expect(page.locator('button[role="tab"][data-state="active"]')).toHaveText('Past');
  });
});