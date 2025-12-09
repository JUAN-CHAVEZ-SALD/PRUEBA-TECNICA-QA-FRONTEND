import { When, Then } from "@cucumber/cucumber";
import { TestContext } from "../utils/context/TestContext";
import { expect } from "@playwright/test";

When(
  "el usuario agrega {int} productos al carrito",
  async function (this: TestContext, cantidadProductos: number) {
    const products = await this.productsPage.getAllProducts();

    if (cantidadProductos > products.length)
      throw new Error(
        `El test no puede continuar debido a que la cantidad de productos a agregar excede el total disponible -> Productos Solicitados: ${cantidadProductos} || Máximo: ${products.length}`
      );

    products.sort(() => Math.random() - 0.5); // Mezclar aleatoriamente el array de productos

    // Seleccionar los primeros 'cantidadProductos' productos
    const productsToAdd = products.slice(0, cantidadProductos);

    await this.productsPage.addProductsToCart(productsToAdd, this);
  }
);

When(
  "el usuario remueve {int} productos desde la página de productos",
  async function (this: TestContext, cantidadARemover: number) {
    if (cantidadARemover > this.selectedProducts.length)
      throw new Error(
        `El test no puede continuar debido a que la cantidad de productos a remover debe ser como maximo un productos menos que el total disponible -> Productos a remover: ${cantidadARemover} || Productos Seleccionados: ${this.selectedProducts.length}`
      );

    this.selectedProducts.sort(() => Math.random() - 0.5); // Mezclar aleatoriamente el array de productos seleccionados

    // Seleccionar los primeros 'cantidadARemover' productos
    const productsToRemove = this.selectedProducts.slice(0, cantidadARemover);

    await this.productsPage.removeProductsFromCart(productsToRemove, this);
  }
);

When(
  "el usuario remueve todos los productos desde la página de productos",
  async function (this: TestContext) {
    await this.productsPage.removeProductsFromCart(
      [...this.selectedProducts],
      this
    );
  }
);

When(
  "el usuario hace clic en el icono del carrito",
  async function (this: TestContext) {
    await this.productsPage.clickCartIcon();
  }
);

When(
  "el usuario remueve {int} productos desde el carrito",
  async function (this: TestContext, cantidadARemover: number) {
    const cartItems = await this.cartPage.getAllCartItems();

    if (cantidadARemover > cartItems.length)
      throw new Error(
        `El test no puede continuar debido a que la cantidad de productos a remover excede el total disponible en el carrito -> Productos a remover: ${cantidadARemover} || Máximo en carrito: ${cartItems.length}`
      );

    cartItems.sort(() => Math.random() - 0.5); // Mezclar aleatoriamente el array de productos en el carrito

    // Seleccionar los primeros 'cantidadARemover' productos
    const cartItemsToRemove = cartItems.slice(0, cantidadARemover);

    await this.cartPage.removeItemsFromCart(cartItemsToRemove);
  }
);

When(
  "el usuario remueve todos los productos desde la pagina del carrito",
  async function (this: TestContext) {
    const cartItems = await this.cartPage.getAllCartItems();

    await this.cartPage.removeItemsFromCart(cartItems);
  }
);

When(
  "el usuario vuelve a la página de productos",
  async function (this: TestContext) {
    await this.cartPage.clickContinueShopping();
  }
);

Then(
  'los botones de dichos productos debe cambiar a "Remove"',
  async function (this: TestContext) {
    for (const product of this.selectedProducts) {
      const removeButtonIsVisible =
        await product.removeButton_ProductsPageLocator.isVisible();
      expect(removeButtonIsVisible).toBeTruthy();
    }
  }
);

Then(
  'los botones de dichos productos deben cambiar a "Add to cart"',
  async function (this: TestContext) {
    for (const removedProduct of this.lastRemovedProducts) {
      const addToCartButtonIsVisible =
        await removedProduct.addToCartButtonLocator.isVisible();

      expect(addToCartButtonIsVisible).toBeTruthy();
    }
  }
);

Then(
  "el contador del carrito debe mostrar {int}",
  async function (this: TestContext, expectedCount: number) {
    const actualCount = await this.productsPage.getCartBadgeCount();
    expect(actualCount).toBe(expectedCount);
  }
);

Then(
  "el contador del carrito no debe ser visible",
  async function (this: TestContext) {
    const isVisible = await this.productsPage.isCartBadgeVisible();
    expect(isVisible).toBe(false);
  }
);

Then(
  "debe ver {int} productos en el carrito",
  async function (this: TestContext, expectedCount: number) {
    const actualCount = await this.cartPage.getCartItemsCount();
    expect(actualCount).toBe(expectedCount);
  }
);

Then(
  "los productos deben coincidir con los agregados",
  async function (this: TestContext) {
    const productsInCart = await this.cartPage.getAllCartItems();

    const productNamesAreTheSame = this.selectedProducts.every(
      (selectedProduct) =>
        productsInCart.some(
          (cartItem) => cartItem.nombre === selectedProduct.nombre
        )
    );

    expect(productNamesAreTheSame).toBeTruthy();
  }
);
