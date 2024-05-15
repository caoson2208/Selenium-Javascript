import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

const url = "https://divui.com/login";

describe("Verify Login", function () {
  this.timeout(30000); // Tăng thời gian chờ cho mỗi test case

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  async function loginTest(url, email, password) {
    try {
      // Go to the login page
      await driver.get(url);
      await driver.sleep(1000);
      // Find field email
      let emailField = await driver.findElement(By.id("Email"));
      emailField.clear();
      await emailField.sendKeys(email);
      // Find field password
      let passwordField = await driver.findElement(By.id("Password"));
      passwordField.clear();
      await passwordField.sendKeys(password);
      // Find checkbox RememberPassword
      let rememberPassword = await driver.findElement(By.id("RememberMe"));
      let isSelected = await rememberPassword.isSelected();
      if (!isSelected) {
        await rememberPassword.click();
      }
      // Find button login
      let btnLogin = await driver.findElement(By.css("button[type='submit']"));
      await btnLogin.click();

      await driver.sleep(2000);
    } catch (error) {
      throw new Error("Error message: " + error);
    }
  }

  it("should login successfully with valid credentials", async function () {
    const email = "testtest2208@yopmail.com";
    const password = "testtest@123";

    await loginTest(url, email, password);
  });

  it("should not login with email invalid", async function () {
    const email = "testtest2208@";
    const password = "testest123";
    await loginTest(url, email, password);

    let errorMessages = await driver.findElements(
      By.className("field-validation-error")
    );
    expect(errorMessages.length).to.be.greaterThan(
      0,
      "Error message element not found. Login failed."
    );
    if (errorMessages.length > 0) {
      let errorMessage = await errorMessages[0].getText();
      expect(errorMessage).to.include("Wrong email");
    }
  });

  it("should not login with password invalid", async function () {
    const email = "testtest2208@yopmail.com";
    const password = "testest1234";
    await loginTest(url, email, password);

    let errorMessages = await driver.findElements(
      By.className("validation-summary-errors")
    );
    expect(errorMessages.length).to.be.greaterThan(
      0,
      "Error message element not found. Login failed."
    );
    if (errorMessages.length > 0) {
      let errorMessage = await errorMessages[0].getText();
      expect(errorMessage).to.include(
        "Vui lòng kiểm tra lại thông tin đăng nhập"
      );
    }
  });

  it("should not login with data empty", async function () {
    const email = "";
    const password = "";
    await loginTest(url, email, password);

    let errorMessages = await driver.findElements(
      By.className("field-validation-error")
    );
    expect(errorMessages.length).to.be.greaterThan(
      0,
      "Error message element not found. Login failed."
    );

    if (errorMessages.length > 0) {
      let errorMessage = await errorMessages[0].getText();
      expect(errorMessage).to.include("Nhập email");
    }
  });
});
