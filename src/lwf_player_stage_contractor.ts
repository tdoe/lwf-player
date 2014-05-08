/**
 * Created by tdoe on 5/6/14.
 */

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>

module LwfPlayer {

    export class StageContractor {

        private player:Player = null;
        private targetStage:HTMLElement = null;
        private screenStage:HTMLElement = null;
        private eventReceiveStage:HTMLElement;
        private stageScale:number = 1;
        private devicePixelRatio:number = global.devicePixelRatio;
        private debugInfo:HTMLElement = null;
        private from:number = global.performance.now();
        private currentFPS:number = 0;
        private execCount:number = 0;

        constructor(player:Player) {
            this.player = player;

            this.targetStage = this.player.getPlayerSettings().targetStage;
            if (this.targetStage === void 0 || this.targetStage === null) {
                throw new Error();
            }

            /** prepare LWF stage */
            if (this.targetStage.style.position === "static" || this.targetStage.style.position === "") {
                this.targetStage.style.position = "relative";
            }

            if (this.player.getRendererSelector().getRenderer() === RendererSelector.webkitCSSRenderer) {
                this.devicePixelRatio = 1;
            }

            /* set DPR to 2 when running  WebGLRenderer on ARROWS F-series device */
            if (this.player.getRendererSelector().getRenderer() === RendererSelector.webGLRenderer && / F-/.test(Util.ua)) {
                this.devicePixelRatio = 2;
            }
        }

        public getDevicePixelRatio():number {
            return this.devicePixelRatio;
        }

        public getStageScale():number {
            return this.stageScale;
        }

        public getScreenStage():HTMLElement {
            return this.screenStage;
        }

        public getScreenStageWidth():number {
            return +this.screenStage.getAttribute("width");
        }

        public getScreenStageHeight():number {
            return +this.screenStage.getAttribute("height");
        }

        public changeStageSize(width:number, height:number):void {
            var stageWidth = 0;
            var stageHeight = 0;

            var screenWidth = global.innerWidth;
            var screenHeight = global.innerHeight;

            var stageRatio = width / height;
            var screenRatio = screenWidth / screenHeight;

            if (Util.isAndroid) {
                /** fix innerWidth/Height for old Android devices */
                if (global.innerWidth > global.screen.width) {
                    stageWidth = global.screen.width;
                }
                if (global.innerHeight > global.screen.height) {
                    stageHeight = global.screen.height;
                }
            }

            if (width > global.innerWidth) {
                width = global.innerWidth;
            }
            if (height > global.innerHeight) {
                height = global.innerHeight;
            }

            if (this.player.getLwfSettings().fitForWidth) {
                stageWidth = Math.round(width);
                stageHeight = Math.round(width * height / width);
                this.stageScale = stageWidth / stageWidth;
            } else if (this.player.getLwfSettings().fitForHeight) {
                stageWidth = Math.round(height * width / height);
                stageHeight = Math.round(height);
                this.stageScale = stageHeight / stageHeight;
            } else {
                if (screenRatio > stageRatio) {
                    stageWidth = width * (screenHeight / height);
                    stageHeight = screenHeight;
                } else {
                    stageWidth = screenWidth;
                    stageHeight = height * (screenWidth / width);
                }
            }

            this.screenStage.style.width = this.eventReceiveStage.style.width = stageWidth + "px";
            this.screenStage.style.height = this.eventReceiveStage.style.height = stageHeight + "px";

            this.screenStage.setAttribute("width", Math.floor(stageWidth * this.devicePixelRatio) + "");
            this.screenStage.setAttribute("height", Math.floor(stageHeight * this.devicePixelRatio) + "");
            this.eventReceiveStage.setAttribute("width", Math.floor(stageWidth * this.devicePixelRatio) + "");
            this.eventReceiveStage.setAttribute("height", Math.floor(stageHeight * this.devicePixelRatio) + "");
        }

