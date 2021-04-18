import { BaseComponent, Component } from "../components.js";

export interface Composable {
    addChild(child: Component): void;
}

// 닫혔는지 알려주기만 하는 리스너..
type OnCloseListener = () => void;

class PageItemComponent extends BaseComponent<HTMLElement> implements Composable {
    // 외부로부터 전달받은 callback함수를 저장하고 있을 곳 
    private closeListener?: OnCloseListener; 
    
    constructor() {
        super(`<li class="page-item">
                <section class="page-item__body"></section>
                <div class="page-item__controls">
                    <button class="close" onClick="alert('hello')">&times;</button>
                </div>
              </li>`);
        const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
        closeBtn.onclick = () =>{
            this.closeListener && this.closeListener();
        };
    }

    addChild(child: Component) {
        const container = this.element.querySelector(".page-item__body")! as HTMLElement;
        child.attachTo(container);
    }

    setOnCloseListener(listener: OnCloseListener) {
        this.closeListener = listener;
    }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
    constructor() {
        super('<ul class="page"></ul>');
    }

    addChild(section: Component) {
        const item = new PageItemComponent();
        item.addChild(section);
        item.attachTo(this.element, 'beforeend');
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
        }); // callback 함수 등록. 
    }
}