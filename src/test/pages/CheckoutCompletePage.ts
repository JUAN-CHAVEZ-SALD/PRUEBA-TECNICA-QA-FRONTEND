import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutCompletePage extends BasePage {
  protected readonly path: string = "/checkout-complete.html";

  private readonly completeHeader = this.page.locator(".complete-header");

  constructor(page: Page) {
    super(page);
  }

  public isLoaded = async (): Promise<boolean> => {
    return await this.completeHeader.isVisible();
  };

  async getConfirmationHeader(): Promise<string | null> {
    if (await this.completeHeader.isVisible()) {
      return (await this.completeHeader.textContent())?.trim() ?? null;
    }
    return null;
  }
}
