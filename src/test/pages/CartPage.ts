import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CartPage extends BasePage {
    
    protected readonly path : string = '/cart.html';

    constructor(page: Page){
        super(page);
    }

    public isLoaded = async (): Promise<boolean> => {
        return await true;
    }
    
}