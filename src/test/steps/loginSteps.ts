import { Given, When, Then } from "@cucumber/cucumber";
import { TestContext } from "../utils/context/TestContext";
import { SecretsAvailable } from "../utils/context/types/SecretsAvailable";
import generarCaracteresAleatorios from "../utils/functions/generators/generarCaracteresAleatorios";
import { expect } from "@playwright/test";

Given(
  "que el usuario está en la página de login",
  async function (this: TestContext) {
    await this.loginPage.go();
  }
);

When(
  "ingresa un usuario válido y contraseña correcta",
  async function (this: TestContext) {
    const username = this.getSecretValue(
      SecretsAvailable.NOMBRE_USUARIO_ESTANDAR_VALIDO
    );
    const password = this.getSecretValue(
      SecretsAvailable.PASSWORD_USUARIO_ESTANDAR_CORRECTO
    );

    await this.loginPage.typeCredentials(username, password);
  }
);

When(
  "ingresa un usuario válido y contraseña incorrecta",
  async function (this: TestContext) {
    const username = this.getSecretValue(
      SecretsAvailable.NOMBRE_USUARIO_ESTANDAR_VALIDO
    );
    const password = generarCaracteresAleatorios();
    await this.loginPage.typeCredentials(username, password);
  }
);

When(
  "ingresa un usuario bloqueado y contraseña válida",
  async function (this: TestContext) {
    const username = this.getSecretValue(
      SecretsAvailable.NOMBRE_USUARIO_BLOQUEADO
    );
    const password = this.getSecretValue(
      SecretsAvailable.PASSWORD_USUARIO_BLOQUEADO
    );
    await this.loginPage.typeCredentials(username, password);
  }
);

When(
  "ingresa un usuario inválido y contraseña incorrecta",
  async function (this: TestContext) {
    const username = generarCaracteresAleatorios();
    const password = generarCaracteresAleatorios();
    await this.loginPage.typeCredentials(username, password);
  }
);

When(
  "deja vacío el campo de usuario e ingresa una contraseña válida",
  async function (this: TestContext) {
    const password = this.getSecretValue(
      SecretsAvailable.PASSWORD_USUARIO_ESTANDAR_CORRECTO
    );
    await this.loginPage.typeCredentials("", password);
  }
);

When(
  "ingresa un usuario válido y deja vacío el campo de contraseña",
  async function (this: TestContext) {
    const username = this.getSecretValue(
      SecretsAvailable.NOMBRE_USUARIO_ESTANDAR_VALIDO
    );
    await this.loginPage.typeCredentials(username, "");
  }
);

When('hace clic en el botón "Login"', async function (this: TestContext) {
  await this.loginPage.clickLoginButton();
});

Then(
  "debe ser redirigido a la página de productos",
  async function (this: TestContext) {
    const isLoaded = await this.productsPage.isLoaded();
    expect(isLoaded).toBeTruthy();
  }
);

Then(
  "debe ver un mensaje de error: {string}",
  async function (this: TestContext, errorEsperado: string) {
    const errorActual = await this.loginPage.getLoginErrorMessageText();
    expect(errorActual?.trim()).toBe(errorEsperado);
  }
);
