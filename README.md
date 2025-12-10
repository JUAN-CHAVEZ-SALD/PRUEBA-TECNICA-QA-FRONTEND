# Proyecto de Automatización QA – FrontEnd

**Autor:** Juan Manuel Chavez Saldaña

Suite de pruebas automatizadas para la aplicación web [Sauce Demo](https://www.saucedemo.com/), verificando el flujo E2E de una compra.

## 1. Estrategia de Automatización y Patrones

Este proyecto utiliza un enfoque BDD (Desarrollo Guiado por el Comportamiento) y aplica principios de Programación Orientada a Objetos (POO) para crear una estructura de pruebas robusta y mantenible.

-   **Playwright & Cucumber:** Se usa Playwright para la automatización del navegador y Cucumber para escribir las pruebas en lenguaje Gherkin, facilitando la colaboración entre perfiles técnicos y no técnicos.

-   **Page Object Model (POM) con POO Avanzada:** La arquitectura se basa en el patrón POM, aplicando conceptos de POO para maximizar la reutilización de código y la mantenibilidad.
    -   **Clases Abstractas:** Se utiliza una clase abstracta `BasePage` (`src/test/pages/BasePage.ts`) que sirve como plantilla para todas las páginas. Esta clase centraliza lógica común (navegación, clics genéricos) y define contratos que las páginas hijas deben implementar, como el método `isLoaded()`.
    -   **Herencia:** Cada clase de página (ej. `LoginPage`, `ProductsPage`) hereda de `BasePage`, implementando su lógica específica y aprovechando la funcionalidad compartida.
    -   **Interfaces:** Se emplean interfaces (ej. `Producto`, `CartItem`) para definir modelos de datos claros y consistentes, garantizando la seguridad de tipos en todo el proyecto.

-   **Cucumber World (TestContext):** Se utiliza una clase `TestContext` (`src/test/utils/context/TestContext.ts`) que extiende el `World` de Cucumber. Esta clase es fundamental para gestionar el estado entre los diferentes pasos (`steps`) de un mismo escenario. Inyecta el navegador, el contexto de Playwright y las instancias de las páginas, además de almacenar datos de escenario (como los productos seleccionados), garantizando que los escenarios sean autocontenidos y no dependan de estados globales.

## 2. Funcionalidades Cubiertas

Las pruebas automatizadas cubren la historia de usuario principal de un cliente de Sauce Demo. Los escenarios se agrupan en:

-   **Login:**
    -   Inicio de sesión exitoso con credenciales válidas (`standard_user`).
    -   Fallo de inicio de sesión con credenciales inválidas.
    -   Fallo de inicio de sesión para usuarios bloqueados (`locked_out_user`).
    -   Validación de campos obligatorios (usuario y contraseña).

-   **Carrito de Compras:**
    -   Agregar uno o más productos al carrito desde la página de productos.
    -   Verificar que los productos y sus cantidades se reflejan correctamente en el carrito.

-   **Proceso de Compra (Checkout):**
    -   Navegar desde el carrito al formulario de información del comprador.
    -   Completar el formulario con datos de prueba.
    -   Verificar el resumen de la orden y finalizar la compra.
    -   Validar el mensaje de confirmación de compra exitosa.

## 3. Prerrequisitos

-   [Node.js](https://nodejs.org/) (v18.x o superior)
-   `npm` (incluido con Node.js)

## 4. Configuración del Proyecto

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL-DEL-REPOSITORIO>
    cd <NOMBRE-DEL-DIRECTORIO>
    ```

2.  **Configurar Variables de Entorno:**
    El proyecto necesita credenciales que se cargan desde un archivo `.env`. Renombra el archivo `secrets.txt` a `.env` para activar las variables.

    ```bash
    # En Windows (Command Prompt)
    rename secrets.txt .env

    # En Windows (PowerShell)
    ren secrets.txt .env

    # En macOS / Linux
    mv secrets.txt .env
    ```

3.  **Instalar dependencias y navegadores:**
    ```bash
    npm install
    npx playwright install
    ```

## 5. Ejecución de las Pruebas

#### Ejecutar todas las pruebas
```bash
npm test
```

#### Ejecutar pruebas por tags
Puedes filtrar la ejecución por los tags definidos en los archivos `.feature` (ej: `@regresion`, `@smoke-test`).

```bash
npx cucumber-js --config cucumber.json --tags "@regresion"
```
Este comando es compatible con Windows, macOS y Linux.

## 6. Informes de Resultados

Al finalizar la ejecución, se generará un informe de Cucumber en formato HTML. Para verlo:

1.  Busca la carpeta `reports` en la raíz del proyecto.
2.  Abre el archivo `cucumber-report.html` en tu navegador de preferencia.

## 7. Estructura del Proyecto

```
PRUEBA-TECNICA-QA-FRONTEND/
├── cucumber.json                # Configuración de Cucumber
├── package.json                 # Dependencias y scripts del proyecto
├── playwright.config.ts         # Configuración de Playwright
├── secrets.txt                  # Archivo de ejemplo con credenciales
├── tsconfig.json                # Configuración de TypeScript
└── src/
    └── test/
        ├── features/            # Archivos Gherkin (.feature) con los escenarios de prueba
        ├── pages/               # Page Object Models (POM) para cada página de la app
        ├── steps/               # Definiciones de los pasos (step definitions)
        └── utils/               # Utilidades, hooks y configuraciones de soporte
```