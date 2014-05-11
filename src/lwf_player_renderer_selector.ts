/**
 * Created by tdoe on 5/4/14.
 *
 * This class handling for LWF-Renderer choice.
 * will be cross-browser countermeasure.
 */

    /// <reference path="lwf_player_util.ts"/>

module LwfPlayer {

    "use strict";

    export class RendererSelector {

        public static webkitCSSRenderer:string = "useWebkitCSSRenderer";
        public static webGLRenderer:string = "useWebGLRenderer";
        public static canvasRenderer:string = "useCanvasRenderer";

        private renderer:string;

        constructor() {
            this.autoSelectRenderer();
        }

        /**
         * get current renderer
         *
         * @returns {string}
         */
        public getRenderer():string {
            return this.renderer;
        }

        /**
         * set renderer name.
         * can use it only three types.
         * auto-select the optimal renderer set after.
         *
         * @param rendererName
         */
        public setRenderer(rendererName:string):void {
            switch (rendererName) {
                case RendererSelector.canvasRenderer:
                case RendererSelector.webkitCSSRenderer:
                case RendererSelector.webGLRenderer:
                    this.renderer = rendererName;
                    break;
                default :
                    throw new Error("unsupported renderer:" + rendererName);
            }
            this.autoSelectRenderer();
        }

        /**
         * detects if current environment is WebGL capable.
         * auto-select the optimal renderer set after.
         * use canvas-renderer when set renderer nothing.
         */
        private autoSelectRenderer():void {
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            var contextNames:string[] = ["webgl", "experimental-webgl"];

            for (var i = 0; i < contextNames.length; i++) {
                if (canvas.getContext(contextNames[i])) {
                    this.renderer = RendererSelector.webGLRenderer;
                    break;
                }
            }

            /** iOS 4 devices should use CSS renderer due to spec issue */
            if (/iP(ad|hone|od).*OS 4/.test(Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (/Android 2\.1/.test(Util.ua) || /Android 2\.3\.[5-7]/.test(Util.ua)) {
                /** Android 2.1 does not work with Canvas, force to use CSS renderer */
                /** Android 2.3.5 or higher 2.3 versions does not work properly on canvas */
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (/Android 4/.test(Util.ua)) {
                /** Android 4.x devices are recommended to run with CSS renderer except for Chrome*/
                if (/Chrome/.test(Util.ua)) {
                    this.renderer = RendererSelector.canvasRenderer;
                } else {
                    this.renderer = RendererSelector.webkitCSSRenderer;
                }
            }

            if (this.renderer === void 0 || this.renderer === null) {
                this.renderer = RendererSelector.canvasRenderer;
            }
        }
    }
}