        public removeEventListeners():void {
            if (Util.isTouchEventEnabled) {
                this.eventReceiveStage.removeEventListener("touchstart", this.player.onPress, false);
                this.eventReceiveStage.removeEventListener("touchmove", this.player.onMove, false);
                this.eventReceiveStage.removeEventListener("touchend", this.player.onRelease, false);
            } else {
                this.eventReceiveStage.removeEventListener("mousedown", this.player.onPress, false);
                this.eventReceiveStage.removeEventListener("mousemove", this.player.onMove, false);
                this.eventReceiveStage.removeEventListener("mouseup", this.player.onRelease, false);
            }
        }

        public addEventListeners():void {
            if (Util.isTouchEventEnabled) {
                /** handle special behaviour of touch event on certain devices */
                if (Util.isAndroid && (Util.isChrome || / SC-0/.test(Util.ua))) {
                    document.body.addEventListener("touchstart", function () {
                    });
                }
                this.eventReceiveStage.addEventListener("touchstart", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("touchmove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("touchend", this.player.onRelease, false);
            } else {
                this.eventReceiveStage.addEventListener("mousedown", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("mousemove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("mouseup", this.player.onRelease, false);
            }
        }

        public createScreenStage(rendererSelector:RendererSelector):void {
            if (rendererSelector.getRenderer() === RendererSelector.canvasRenderer ||
                rendererSelector.getRenderer() === RendererSelector.webGLRenderer) {
                this.screenStage = document.createElement("canvas");
            } else {
                this.screenStage = document.createElement("div");
            }

            var pos = this.player.getLwfSettings().pos;

            this.screenStage.style.position = pos["position"];
            this.screenStage.style.top = pos["top"] + "px";
            this.screenStage.style.left = pos["left"] + "px";
            this.screenStage.style.zIndex = this.targetStage.style.zIndex + 1;

            /* tune opacity for SH devices using Android 2.3.5-2.3.7 with WebkitCSS Renderer */
            if (rendererSelector.getRenderer() === RendererSelector.webkitCSSRenderer &&
                /Android 2\.3\.[5-7]/.test(Util.ua) &&
                /SH/.test(Util.ua)) {
                this.screenStage.style.opacity = "0.9999";
            }

            this.targetStage.appendChild(this.screenStage);

            /** use event receiver for avoiding Galaxy S3"s translateZ bug */
            if (Util.isSp) {
                this.eventReceiveStage = document.createElement("div");
                this.eventReceiveStage.style.position = "absolute";
                this.eventReceiveStage.style.top = pos["top"] + "px";
                this.eventReceiveStage.style.left = pos["left"] + "px";
                this.eventReceiveStage.style.zIndex = this.screenStage.style.zIndex + 1;
                this.targetStage.appendChild(this.eventReceiveStage);
            } else {
                this.eventReceiveStage = this.targetStage;
            }
        }

        public viewDebugInfo():void {
            if (this.debugInfo === null) {
                this.debugInfo = document.createElement("div");
                this.debugInfo.style.position = "absolute";
                this.debugInfo.style.top = "0px";
                this.debugInfo.style.left = "0px";
                this.debugInfo.style.zIndex = "9999";
                this.debugInfo.style.color = "red";
                this.debugInfo.className = "lwfPlayerDebugInfo";
                this.targetStage.appendChild(this.debugInfo);
            }

            if (this.execCount % 60 === 0) {
                var _time = global.performance.now();

                this.currentFPS = Math.round(60000.0 / (_time - this.from));
                this.from = _time;
                this.execCount = 0;
            }

            var x = this.player.getCoordinator().getX();
            var y = this.player.getCoordinator().getY();
            this.execCount++;
            this.debugInfo.innerHTML = this.player.getRendererSelector().getRenderer() +
                " " + this.currentFPS + "fps " + "X:" + x + " Y:" + y;
        }
    }
}
