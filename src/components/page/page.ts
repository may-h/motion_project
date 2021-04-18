import { BaseComponent } from "../components.js";


export class PageComponent extends BaseComponent<HTMLUListElement> {
    constructor() {
        super('<ul class="page">This is Page Component</ul>');
    }
}