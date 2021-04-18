import { BaseComponent, Component } from "../components.js";

class PageItemComponent extends BaseComponent<HTMLElement> {
    constructor() {
        super(`<li class="page-item">
                <section class="page-tiem__body"></section>
                <div class="page-item__controls">
                    <button class="close">&times;</button>
                </div>
              </li>`);
    }

    addChild(child: Component) {
        const container = this.element.querySelector(".page-item__body")! as HTMLElement;
        child.attachTo(container);
    }
}

export class PageComponent extends BaseComponent<HTMLUListElement> {
    constructor() {
        super('<ul class="page"></ul>');
    }

    addChild(section: Component) {
        const item = new PageItemComponent();
        item.addChild(section);
        item.attachTo(this.element, 'beforeend');
    }
}