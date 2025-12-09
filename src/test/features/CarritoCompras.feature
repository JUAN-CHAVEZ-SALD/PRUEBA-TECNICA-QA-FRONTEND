Feature: Gestión del carrito de compras en SauceDemo

    Background:
        Given que el usuario está en la página de login
        When ingresa un usuario válido y contraseña correcta
        And hace clic en el botón "Login"
        Then debe ser redirigido a la página de productos
    
    @CC1 @regresion @smoke-test @happypath @carrito
    Scenario Outline: Agregar productos al carrito desde la página de productos
        When el usuario agrega <cantidad_productos> productos al carrito
        Then los botones de dichos productos debe cambiar a "Remove"
        And el contador del carrito debe mostrar <cantidad_productos>

        Examples:
          | cantidad_productos |
          | 1                  |
          | 2                  |
          | 3                  |
          | 4                  |
    
    @CC2 @regresion @smoke-test @happypath @carrito
    Scenario Outline: Remover algunos productos del carrito desde la página de productos
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario remueve <cantidad_productos_remover> productos desde la página de productos
        Then los botones de dichos productos deben cambiar a "Add to cart"
        And el contador del carrito debe mostrar <cantidad_restante>
        Examples:
          | cantidad_productos | cantidad_productos_remover | cantidad_restante |
          | 3                  | 1                          | 2                 |
          | 4                  | 3                          | 1                 |
          | 2                  | 1                          | 1                 |
    
    @CC3 @regresion @smoke-test @happypath @carrito
    Scenario Outline: Remover todos los productos del carrito desde la página de productos
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario remueve todos los productos desde la página de productos
        Then los botones de dichos productos deben cambiar a "Add to cart"
        And el contador del carrito no debe ser visible
        Examples:
          | cantidad_productos |
          | 1                  |
          | 2                  |
          | 3                  |
          | 4                  |

    @CC4 @regresion @smoke-test @happypath @carrito
    Scenario Outline: Ver productos en el carrito
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario hace clic en el icono del carrito
        Then debe ver <cantidad_productos> productos en el carrito
        And los productos deben coincidir con los agregados
        Examples:
          | cantidad_productos |
          | 1                  |
          | 2                  |
          | 3                  |
          | 4                  |

    @CC5 @regresion @smoke-test @happypath @carrito
    Scenario Outline: Remover algunos productos del carrito desde la pagina del carrito
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario hace clic en el icono del carrito
        And el usuario remueve <cantidad_productos_remover> productos desde el carrito
        And el usuario vuelve a la página de productos
        Then el contador del carrito debe mostrar <cantidad_restante>

        Examples:
          | cantidad_productos | cantidad_productos_remover | cantidad_restante |
          | 3                  | 1                          | 2                 |
          | 4                  | 3                          | 1                 |
          | 2                  | 1                          | 1                 |

    @CC6 @regresion @smoke-test @happypath @carrito
    Scenario Outline: Remover todos los productos del carrito desde la pagina del carrito
        When el usuario agrega <cantidad_productos> productos al carrito
        And el usuario hace clic en el icono del carrito
        And el usuario remueve todos los productos desde la pagina del carrito
        And el usuario vuelve a la página de productos
        Then el contador del carrito no debe ser visible

        Examples:
          | cantidad_productos |
          | 3                  |
          | 4                  |
          | 2                  |
