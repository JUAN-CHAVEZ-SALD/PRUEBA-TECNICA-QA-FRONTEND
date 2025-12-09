import { Locator, Page, Selectors } from "@playwright/test";

export abstract class BasePage {
  private readonly BASE_URL: string = "https://www.saucedemo.com";
  protected abstract readonly path: string;
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get url(): string {
    return this.BASE_URL + this.path;
  }

  async go() {
    await this.page.goto(this.url);
  }

  async navigateTo(path: string): Promise<void> {
    const urlToNavigate = path.includes("http") ? path : this.BASE_URL + path;
    await this.page.goto(urlToNavigate);
  }

  async click(
    locator: Locator,
    waitForOptions?: Parameters<Locator["waitFor"]>[0],
    clickOptions?: Parameters<Locator["click"]>[0]
  ): Promise<void> {
    await locator.waitFor(waitForOptions);
    await locator.click(clickOptions);
  }

  async countElements(locator: Locator): Promise<number> {
    return await locator.count();
  }

  async takeSchreenshot(): Promise<Buffer<ArrayBufferLike>> {
    const screenshotBuffer = await this.page.screenshot();
    return screenshotBuffer;
  }

  public abstract isLoaded: () => Promise<boolean>;
}
