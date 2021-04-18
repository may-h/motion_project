import { BaseComponent } from "../../components.js";

export class ImageComponent extends BaseComponent<HTMLElement>{

    constructor(title: string, url: string) {
        super(`<section class="image">
                <div class="image__holer"><img class="image__thumbnail"></div>
                <p class="image__title"></p>
                </section>`);

        const imageElement = this.element.querySelector('.image__thumbnail')! as HTMLImageElement;
        imageElement.src = url;
        imageElement.alt = title;

        const titleElement = this.element.querySelector('.image__title')! as HTMLParagraphElement; 
        titleElement.textContent = title;
    }

}