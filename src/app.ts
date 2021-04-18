import { Component } from "./components/components.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { Composable, PageComponent, PageItemComponent } from "./components/page/page.js";

class App {
    //Component 중 하나이고 Composable 가능한(addchild) 요소
    private readonly page: Component & Composable;  
    constructor(appRoot: HTMLElement) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);

        const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        this.page.addChild(image); //appRoot에 추가하는 것이 아니라, page의 addChild를 사용한다. 

        const video = new VideoComponent("Video Title", "https://youtu.be/SLD9xzJ4oeU");
        this.page.addChild(video);

        const note = new NoteComponent("Note Title", "This is my first Note");
        this.page.addChild(note);

        const todo = new TodoComponent("Todo Title", "Todo List 1");
        this.page.addChild(todo);
    }
}

new App(document.querySelector('.document')! as HTMLElement);
