import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutStepOnePage extends BasePage {
  protected readonly path: string = "/checkout-step-one.html";

  private readonly firstNameInput = this.page.locator(
    '[data-test="firstName"]'
  );
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator(
    '[data-test="postalCode"]'
  );
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly errorContainer = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  public isLoaded = async (): Promise<boolean> => {
    return await this.firstNameInput.isVisible();
  };

  async fillBuyerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName ?? "");
    await this.lastNameInput.fill(lastName ?? "");
    await this.postalCodeInput.fill(postalCode ?? "");
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    if (await this.errorContainer.isVisible()) {
      const errorMessage = await this.errorContainer.textContent()
      return errorMessage?.trim() || null;
    }
    return null;
  }
}
