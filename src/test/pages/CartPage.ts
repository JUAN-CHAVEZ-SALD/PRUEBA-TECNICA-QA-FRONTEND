import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import extraerNumerosDeTexto from "../utils/functions/helpers/extraerNumerosDeTexto";

export interface CartItem {
  nombre: string;
  cantidad: number;
  descripcion: string;
  precio: number;
  removeButton_CartPageLocator: Locator;
}

export class CartPage extends BasePage {
  protected readonly path: string = "/cart.html";

  private readonly cartItem = this.page.locator(".cart_item");

  private cartItemName(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_name");
  }

  private cartItemQuantity(containerLocator: Locator): Locator {
    return containerLocator.locator(".cart_quantity");
  }

  private cartItemDescription(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_desc");
  }

  private cartItemPrice(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_price");
  }

  private cartItemRemoveButton(cartItemName: string): Locator {
    return this.page.locator(
      `button[data-test="remove-${cartItemName
        .replace(/\s+/g, "-")
        .toLowerCase()}"]`
    );
  }

  private readonly continueShoppingButton = this.page.locator(
    '[data-test="continue-shopping"]'
  );

  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly removeButtons = this.page.locator('[data-test^="remove-"]');

  constructor(page: Page) {
    super(page);
  }

  public isLoaded = async (): Promise<boolean> => {
    return await this.continueShoppingButton.isVisible();
  };

  public async getAllCartItems(): Promise<CartItem[]> {
    const cartItemLocators = await this.cartItem.all();

    const cartItems = await Promise.all(
      cartItemLocators.map(async (cartItemLocator) => {
        const nombre = (await this.cartItemName(cartItemLocator).textContent())
          ?.trim()
          .toString();

        const descripcion = (
          await this.cartItemDescription(cartItemLocator).textContent()
        )
          ?.trim()
          .toString();

        const cantidad = Number(
          (await this.cartItemQuantity(cartItemLocator).textContent())?.trim()
        );

        const precio = extraerNumerosDeTexto(
          await this.cartItemPrice(cartItemLocator).textContent()
        );

        const removeButton_CartPageLocator = this.cartItemRemoveButton(nombre);

        return {
          nombre,
          descripcion,
          precio,
          cantidad,
          removeButton_CartPageLocator,
        } as CartItem;
      })
    );

    return cartItems;
  }

  async getCartItemsCount(): Promise<number> {
    return await this.countElements(this.cartItem);
  }

  async removeItemsFromCart(cartItems: CartItem[]): Promise<void> {
    for (const cartItem of cartItems) {
      await this.click(cartItem.removeButton_CartPageLocator, {
        state: "visible",
      });
    }
  }

  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton, { state: "visible" });
  }

  async clickCheckout(): Promise<void> {
    await this.click(this.checkoutButton, { state: "visible" });
  }
}
