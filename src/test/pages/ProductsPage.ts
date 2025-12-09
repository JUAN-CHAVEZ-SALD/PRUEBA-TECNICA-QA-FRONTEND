import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  protected readonly path: string = "/inventory.html";

  private readonly productsTitle = this.page.locator(".title");
  private readonly inventoryContainer = this.page.locator(
    '[data-test="inventory-container"]'
  );
  private readonly inventoryItem = this.page.locator(".inventory_item");
  private readonly inventoryItemName = this.page.locator(
    ".inventory_item_name"
  );
  private readonly inventoryItemPrice = this.page.locator(
    ".inventory_item_price"
  );
  private readonly inventoryItemDescription = this.page.locator(
    ".inventory_item_desc"
  );
  private readonly shoppingCartLink = this.page.locator(".shopping_cart_link");
  private readonly shoppingCartBadge = this.page.locator(
    ".shopping_cart_badge"
  );
  private readonly productSortContainer = this.page.locator(
    ".product_sort_container"
  );

  constructor(page: Page) {
    super(page);
  }

  public isLoaded = async (): Promise<boolean> => {
    return await this.inventoryContainer.isVisible();
  };
}
