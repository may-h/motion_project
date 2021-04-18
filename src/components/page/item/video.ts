import { BaseComponent } from "../../components.js";

export class VideoComponent extends BaseComponent<HTMLElement> {

    constructor(title: string, url: string) {
        super(`<section class="video">
                    <div class="video__player"> 
                        <iframe class="vidoe__iframe" width="600" height="400" frameborder="0" controls autoplay></iframe>
                    </div> 
                    <h2 class="video__title"></h2>       
                </section>`);
        const videoElement = this.element.querySelector(".vidoe__iframe")! as HTMLIFrameElement;
        videoElement.src = this.convertToEmbeddedURL(url); //embed용 url로 변환
        videoElement.title = title;
        
        const titleElement = this.element.querySelector(".video__title")! as HTMLHeadElement;
        titleElement.textContent = title;
    }

    // 정규표현식(Regex)을 사용해서 ID 가져오는 함수
    /*
        https://youtu.be/SLD9xzJ4oeU
        https://youtu.be/SLD9xzJ4oeU?t=15
    */
    private convertToEmbeddedURL(url: string): string {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
        const match = url.match(regExp); // 매칭되는 것이 있다면 배열로 반환함. 
        
        const videoId = match ? match[1] || match[2] : undefined;
        if(videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        
        return url;
    }
}