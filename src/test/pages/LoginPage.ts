import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";



export class LoginPage extends BasePage {

    protected readonly path : string = '/';

    private readonly usernameInput = this.page.locator("#user-name");
    private readonly passwordInput = this.page.locator("#password");
    private readonly loginButton = this.page.locator("#login-button");
    private readonly errorMessage = this.page.locator('[data-test="error"]');

    constructor(page: Page){
        super(page);
    }

    async typeCredentials(username: string, password: string): Promise<void>{
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
    }

    async clickLoginButton(): Promise<void>{
        await this.click(this.loginButton, { state: 'visible' });
    }

    public isLoaded = async (): Promise<boolean> => {
        return await this.loginButton.isVisible();
    }
    
    async getLoginErrorMessageText(): Promise<string>{
        return await this.errorMessage.textContent() as string;
    }

    
}