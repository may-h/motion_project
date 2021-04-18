import { BaseComponent, Component } from "../component.js";

export interface Composable {
    addChild(child: Component): void;
}

// 닫혔는지 알려주기만 하는 리스너..
type OnCloseListener = () => void;

// 각각 세션을 감살 수 있는 컨테이너는 무조건 컴포넌트와 굼포져브블을 구현해야하고, 추가적으로 setOnCloseListener 구현해야 한다. 
interface SectionContainer extends Component, Composable {
    setOnCloseListener(listener: OnCloseListener): void;
}

type SectionContainerConstructor = {
    new (): SectionContainer; 
}

// Component>attachTo는 BaseComponent에서 구현되어 있고, Composable+setOnCloseListener는 PageItemComponent에 구현되어 있다. 
export class PageItemComponent extends BaseComponent<HTMLElement> implements SectionContainer {
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
    constructor(private pageItemConstructor: SectionContainerConstructor) {
        super('<ul class="page"></ul>');
    }

    addChild(section: Component) {
        const item = new this.pageItemConstructor(); //외부에서 전달된 constructor를 만들 수 있다. 
        item.addChild(section);
        item.attachTo(this.element, 'beforeend');
        item.setOnCloseListener(() => {
            item.removeFrom(this.element);
        }); // callback 함수 등록. 
    }
}