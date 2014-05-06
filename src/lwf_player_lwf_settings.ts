/**
 * Created by tdoe on 5/5/14.
 */

module LwfPlayer {
    "use strict";

    export class LwfSettings {
        public active:boolean;

        public buttonEventMap:Object;

        public callback:Object;

        public error:any;
        public execLimit:Object;

        public fitForHeight:boolean;
        public fitForWidth:boolean;
        public fsCommandMap:any;

        public handler:any;

        public imageMap:any;
        public imageQueryString:string;
        public imagePrefix:string;
        public imageSuffix:string;

        public js:any;

        public loadedCount:number;
        public lwf:string;
        public lwfMap:any;
        public lwfUrl:string;

        public name:string;
        public needsClear:any;

        public onload:Function;
        public onprogress:Function;

        public pageTransitionMap:any;
        public parentLWF:Object;
        public pos:Object;
        public preferredFrameRate:Object;
        public prefix:string;
        public privateData:Object;

        public quirkyClearRect:any;

        public recycleTextCanvas:any;

        public setBackgroundColor:any;
        public soundMap:any;
        public stage:HTMLElement;

        public textInSubpixel:any;
        public total:any;

        public use3D:any;
        public useBackgroundColor:boolean;
        public useVertexColor:boolean;

        public worker:boolean;
    }
}
