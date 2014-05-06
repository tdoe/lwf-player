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
        private useWebGL:boolean = false;

        constructor() {
            this.renderer = this.autoSelectRenderer_();
        }

        public getDevicePixelRatio() {
            var devicePixelRatio = window.devicePixelRatio;

            if (this.renderer === RendererSelector.webkitCSSRenderer) {
                devicePixelRatio = 1;
            }

            /* set DPR to 2 when running  WebGLRenderer on ARROWS F-series device */
            if (this.renderer === RendererSelector.webGLRenderer && / F-/.test(Util.ua)) {
                devicePixelRatio = 2;
            }

            return devicePixelRatio;
        }

        /**
         * return the current renderer name in string, null if undefined
         * @return {string} current renderer being used
         */
        public getRenderer() {
            return this.renderer;
        }

        public setRenderer(rendererName:string) {

            this.renderer = RendererSelector.canvasRenderer;

            if (rendererName === RendererSelector.rendererWebkitCSS) {
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (rendererName === RendererSelector.rendererWebGL) {
                this.renderer = RendererSelector.webGLRenderer;
            }
        }

        private autoSelectRenderer_():string {
            var userAgent:string = LwfPlayer.Util.ua;
            if (this.useWebGL) {
                /** detects if current environment is WebGL capable*/
                var canvas:HTMLCanvasElement = document.createElement("canvas");
                var contextNames:string[] = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
                var ctx:string;

                for (var i = 0; i < contextNames.length; i++) {
                    ctx = canvas.getContext(contextNames[i]);
                    if (ctx) {
                        return RendererSelector.webGLRenderer;
                    }
                }
            }

            /** iOS 4 devices should use CSS renderer due to spec issue */
            if (/iP(ad|hone|od).*OS 4/.test(userAgent)) {
                return RendererSelector.webkitCSSRenderer;
            }

            /** Android 2.1 does not work with Canvas, force to use CSS renderer */
            /** Android 2.3.5 or higher 2.3 versions does not work properly on canvas */
            if (/Android 2\.1/.test(userAgent) || /Android 2\.3\.[5-7]/.test(userAgent)) {
                return RendererSelector.webkitCSSRenderer;
            }

            /** Android 4.x devices are recommended to run with CSS renderer except for Chrome*/
            if (/Android 4/.test(userAgent)) {
                if (/Chrome/.test(userAgent)) {
                    return RendererSelector.canvasRenderer;
                } else {
                    return RendererSelector.webkitCSSRenderer;
                }
            }

            return RendererSelector.canvasRenderer;
        }
    }
}
