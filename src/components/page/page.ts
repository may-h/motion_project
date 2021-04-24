import { BaseComponent, Component } from "../component.js";

export interface Composable {
  addChild(child: Component): void;
}

// 닫혔는지 알려주기만 하는 리스너..
type OnCloseListener = () => void;
type DragState = "start" | "stop" | "enter" | "leave";
type OnDragStateListener<T extends Component> = (
  target: T,
  state: DragState
) => void;

// 각각 세션을 감살 수 있는 컨테이너는 무조건 컴포넌트와 굼포져브블을 구현해야하고, 추가적으로 setOnCloseListener 구현해야 한다.
interface SectionContainer extends Component, Composable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: "mute" | "unmute"): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

// Component>attachTo는 BaseComponent에서 구현되어 있고, Composable+setOnCloseListener는 PageItemComponent에 구현되어 있다.
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer {
  // 외부로부터 전달받은 callback함수를 저장하고 있을 곳
  private closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

  constructor() {
    super(`<li draggable="true" class="page-item">
                <section class="page-item__body"></section>
                <div class="page-item__controls">
                    <button class="close" onClick="alert('hello')">&times;</button>
                </div>
              </li>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };

    this.element.addEventListener("dragstart", (event: DragEvent) => {
      this.onDragStart(event);
    });

    this.element.addEventListener("dragend", (event: DragEvent) => {
      this.onDragEnd(event);
    });

    this.element.addEventListener("dragenter", (event: DragEvent) => {
      this.onDragEnter(event);
    });

    this.element.addEventListener("dragleave", (event: DragEvent) => {
      this.onDragLeave(event);
    });
  }

  onDragStart(_: DragEvent) {
    this.notifyDragObservers("start");
    this.element.classList.add("lifted");
  }

  onDragEnd(_: DragEvent) {
    this.notifyDragObservers("stop");
    this.element.classList.remove("lifted");
  }

  onDragEnter(_: DragEvent) {
    this.notifyDragObservers("enter");
    this.element.classList.add("drop-area");
  }

  onDragLeave(_: DragEvent) {
    this.notifyDragObservers("leave");
    this.element.classList.remove("drop-area");
  }

  onDropped() {
    this.element.classList.remove("drop-area");
  }

  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }

  addChild(child: Component) {
    const container = this.element.querySelector(
      ".page-item__body"
    )! as HTMLElement;
    child.attachTo(container);
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }

  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }

  muteChildren(state: "mute" | "unmute") {
    if (state === "mute") {
      this.element.classList.add("mute-children");
    } else {
      this.element.classList.remove("mute-children");
    }
  }

  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable {
  private children = new Set<SectionContainer>();
  private dragTaget?: SectionContainer;
  private dropTaget?: SectionContainer;
  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super('<ul class="page"></ul>');
    this.element.addEventListener("dragover", (event: DragEvent) => {
      this.onDrageOver(event);
    });
    this.element.addEventListener("drop", (event: DragEvent) => {
      this.onDrop(event);
    });
  }

  onDrageOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    // 여기에서 위치를 바꿔줍니다.
    if (!this.dropTaget) {
      return;
    }

    if (this.dragTaget && this.dragTaget !== this.dropTaget) {
      const dropY = event.clientY;
      const srcElement = this.dragTaget.getBoundingRect();
      this.dragTaget.removeFrom(this.element);
      this.dropTaget.attach(
        this.dragTaget,
        dropY < srcElement.y ? "beforebegin" : "afterend"
      );
    }
    this.dropTaget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor(); //외부에서 전달된 constructor를 만들 수 있다.
    item.addChild(section);
    item.attachTo(this.element, "beforeend");
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    }); // callback 함수 등록.
    this.children.add(item);

    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case "start":
            this.dragTaget = target;
            this.updateSections("mute");
            break;
          case "stop":
            this.dragTaget = undefined;
            this.updateSections("unmute");
            break;
          case "enter":
            this.dropTaget = target;
            break;
          case "leave":
            this.dropTaget = undefined;
            break;
          default:
            throw new Error(`unsupported state : ${state}`);
        }
      }
    );
  }
  private updateSections(state: "mute" | "unmute") {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
