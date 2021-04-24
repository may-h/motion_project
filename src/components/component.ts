export interface Component {
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void; // 부모 컴포넌트로부터 자신을 삭제
  attach(component: Component, position?: InsertPosition): void;
}

/**
 * Encapsulate the HTML element creation
 * 이런 BaseComponent를 이리저리로 쓰는 것보다 interface를 사용하는 것이 좋다..
 */

export class BaseComponent<T extends HTMLElement> implements Component {
  // 1. 여러 타입을 사용할 수 있게, 제네릭 사용 (모든 타입은 안되고 HTMLElement 상속된 타입만 가능하도록 선언 )
  // 2. 상속받은 자식 클래스에서만 접근할 수 있도록 protected 접근자 사용
  // 3. 한번 선언된 값은 바뀌지 않도록 readonly
  protected readonly element: T;

  constructor(htmlString: string) {
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }

  attachTo(parent: HTMLElement, position: InsertPosition = "afterbegin") {
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent: HTMLElement) {
    if (parent !== this.element.parentElement) {
      //부모가 맞는지 확인
      throw new Error("Parent mismatch!");
    }
    parent.removeChild(this.element);
  }

  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }
}
