import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import extraerNumerosDeTexto from "../utils/functions/helpers/extraerNumerosDeTexto";

interface SummaryItem {
  nombre: string;
  precio: number;
  cantidad: number;
}

export class CheckoutStepTwoPage extends BasePage {
  protected readonly path: string = "/checkout-step-two.html";

  private readonly summaryItem = this.page.locator(".cart_item");

  private summaryItemName(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_name");
  }
  private summaryItemPrice(containerLocator: Locator): Locator {
    return containerLocator.locator(".inventory_item_price");
  }

  private summaryItemQuantity(containerLocator: Locator): Locator {
    return containerLocator.locator(".cart_quantity");
  }

  private readonly subtotalLabel = this.page.locator(".summary_subtotal_label");
  private readonly taxLabel = this.page.locator(".summary_tax_label");
  private readonly totalLabel = this.page.locator(".summary_total_label");
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly backHomeButton = this.page.locator(
    '[data-test="back-to-products"]'
  );
  constructor(page: Page) {
    super(page);
  }

  public isLoaded = async (): Promise<boolean> => {
    return await this.summaryItem.first().isVisible();
  };

  async getSummaryItems(): Promise<SummaryItem[]> {
    const sumaryItemsLocators = await this.summaryItem.all();

    const sumaryItems: SummaryItem[] = await Promise.all(
      sumaryItemsLocators.map(async (itemLocator) => {
        const nombre = await this.summaryItemName(itemLocator).textContent();

        const precio = extraerNumerosDeTexto(
          await this.summaryItemPrice(itemLocator).textContent()
        );

        const cantidad = extraerNumerosDeTexto(
          await this.summaryItemQuantity(itemLocator).textContent()
        );

        return { nombre, precio, cantidad } as SummaryItem;
      })
    );

    return sumaryItems;
  }

  async getSubtotalFromWeb(): Promise<number> {
    const textFromLabel = await this.subtotalLabel.textContent();
    return extraerNumerosDeTexto(textFromLabel);
  }

  async getTaxFromWeb(): Promise<number> {
    const textFromLabel = await this.taxLabel.textContent();
    return extraerNumerosDeTexto(textFromLabel);
  }

  async getTotalFromWeb(): Promise<number> {
    const textFromLabel = await this.totalLabel.textContent();
    return extraerNumerosDeTexto(textFromLabel);
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async clickBackHome() {
    await this.backHomeButton.click();
  }
}
