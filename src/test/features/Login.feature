Feature: Autenticación de usuarios en SauceDemo

    @LGN1 @regresion @smoke-test @happypath @login
    Scenario: Inicio de sesión exitoso con credenciales válidas
        Given que el usuario está en la página de login
        When ingresa un usuario válido y contraseña correcta
        And hace clic en el botón "Login"
        Then debe ser redirigido a la página de productos

    @LGN2 @regresion @smoke-test @unhappypath @login
    Scenario: Iniciar de sesión con contraseña incorrecta
        Given que el usuario está en la página de login
        When ingresa un usuario válido y contraseña incorrecta
        And hace clic en el botón "Login"
        Then debe ver un mensaje de error: "Epic sadface: Username and password do not match any user in this service"

    @LGN3 @regresion @smoke-test @unhappypath @login
    Scenario: Iniciar de sesión con cuenta bloqueada
        Given que el usuario está en la página de login
        When ingresa un usuario bloqueado y contraseña válida
        And hace clic en el botón "Login"
        Then debe ver un mensaje de error: "Epic sadface: Sorry, this user has been locked out."

    @LGN4 @regresion @smoke-test @unhappypath @login
    Scenario: Iniciar de sesión con credenciales inválidas
        Given que el usuario está en la página de login
        When ingresa un usuario inválido y contraseña incorrecta
        And hace clic en el botón "Login"
        Then debe ver un mensaje de error: "Epic sadface: Username and password do not match any user in this service"

    @LGN5 @regresion @smoke-test @unhappypath @login
    Scenario: Iniciar de sesión sin usuario
        Given que el usuario está en la página de login
        When deja vacío el campo de usuario e ingresa una contraseña válida
        And hace clic en el botón "Login"
        Then debe ver un mensaje de error: "Epic sadface: Username is required"

    @LGN6 @regresion @smoke-test @unhappypath @login
    Scenario: Iniciar de sesión sin contraseña
        Given que el usuario está en la página de login
        When ingresa un usuario válido y deja vacío el campo de contraseña
        And hace clic en el botón "Login"
        Then debe ver un mensaje de error: "Epic sadface: Password is required"
