/**
 * Created by tdoe on 5/4/14.
 *
 * This class handling for LWF-Renderer choice.
 * will be cross-browser countermeasure.
 */

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_renderer_name.ts"/>

module LwfPlayer {

    "use strict";

    export class RendererSelector {

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
         * @param playerSettings
         */
        public setRenderer(playerSettings:PlayerSettings):void {
            if (Util.isEmpty(playerSettings.renderer)) {
                this.autoSelectRenderer();
                return;
            }

            switch (playerSettings.renderer) {
                case RendererName[RendererName.useCanvasRenderer]:
                case RendererName[RendererName.useWebkitCSSRenderer]:
                case RendererName[RendererName.useWebGLRenderer]:
                    this.renderer = playerSettings.renderer;
                    break;
                default :
                    throw new Error("unsupported renderer:" + playerSettings.renderer);
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
                    this.renderer = RendererName[RendererName.useWebGLRenderer];
                    break;
                }
            }

            /** iOS 4 devices should use CSS renderer due to spec issue */
            if (/iP(ad|hone|od).*OS 4/.test(Util.ua)) {
                this.renderer = RendererName[RendererName.useWebkitCSSRenderer];
            } else if (/Android 2\.1/.test(Util.ua) || /Android 2\.3\.[5-7]/.test(Util.ua)) {
                /** Android 2.1 does not work with Canvas, force to use CSS renderer */
                /** Android 2.3.5 or higher 2.3 versions does not work properly on canvas */
                this.renderer = RendererName[RendererName.useWebkitCSSRenderer];
            } else if (/Android 4/.test(Util.ua)) {
                /** Android 4.x devices are recommended to run with CSS renderer except for Chrome*/
                if (/Chrome/.test(Util.ua)) {
                    this.renderer = RendererName[RendererName.useCanvasRenderer];
                } else {
                    this.renderer = RendererName[RendererName.useWebkitCSSRenderer];
                }
            }

            if (Util.isEmpty(this.renderer)) {
                this.renderer = RendererName[RendererName.useCanvasRenderer];
            }
        }
    }
}
