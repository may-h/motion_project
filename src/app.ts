import { Component } from "./components/component.js";
import { InputDialog } from "./components/dialog/dialog.js";
import { MediaSectionInput } from "./components/dialog/input/media-input.js";
import { TextSectionInput } from "./components/dialog/input/text-input.js";
import { ImageComponent } from "./components/page/item/image.js";
import { NoteComponent } from "./components/page/item/note.js";
import { TodoComponent } from "./components/page/item/todo.js";
import { VideoComponent } from "./components/page/item/video.js";
import { Composable, PageComponent, PageItemComponent } from "./components/page/page.js";

class App {
    //Component 중 하나이고 Composable 가능한(addchild) 요소
    private readonly page: Component & Composable;  
    constructor(appRoot: HTMLElement, dialogRoot: HTMLElement) {
        this.page = new PageComponent(PageItemComponent);
        this.page.attachTo(appRoot);

        // const image = new ImageComponent('Image Title', 'https://picsum.photos/600/300');
        // this.page.addChild(image); //appRoot에 추가하는 것이 아니라, page의 addChild를 사용한다. 

        // const video = new VideoComponent("Video Title", "https://youtu.be/SLD9xzJ4oeU");
        // this.page.addChild(video);

        // const note = new NoteComponent("Note Title", "This is my first Note");
        // this.page.addChild(note);

        // const todo = new TodoComponent("Todo Title", "Todo List 1");
        // this.page.addChild(todo);


        // menu button 
        const imageBtn = document.querySelector("#new-image")! as HTMLButtonElement;
        imageBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new MediaSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListner(() => {
                dialog.removeFrom(dialogRoot);
            });

            dialog.setOnSubmitListner(() => {
                //섹션을 만들어서 페이지에 추가해준다. 
                const image = new ImageComponent(inputSection.title, inputSection.url);
                this.page.addChild(image);
                dialog.removeFrom(dialogRoot);
            })
        });


        const videoBtn = document.querySelector("#new-video")! as HTMLButtonElement;
        videoBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new MediaSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListner(() => {
                dialog.removeFrom(dialogRoot);
            });

            dialog.setOnSubmitListner(() => {
                //섹션을 만들어서 페이지에 추가해준다. 
                const video = new VideoComponent(inputSection.title, inputSection.url);
                this.page.addChild(video);
                dialog.removeFrom(dialogRoot);
            })
        });


        const noteBtn = document.querySelector("#new-note")! as HTMLButtonElement;
        noteBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new TextSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListner(() => {
                dialog.removeFrom(dialogRoot);
            });

            dialog.setOnSubmitListner(() => {
                //섹션을 만들어서 페이지에 추가해준다. 
                const note = new NoteComponent(inputSection.title, inputSection.body);
                this.page.addChild(note);
                dialog.removeFrom(dialogRoot);
            })
        });

        const todoBtn = document.querySelector("#new-todo")! as HTMLButtonElement;
        todoBtn.addEventListener("click", () => {
            const dialog = new InputDialog();
            const inputSection = new TextSectionInput();
            dialog.addChild(inputSection);
            dialog.attachTo(dialogRoot);

            dialog.setOnCloseListner(() => {
                dialog.removeFrom(dialogRoot);
            });

            dialog.setOnSubmitListner(() => {
                //섹션을 만들어서 페이지에 추가해준다. 
                const todo = new TodoComponent(inputSection.title, inputSection.body);
                this.page.addChild(todo);
                dialog.removeFrom(dialogRoot);
            })
        });

    }
}

new App(document.querySelector('.document')! as HTMLElement, document.body);
