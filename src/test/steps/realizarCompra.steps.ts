import { When, Then, DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { TestContext } from "../utils/context/TestContext";

const TASA_IMPUESTO_SAUCE_DEMO = 0.08;

When('el usuario hace clic en "Checkout"', async function (this: TestContext) {
  const cartItemsInCart = await this.cartPage.getAllCartItems();

  this.productsInCart = cartItemsInCart;

  await this.cartPage.clickCheckout();
});

Then(
  "debe estar en la página de checkout paso uno",
  async function (this: TestContext) {
    const isLoaded = await this.checkoutStepOnePage.isLoaded();
    expect(isLoaded).toBeTruthy();
  }
);

When(
  "el usuario ingresa la información del comprador:",
  async function (this: TestContext, table: DataTable) {
    const [row] = table.hashes();
    await this.checkoutStepOnePage.fillBuyerInfo(
      row.firstName ?? "",
      row.lastName ?? "",
      row.postalCode ?? ""
    );
  }
);

When('el usuario hace clic en "Continue"', async function (this: TestContext) {
  await this.checkoutStepOnePage.clickContinue();
});

When('el usuario hace clic en "Cancel"', async function (this: TestContext) {
  await this.checkoutStepOnePage.clickCancel();
});

Then(
  "debe estar en la página de checkout paso dos",
  async function (this: TestContext) {
    const isLoaded = await this.checkoutStepTwoPage.isLoaded();
    expect(isLoaded).toBeTruthy();
  }
);

Then(
  "debe ver el mensaje de error: {string}",
  async function (this: TestContext, expectedError: string) {
    const error = await this.checkoutStepOnePage.getErrorMessage();
    expect(error).toBe(expectedError);
  }
);

Then(
  "los productos en el resumen deben coincidir con los agregados en el carrito",
  async function (this: TestContext) {
    // Elementos del resumen de la página de checkout paso dos
    const summaryItems = await this.checkoutStepTwoPage.getSummaryItems();

    const cartItems = this.productsInCart;

    // Se valida que cada producto en el resumen esté presente en el carrito
    const allSummaryItemsInCart = summaryItems.every((summaryItem) => {
      return cartItems.some(
        (cartItem) =>
          cartItem.nombre.trim() === summaryItem.nombre.trim() &&
          cartItem.cantidad === summaryItem.cantidad &&
          cartItem.precio === summaryItem.precio
      );
    });

    expect(allSummaryItemsInCart).toBeTruthy();
  }
);

Then(
  "la suma de los precios de los productos debe ser correcta",
  async function (this: TestContext) {
    const summaryItems = await this.checkoutStepTwoPage.getSummaryItems();

    const subtotalPage = await this.checkoutStepTwoPage.getSubtotalFromWeb();

    // Sumamos los precios de los productos del resumen
    const sumaTotal = summaryItems.reduce((acumulador, p) => acumulador + p.precio, 0);
    
    expect(sumaTotal).toBeCloseTo(subtotalPage, 2);
  }
);

Then(
  "el impuesto calculado debe ser correcto",
  async function (this: TestContext) {
    const subtotal = await this.checkoutStepTwoPage.getSubtotalFromWeb();
    const tax = await this.checkoutStepTwoPage.getTaxFromWeb();
    const expectedTax = Number((subtotal * TASA_IMPUESTO_SAUCE_DEMO).toFixed(2));
    expect(tax).toBeCloseTo(expectedTax, 2);
  }
);

Then(
  "el total de la compra debe ser correcto",
  async function (this: TestContext) {
    const subtotal = await this.checkoutStepTwoPage.getSubtotalFromWeb();
    const tax = await this.checkoutStepTwoPage.getTaxFromWeb();
    const total = await this.checkoutStepTwoPage.getTotalFromWeb();
    const expectedTotal = Number((subtotal + tax).toFixed(2));
    expect(total).toBeCloseTo(expectedTotal, 2);
  }
);

When('el usuario hace clic en "Finish"', async function (this: TestContext) {
  await this.checkoutStepTwoPage.clickFinish();
});

Then(
  "debe estar en la página de confirmación de la compra",
  async function (this: TestContext) {
    const isLoaded = await this.checkoutCompletePage.isLoaded();
    expect(isLoaded).toBeTruthy();
  }
);

Then(
  "debe ver el mensaje de confirmación {string}",
  async function (this: TestContext, expected: string) {
    const header = await this.checkoutCompletePage.getConfirmationHeader();
    expect(header).toBe(expected);
  }
);

When('el usuario hace clic en "Back Home"', async function (this: TestContext) {
  await this.checkoutStepTwoPage.clickBackHome();
});

Then("debe estar en la página del carrito", async function (this: TestContext) {
  const isLoaded = await this.cartPage.isLoaded();
  expect(isLoaded).toBeTruthy();
});

Then(
  "los productos deben permanecer en el carrito",
  async function (this: TestContext) {
    const cartItems = await this.cartPage.getAllCartItems();
    const cartNames = cartItems.map((c) => c.nombre.trim());
    const selectedNames = this.selectedProducts.map((p) => p.nombre.trim());
    expect(cartNames.sort()).toEqual(selectedNames.sort());
  }
);
