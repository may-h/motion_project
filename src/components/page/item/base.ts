export class BaseComponent {
    private element: HTMLElement; 

    constructor() {

    }

    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
        parent.insertAdjacentElement(position, this.element);
    }
}