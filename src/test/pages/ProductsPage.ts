import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TestContext } from "../utils/context/TestContext";

export interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
  addToCartButtonLocator: Locator;
  removeButton_ProductsPageLocator: Locator;
}

export class ProductsPage extends BasePage {
  protected readonly path: string = "/inventory.html";

  private readonly inventoryContainer = this.page.locator(
    '[data-test="inventory-container"]'
  );

  private readonly inventoryItem = this.page.locator(".inventory_item");
  private inventoryItemName(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_name");
  }
  private inventoryItemPrice(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_price");
  }
  private inventoryItemDescription(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_desc");
  }
  private addToCartButton(containerLocator: Locator): Locator {
    return containerLocator.locator('button[name^="add-to-cart-"]');
  }

  private readonly shoppingCartLink = this.page.locator(".shopping_cart_link");
  private readonly shoppingCartBadge = this.page.locator(
    ".shopping_cart_badge"
  );

  constructor(page: Page) {
    super(page);
  }

  public isLoaded = async (): Promise<boolean> => {
    return await this.inventoryContainer.isVisible();
  };

  public async getAllProducts(): Promise<Producto[]> {
    const productsItem = await this.inventoryItem.all();

    const products: Producto[] = await Promise.all(
      productsItem.map(async (item) => {
        const nombre = await this.inventoryItemName(item).textContent();

        const descripcion = await this.inventoryItemDescription(
          item
        ).textContent();
        const precioTexto = await this.inventoryItemPrice(item).textContent();
        const precio = parseFloat(precioTexto.replace("$", ""));

        const addToCartButtonLocator = this.addToCartButton(item);

        const removeButton_ProductsPageLocator = item.locator(
          'button[name^="remove-"]'
        );

        return {
          nombre,
          descripcion,
          precio,
          addToCartButtonLocator,
          removeButton_ProductsPageLocator,
        } as Producto;
      })
    );

    return products;
  }

  async addProductsToCart(
    products: Producto[],
    testContext: TestContext
  ): Promise<void> {
    for (const product of products) {
      await this.click(product.addToCartButtonLocator, { state: "visible" });
      testContext.selectedProducts.push(product);
    }
  }

async removeProductsFromCart(
  products: Producto[],
  testContext: TestContext
): Promise<void> {
  testContext.lastRemovedProducts = [];

  for (const product of products) {
    console.log(`Intentando remover: ${product.nombre}`);
    const isVisible = await product.removeButton_ProductsPageLocator.isVisible();
    
    await this.click(product.removeButton_ProductsPageLocator, {
      state: "visible",
    });
    testContext.selectedProducts = testContext.selectedProducts.filter(
      (p) => p.nombre !== product.nombre
    );
    testContext.lastRemovedProducts.push(product);
  }
}
  async getCartBadgeCount(): Promise<number | null> {
    if (await this.shoppingCartBadge.isVisible()) {
      return Number(await this.shoppingCartBadge.textContent());
    }
    return null;
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.shoppingCartBadge.isVisible();
  }

  async clickCartIcon(): Promise<void> {
    await this.click(this.shoppingCartLink, { state: "visible" });
  }
  
}
