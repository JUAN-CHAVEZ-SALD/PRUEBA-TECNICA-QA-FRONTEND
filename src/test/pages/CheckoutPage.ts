import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CheckoutPage extends BasePage {
    
    protected readonly path : string = '/checkout-step-one.html';

    constructor(page: Page){
        super(page);
    }

    public isLoaded = async (): Promise<boolean> => {
        return await true;
    }

}