import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

const url = "https://divui.com/register";

describe("Verify Register", function () {
  this.timeout(30000); // Tăng thời gian chờ cho mỗi test case

  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  async function loginTest(url, lastName, email, password, confirmPassword) {
    try {
      // Go to the login page
      await driver.get(url);
      await driver.sleep(1000);
      // Find dropdown lastname and choose option "Bà"
      let firstName = await driver.findElement(By.id("FirstName"));
      firstName.click();
      let optionFirstName = await firstName.findElement(
        By.css('option[value="MS"]')
      );
      await optionFirstName.click();
      // Find field lastname
      let lastNameField = await driver.findElement(By.name("LastName"));
      lastNameField.clear();
      await lastNameField.sendKeys(lastName);
      await driver.sleep(1000);
      // Find field email
      let emailField = await driver.findElement(By.name("Email"));
      emailField.clear();
      await emailField.sendKeys(email);
      await driver.sleep(1000);
      // Find field password
      let passwordField = await driver.findElement(By.name("Password"));
      passwordField.clear();
      await passwordField.sendKeys(password);
      await driver.sleep(1000);
      // Find field confirmpassword
      let confirmPasswordField = await driver.findElement(
        By.name("ConfirmPassword")
      );
      confirmPasswordField.clear();
      await confirmPasswordField.sendKeys(confirmPassword);
      await driver.sleep(1000);
      // Find agree box
      let agreeBox = await driver.findElement(By.name("Newsletter"));
      let isSelected = await agreeBox.isSelected();
      if (!isSelected) {
        await agreeBox.click();
      }
      // Find button register
      let btnRegister = await driver.findElement(
        By.css("button[type='submit']")
      );
      await btnRegister.click();
      await driver.sleep(2000);
    } catch (error) {
      throw new Error("Error message: " + error);
    }
  }

    it("should register successfully with valid credentials", async function () {
      const lastName = "Cao Ngọc Sơn";
      const email = "testtest100@yopmail.com";
      const password = "testtest@123";
      const confirmPassword = "testtest@123";

      await loginTest(url, lastName, email, password, confirmPassword);
    });

    it("should not register with email invalid", async function () {
      const lastName = "Cao Ngọc Sơn";
      const email = "testtest100@";
      const password = "testtest@123";
      const confirmPassword = "testtest@123";

      await loginTest(url, lastName, email, password, confirmPassword);

      let errorMessages = await driver.findElements(
        By.className("field-validation-error")
      );
      expect(errorMessages.length).to.be.greaterThan(
        0,
        "Error message element not found. Register failed."
      );
      if (errorMessages.length > 0) {
        let errorMessage = await errorMessages[0].getText();
        expect(errorMessage).to.include("Wrong email");
      }
    });

  it("should not register with password and confirm doesn't match", async function () {
    const lastName = "Cao Ngọc Sơn";
    const email = "testtest100@yopmail.com";
    const password = "testtest@123";
    const confirmPassword = "testtest@1234";

    await loginTest(url, lastName, email, password, confirmPassword);

    let errorMessages = await driver.findElements(
      By.className("field-validation-error")
    );
    expect(errorMessages.length).to.be.greaterThan(
      0,
      "Error message element not found. Register failed."
    );
    if (errorMessages.length > 0) {
      let errorMessage = await errorMessages[0].getText();
      expect(errorMessage).to.include(
        "Mật khẩu và mật khẩu nhập lại không khớp"
      );
    }
  });

  it("should not register with data empty", async function () {
    const lastName = "";
    const email = "";
    const password = "";
    const confirmPassword = "";

    await loginTest(url, lastName, email, password, confirmPassword);

    let errorMessageLastName = await driver
      .findElement(By.css("form.login-data > div:nth-child(4) > span"))
      .getText();
    expect(errorMessageLastName).to.include("Vui lòng nhập họ và tên");

    let errorMessageEmail = await driver
      .findElement(By.css("form.login-data > div:nth-child(5) > span > span"))
      .getText();
    expect(errorMessageEmail).to.include("Vui lòng nhập email");

    let errorMessagePassword = await driver
      .findElement(By.css("form.login-data > div:nth-child(6) > span > span"))
      .getText();
    expect(errorMessagePassword).to.include("Vui lòng nhập mật khẩu");

    let errorMessageConfirmPassword = await driver
      .findElement(By.css("form.login-data > div:nth-child(7) > span > span"))
      .getText();
    expect(errorMessageConfirmPassword).to.include("Vui lòng nhập mật khẩu");
  });
});
