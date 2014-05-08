/**
 * Created by tdoe on 5/4/14.
 */

/// <reference path="lwf_player_util.ts"/>

module LwfPlayer {

    "use strict";

    export class RendererSelector {

        public static webkitCSSRenderer:string = "useWebkitCSSRenderer";
        public static webGLRenderer:string = "useWebGLRenderer";
        public static canvasRenderer:string = "useCanvasRenderer";

        public static rendererWebkitCSS:string = "webkitcss";
        public static rendererWebGL:string = "webgl";
        public static rendererCanvas:string = "canvas";

        private renderer:string;

        constructor() {
            this.autoSelectRenderer();
        }

        public getRenderer():string {
            return this.renderer;
        }

        public setRenderer(rendererName:string):void {
            this.renderer = RendererSelector.canvasRenderer;

            if (rendererName === RendererSelector.rendererWebkitCSS) {
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (rendererName === RendererSelector.rendererWebGL) {
                this.renderer = RendererSelector.webGLRenderer;
            }
        }

        private autoSelectRenderer():void {
            /** detects if current environment is WebGL capable*/
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            var contextNames:string[] = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];

            for (var i = 0; i < contextNames.length; i++) {
                if (canvas.getContext(contextNames[i])) {
                    this.renderer = RendererSelector.webGLRenderer;
                    return;
                }
            }

            /** iOS 4 devices should use CSS renderer due to spec issue */
            if (/iP(ad|hone|od).*OS 4/.test(Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
                return;
            }

            /** Android 2.1 does not work with Canvas, force to use CSS renderer */
            /** Android 2.3.5 or higher 2.3 versions does not work properly on canvas */
            if (/Android 2\.1/.test(Util.ua) || /Android 2\.3\.[5-7]/.test(Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
                return;
            }

            /** Android 4.x devices are recommended to run with CSS renderer except for Chrome*/
            if (/Android 4/.test(Util.ua)) {
                if (/Chrome/.test(Util.ua)) {
                    this.renderer = RendererSelector.canvasRenderer;
                    return;
                } else {
                    this.renderer = RendererSelector.webkitCSSRenderer;
                    return;
                }
            }

            this.renderer = RendererSelector.canvasRenderer;
        }
    }
}
