/**
 * Created by tdoe on 5/6/14.
 *
 * This class is for LWF animation rendering element operation.
 */

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {

    "use strict";

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
        private stageWidth = 0;
        private stageHeight = 0;
        private stageStyleWidth = 0;
        private stageStyleHeight = 0;

        /**
         * this class is need Player instance.
         *
         * @param player
         */
        constructor(player:Player) {
            this.player = player;

            this.targetStage = this.player.getPlayerSettings().targetStage;

            // prepare LWF stage
            if (this.targetStage.style.position === "static" || Util.isEmpty(this.targetStage.style.position)) {
                this.targetStage.style.position = "relative";
            }

            if (this.player.getRendererSelector().getRenderer() === RendererSelector.webkitCSSRenderer) {
                this.devicePixelRatio = 1;
            }

            /* set DPR to 2 when running  WebGLRenderer on ARROWS F-series device */
            if (this.player.getRendererSelector().getRenderer() === RendererSelector.webGLRenderer && / F-/.test(Util.ua)) {
                this.devicePixelRatio = 2;
            }

            if (Util.isEmpty(this.devicePixelRatio)) {
                this.devicePixelRatio = 1;
            }
        }

        /**
         * get devicePixelRatio.
         *
         * @returns {number}
         */
        public getDevicePixelRatio():number {
            return this.devicePixelRatio;
        }

        /**
         * get screen stage scale.
         *
         * @returns {number}
         */
        public getStageScale():number {
            return this.stageScale;
        }

        /**
         * get screen stage element.
         *
         * @returns {HTMLElement}
         */
        public getScreenStage():HTMLElement {
            return this.screenStage;
        }

        /**
         * get screen width by number convert string.
         *
         * @returns {number}
         */
        public getScreenStageWidth():number {
            return +this.screenStage.getAttribute("width");
        }

        /**
         * get screen height by number convert string.
         *
         * @returns {number}
         */
        public getScreenStageHeight():number {
            return +this.screenStage.getAttribute("height");
        }

        /**
         * calculation to set stage size.
         * stage size is passed to LWF
         *
         * @param width  LWF width
         * @param height LWF height
         */
        public changeStageSize(width:number, height:number):void {
            var screenWidth = Util.getStageWidth();
            var screenHeight = Util.getStageHeight();

            if (width > screenWidth) {
                width = screenWidth;
            }
            if (height > screenHeight) {
                height = screenHeight;
            }

            if (this.player.getLwfSettings().fitForWidth) {
                this.fitForWidth(width, height);
            } else if (this.player.getLwfSettings().fitForHeight) {
                this.fitForHeight(width, height);
            } else {
                this.fitToScreen(width, height);
            }

            this.screenStage.style.width = this.eventReceiveStage.style.width = this.stageStyleWidth + "px";
            this.screenStage.style.height = this.eventReceiveStage.style.height = this.stageStyleHeight + "px";

            this.screenStage.setAttribute("width", this.stageWidth + "");
            this.screenStage.setAttribute("height", this.stageHeight + "");
        }

        /**
         * calc stage size by LWF size.
         * For fit to LWF width.
         *
         * @param lwfWidth
         * @param lwfHeight
         */
        private fitForWidth(lwfWidth:number, lwfHeight:number) {
            this.stageStyleWidth = Math.round(lwfWidth);
            this.stageStyleHeight = Math.round(lwfWidth * lwfHeight / lwfWidth);
            this.setStageWidthAndHeight();
            this.stageScale = this.stageStyleWidth / this.stageWidth;
        }

        /**
         * calc stage size by LWF size.
         * For fit to LWF height.
         *
         * @param lwfWidth
         * @param lwfHeight
         */
        private fitForHeight(lwfWidth:number, lwfHeight:number) {
            this.stageStyleWidth = Math.round(lwfHeight * lwfWidth / lwfHeight);
            this.stageStyleHeight = Math.round(lwfHeight);
            this.setStageWidthAndHeight();
            this.stageScale = this.stageStyleHeight / this.stageHeight;
        }

        /**
         * calc stage size by screen-size.
         * For full screen LWF display.
         *
         * @param lwfWidth
         * @param lwfHeight
         */
        private fitToScreen(lwfWidth:number, lwfHeight:number) {
            var screenWidth = Util.getStageWidth();
            var screenHeight = Util.getStageHeight();

            var stageRatio = lwfWidth / lwfHeight;
            var screenRatio = screenWidth / screenHeight;

            if (screenRatio > stageRatio) {
                this.stageStyleWidth = lwfWidth * (screenHeight / lwfHeight);
                this.stageStyleHeight = screenHeight;
                this.setStageWidthAndHeight();
                this.stageScale = this.stageStyleWidth / this.stageWidth;
            } else {
                this.stageStyleWidth = screenWidth;
                this.stageStyleHeight = lwfHeight * (screenWidth / lwfWidth);
                this.setStageWidthAndHeight();
                this.stageScale = this.stageStyleHeight / this.stageHeight;
            }
        }

        /**
         * screen stage size * devicePixelRatio for High-definition screen
         */
        private setStageWidthAndHeight() {
            this.stageWidth = Math.floor(this.stageStyleWidth * this.devicePixelRatio);
            this.stageHeight = Math.floor(this.stageStyleHeight * this.devicePixelRatio);
        }

        /**
         * remove event listeners
         * call before LWF play.
         */
        public addEventListeners():void {
            if (Util.isTouchEventEnabled) {
                this.eventReceiveStage.addEventListener("touchmove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("touchstart", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("touchend", this.player.onRelease, false);
            } else {
                this.eventReceiveStage.addEventListener("mousedown", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("mousemove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("mouseup", this.player.onRelease, false);
            }
        }

        /**
         * remove event listeners
         * call when LWF destroy.
         */
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

        /**
         * create LWF animation rendering element.
         * @param rendererSelector
         */
        public createScreenStage(rendererSelector:RendererSelector):void {
            if (rendererSelector.getRenderer() === RendererSelector.canvasRenderer ||
                rendererSelector.getRenderer() === RendererSelector.webGLRenderer) {
                this.screenStage = document.createElement("canvas");
            } else {
                this.screenStage = document.createElement("div");
            }

            var pos = this.player.getLwfSettings().pos;
            if (Util.isEmpty(pos)) {
                this.player.getLwfSettings().initPos();
                pos = this.player.getLwfSettings().pos;
            }

            this.screenStage.style.position = pos["position"];
            this.screenStage.style.top = pos["top"] + "px";
            this.screenStage.style.left = pos["left"] + "px";
            this.screenStage.style.zIndex = this.targetStage.style.zIndex + 1;
            this.screenStage.style.opacity = Util.getOpacity(rendererSelector.getRenderer());

            this.targetStage.appendChild(this.screenStage);
        }

        /**
         * create mouse or touch event receive element.
         */
        public createEventReceiveStage():void {
            var pos = this.player.getLwfSettings().pos;

            this.eventReceiveStage = document.createElement("div");
            this.eventReceiveStage.style.position = "absolute";
            this.eventReceiveStage.style.top = pos["top"] + "px";
            this.eventReceiveStage.style.left = pos["left"] + "px";
            this.eventReceiveStage.style.zIndex = this.screenStage.style.zIndex + 1;
            this.targetStage.appendChild(this.eventReceiveStage);
        }

        /**
         * Display debug information.
         */
        public viewDebugInfo():void {
            if (Util.isEmpty(this.debugInfo)) {
                this.debugInfo = document.createElement("div");
                this.debugInfo.style.position = "absolute";
                this.debugInfo.style.top = "0px";
                this.debugInfo.style.left = "0px";
                this.debugInfo.style.zIndex = "9999";
                this.debugInfo.style.color = "red";
                this.debugInfo.id = "__lwfPlayerDebugInfoID";
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
            var renderer = this.player.getRendererSelector().getRenderer().substring(3);
            renderer = renderer.substring(0, renderer.lastIndexOf("Renderer"));
            this.execCount++;
            this.debugInfo.innerHTML = renderer + " " + this.currentFPS + "fps " + "X:" + x + " Y:" + y + "<br>" +
                "sw:" + this.stageStyleWidth + " sh:" + this.stageStyleHeight +
                " w:" + this.stageWidth + " h:" + this.stageHeight + " s:" + this.stageScale + " dpr:" + this.getDevicePixelRatio();
        }
    }
}
