Feature: Realizar una compra en SauceDemo

    Background:
        Given que el usuario está en la página de login
        When ingresa un usuario válido y contraseña correcta
        And hace clic en el botón "Login"
        Then debe ser redirigido a la página de productos
        

    @RC1 @regresion @smoke-test @happypath @compra
    Scenario Outline: Compra exitosa de productos en SauceDemo
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario hace clic en el icono del carrito
        And el usuario hace clic en "Checkout"
        Then debe estar en la página de checkout paso uno
        When el usuario ingresa la información del comprador:
          | firstName   | lastName   | postalCode   |
          | <firstName> | <lastName> | <postalCode> |
        And el usuario hace clic en "Continue"
        Then debe estar en la página de checkout paso dos
        And los productos en el resumen deben coincidir con los agregados en el carrito
        And la suma de los precios de los productos debe ser correcta
        And el impuesto calculado debe ser correcto
        And el total de la compra debe ser correcto
        When el usuario hace clic en "Finish"
        Then debe estar en la página de confirmación de la compra
        And debe ver el mensaje de confirmación "Thank you for your order!"
        When el usuario hace clic en "Back Home"
        Then debe ser redirigido a la página de productos
        And el contador del carrito no debe ser visible
        Examples:
          | cantidad_productos | firstName | lastName | postalCode |
          | 1                  | Manuel    | Saldaña  | 67661      |
          | 2                  | Ana       | Galvan   | 12345      |
          | 3                  | Juan      | Chavez   | 04000      |
          
    @RC2 @regresion @unhappypath @compra
    Scenario Outline: Ingresar información de envío incompleta durante el checkout de una compra
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario hace clic en el icono del carrito
        And el usuario hace clic en "Checkout"
        Then debe estar en la página de checkout paso uno
        When el usuario ingresa la información del comprador:
          | firstName   | lastName   | postalCode   |
          | <firstName> | <lastName> | <postalCode> |
        And el usuario hace clic en "Continue"
        Then debe ver el mensaje de error: <error_message>
        Examples:
          | cantidad_productos | firstName | lastName | postalCode | error_message                    |
          | 1                  |           | Saldaña  | 6766       | "Error: First Name is required"  |
          | 2                  | Ana       |          | 12345      | "Error: Last Name is required"   |
          | 3                  | Juan      | Chavez   |            | "Error: Postal Code is required" |
          

    @RC3 @regresion @smoke-test @happypath @compra
    Scenario: Cancelar compra durante el proceso de checkout
        When el usuario agrega 2 productos al carrito
        And el usuario hace clic en el icono del carrito
        And el usuario hace clic en "Checkout"
        Then debe estar en la página de checkout paso uno
        When el usuario ingresa la información del comprador:
          | firstName | lastName | postalCode |
          | Laura     | Méndez   | 77777      |
        And el usuario hace clic en "Cancel"
        Then debe estar en la página del carrito
        And los productos deben permanecer en el carrito