import { After, AfterStep, Before } from "@cucumber/cucumber";
import { TestContext } from "../context/TestContext";

// Inicializar el contexto antes de cada escenario
Before(async function (this: TestContext) {
  await this.init();
});

// Tomar captura de pantalla después de cada paso
AfterStep(async function (this: TestContext, { result }) {

  // Tomar captura si o si después de cada paso
  const screenshot = await this.page.screenshot({ fullPage: true });
  this.attach(screenshot, "image/png");

});

// Limpiar el contexto después de cada escenario
After(async function (this: TestContext, { result }) {

  await this.cleanup();
});
