import {
  IWorldOptions,
  setDefaultTimeout,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { Producto, ProductsPage } from "../../pages/ProductsPage";
import { CartItem, CartPage } from "../../pages/CartPage";
import { CheckoutStepOnePage } from "../../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../../pages/CheckoutStepTwoPage";

import "dotenv/config";
import { SecretsAvailable } from "./types/SecretsAvailable";
import { CheckoutCompletePage } from "../../pages/CheckoutCompletePage";

interface WorldParameters {
  browser?: "chromium" | "firefox" | "webkit";
  headless?: boolean;
}

export class TestContext extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // Productos seleccionados en el escenario en curso
  selectedProducts: Producto[] = [];
  // Últimos productos removidos para validaciones
  lastRemovedProducts: Producto[] = [];
  //
  productsInCart: CartItem[] = [];

  // Paginas utilizadas
  loginPage!: LoginPage;
  productsPage!: ProductsPage;
  cartPage!: CartPage;
  checkoutStepOnePage!: CheckoutStepOnePage;
  checkoutStepTwoPage!: CheckoutStepTwoPage;
  checkoutCompletePage!: CheckoutCompletePage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init(): Promise<void> {
    const parameters = this.parameters as WorldParameters;
    const browserType = parameters.browser || "chromium";
    const headless =
      parameters.headless !== undefined ? parameters.headless : false;

    switch (browserType) {
      case "firefox":
        this.browser = await (
          await import("@playwright/test")
        ).firefox.launch({ headless });
        break;
      case "webkit":
        this.browser = await (
          await import("@playwright/test")
        ).webkit.launch({ headless });
        break;
      default:
        this.browser = await (
          await import("@playwright/test")
        ).chromium.launch({ headless });
    }

    // Crear contexto y página
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    this.page = await this.context.newPage();

    // Inicializar las clases de cada página
    this.loginPage = new LoginPage(this.page);
    this.productsPage = new ProductsPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutStepOnePage = new CheckoutStepOnePage(this.page);
    this.checkoutStepTwoPage = new CheckoutStepTwoPage(this.page);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page);

    // Resetear datos de escenario
    this.selectedProducts = [];
    this.lastRemovedProducts = [];
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  getSecretValue(secretKey: SecretsAvailable): string {
    return process.env[secretKey]!;
  }
}

// Registrar el TestContext como el World constructor
setWorldConstructor(TestContext);

// Establecer un timeout por defecto para los pasos de 30 segundos
setDefaultTimeout(30 * 1000);
