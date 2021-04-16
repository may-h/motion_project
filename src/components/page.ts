export class PageComponent {
    private element: HTMLUListElement; // 카드 목록을 담는다. 

    constructor() {
        this.element = document.createElement('ul');
        this.element.setAttribute('class', 'page');
        this.element.textContent = 'This is PageComponent';

    }

    //page component API 
    attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
        parent.insertAdjacentElement(position, this.element);
    }
}