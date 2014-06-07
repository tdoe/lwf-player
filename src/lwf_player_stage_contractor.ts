/// <reference path="lwf_player_renderer_name.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>

declare var global:any; // window or worker assigned by LWF

/**
 * Created by tdoe on 5/6/14.
 *
 * This class is for LWF animation rendering element operation.
 */
module LwfPlayer {

    "use strict";

    /**
     * @type {LwfPlayer.StageContractor}
     * @const
     */
    export class StageContractor {

        private _player:Player = null;
        private _targetStage:HTMLElement = null;
        private _screenStage:HTMLElement = null;
        private _eventReceiveStage:HTMLElement;
        private _stageScale:number = 1;
        private _devicePixelRatio:number = global._devicePixelRatio;
        private _debugInfo:HTMLElement = null;
        private _from:number = global.performance.now();
        private _currentFPS:number = 0;
        private _execCount:number = 0;
        private _stageWidth = 0;
        private _stageHeight = 0;
        private _stageStyleWidth = 0;
        private _stageStyleHeight = 0;

        /**
         * this class is need Player instance.
         *
         * @param player
         */
        constructor(player:Player) {
            this._player = player;

            this._targetStage = this._player.playerSettings.targetStage;

            // prepare LWF stage
            if (this._targetStage.style.position === "static" || Util.isEmpty(this._targetStage.style.position)) {
                this._targetStage.style.position = "relative";
            }

            if (this._player.rendererSelector.renderer === RendererName[RendererName.useWebkitCSSRenderer]) {
                this._devicePixelRatio = 1;
            }

            /* set DPR to 2 when running  WebGLRenderer on ARROWS F-series device */
            if (this._player.rendererSelector.renderer === RendererName[RendererName.useWebGLRenderer] && / F-/.test(Util.ua)) {
                this._devicePixelRatio = 2;
            }

            if (Util.isEmpty(this._devicePixelRatio)) {
                this._devicePixelRatio = 1;
            }
        }

        /**
         * get devicePixelRatio.
         *
         * @returns {number}
         */
        public get devicePixelRatio():number {
            return this._devicePixelRatio;
        }

        /**
         * get screen stage scale.
         *
         * @returns {number}
         */
        public get stageScale():number {
            return this._stageScale;
        }

        /**
         * get screen stage element.
         *
         * @returns {HTMLElement}
         */
        public get screenStage():HTMLElement {
            return this._screenStage;
        }

        /**
         * get screen width by number convert string.
         *
         * @returns {number}
         */
        public get screenStageWidth():number {
            return +this._screenStage.getAttribute("width");
        }

        /**
         * get screen height by number convert string.
         *
         * @returns {number}
         */
        public get screenStageHeight():number {
            return +this._screenStage.getAttribute("height");
        }

        /**
         * calculation to set stage size.
         * stage size is passed to LWF
         *
         * @param width  LWF width
         * @param height LWF height
         */
        public changeStageSize = (width:number, height:number):void => {
            var screenWidth = Util.getStageWidth();
            var screenHeight = Util.getStageHeight();

            if (width > screenWidth) {
                width = screenWidth;
            }
            if (height > screenHeight) {
                height = screenHeight;
            }

            if (this._player.lwfSettings.fitForWidth) {
                this.fitForWidth(width, height);
            } else if (this._player.lwfSettings.fitForHeight) {
                this.fitForHeight(width, height);
            } else {
                this.fitToScreen(width, height);
            }

            this._screenStage.style.width = this._eventReceiveStage.style.width = this._stageStyleWidth + "px";
            this._screenStage.style.height = this._eventReceiveStage.style.height = this._stageStyleHeight + "px";

            this._screenStage.setAttribute("width", this._stageWidth + "");
            this._screenStage.setAttribute("height", this._stageHeight + "");
        };

        /**
         * calc stage size by LWF size.
         * For fit to LWF width.
         *
         * @param lwfWidth
         * @param lwfHeight
         */
        private fitForWidth = (lwfWidth:number, lwfHeight:number) => {
            this._stageStyleWidth = Math.round(lwfWidth);
            this._stageStyleHeight = Math.round(lwfWidth * lwfHeight / lwfWidth);
            this.setStageWidthAndHeight();
            this._stageScale = this._stageStyleWidth / this._stageWidth;
        };

        /**
         * calc stage size by LWF size.
         * For fit to LWF height.
         *
         * @param lwfWidth
         * @param lwfHeight
         */
        private fitForHeight = (lwfWidth:number, lwfHeight:number) => {
            this._stageStyleWidth = Math.round(lwfHeight * lwfWidth / lwfHeight);
            this._stageStyleHeight = Math.round(lwfHeight);
            this.setStageWidthAndHeight();
            this._stageScale = this._stageStyleHeight / this._stageHeight;
        };

        /**
         * calc stage size by screen-size.
         * For full screen LWF display.
         *
         * @param lwfWidth
         * @param lwfHeight
         */
        private fitToScreen = (lwfWidth:number, lwfHeight:number) => {
            var screenWidth = Util.getStageWidth();
            var screenHeight = Util.getStageHeight();

            var stageRatio = lwfWidth / lwfHeight;
            var screenRatio = screenWidth / screenHeight;

            if (screenRatio > stageRatio) {
                this._stageStyleWidth = lwfWidth * (screenHeight / lwfHeight);
                this._stageStyleHeight = screenHeight;
                this.setStageWidthAndHeight();
                this._stageScale = this._stageStyleWidth / this._stageWidth;
            } else {
                this._stageStyleWidth = screenWidth;
                this._stageStyleHeight = lwfHeight * (screenWidth / lwfWidth);
                this.setStageWidthAndHeight();
                this._stageScale = this._stageStyleHeight / this._stageHeight;
            }
        };

        /**
         * screen stage size * devicePixelRatio for High-definition screen
         */
        private setStageWidthAndHeight = () => {
            this._stageWidth = Math.floor(this._stageStyleWidth * this._devicePixelRatio);
            this._stageHeight = Math.floor(this._stageStyleHeight * this._devicePixelRatio);
        };

        /**
         * remove event listeners
         * call before LWF play.
         */
        public addEventListeners = ():void => {
            if (Util.isTouchEventEnabled) {
                this._eventReceiveStage.addEventListener("touchmove", this._player.onMove, false);
                this._eventReceiveStage.addEventListener("touchstart", this._player.onPress, false);
                this._eventReceiveStage.addEventListener("touchend", this._player.onRelease, false);
            } else {
                this._eventReceiveStage.addEventListener("mousedown", this._player.onPress, false);
                this._eventReceiveStage.addEventListener("mousemove", this._player.onMove, false);
                this._eventReceiveStage.addEventListener("mouseup", this._player.onRelease, false);
            }
        };

        /**
         * remove event listeners
         * call when LWF destroy.
         */
        public removeEventListeners = ():void => {
            if (Util.isTouchEventEnabled) {
                this._eventReceiveStage.removeEventListener("touchstart", this._player.onPress, false);
                this._eventReceiveStage.removeEventListener("touchmove", this._player.onMove, false);
                this._eventReceiveStage.removeEventListener("touchend", this._player.onRelease, false);
            } else {
                this._eventReceiveStage.removeEventListener("mousedown", this._player.onPress, false);
                this._eventReceiveStage.removeEventListener("mousemove", this._player.onMove, false);
                this._eventReceiveStage.removeEventListener("mouseup", this._player.onRelease, false);
            }
        };

        /**
         * create LWF animation rendering element.
         * @param rendererSelector
         */
        public createScreenStage = (rendererSelector:RendererSelector):void => {
            if (rendererSelector.renderer === RendererName[RendererName.useCanvasRenderer] ||
                rendererSelector.renderer === RendererName[RendererName.useWebGLRenderer]) {
                this._screenStage = document.createElement("canvas");
            } else {
                this._screenStage = document.createElement("div");
            }

            var pos = this._player.lwfSettings.pos;
            if (Util.isEmpty(pos)) {
                this._player.lwfSettings.initPos();
                pos = this._player.lwfSettings.pos;
            }

            this._screenStage.style.position = pos["position"];
            this._screenStage.style.top = pos["top"] + "px";
            this._screenStage.style.left = pos["left"] + "px";
            this._screenStage.style.zIndex = this._targetStage.style.zIndex + 1;
            this._screenStage.style.opacity = Util.getOpacity(rendererSelector.renderer);

            this._targetStage.appendChild(this._screenStage);
        };

        /**
         * create mouse or touch event receive element.
         */
        public createEventReceiveStage = ():void => {
            var pos = this._player.lwfSettings.pos;

            this._eventReceiveStage = document.createElement("div");
            this._eventReceiveStage.style.position = "absolute";
            this._eventReceiveStage.style.top = pos["top"] + "px";
            this._eventReceiveStage.style.left = pos["left"] + "px";
            this._eventReceiveStage.style.zIndex = this._screenStage.style.zIndex + 1;
            this._targetStage.appendChild(this._eventReceiveStage);
        };

        /**
         * Display debug information.
         */
        public viewDebugInfo = ():void => {
            if (Util.isEmpty(this._debugInfo)) {
                this._debugInfo = document.createElement("div");
                this._debugInfo.style.position = "absolute";
                this._debugInfo.style.top = "0px";
                this._debugInfo.style.left = "0px";
                this._debugInfo.style.zIndex = "9999";
                this._debugInfo.style.color = "red";
                this._debugInfo.id = "__lwfPlayerDebugInfoID";
                this._targetStage.appendChild(this._debugInfo);
            }

            if (this._execCount % 60 === 0) {
                var _time = global.performance.now();
                this._currentFPS = Math.round(60000.0 / (_time - this._from));
                this._from = _time;
                this._execCount = 0;
            }

            var x = this._player.coordinator.x;
            var y = this._player.coordinator.y;
            var renderer = this._player.rendererSelector.renderer.substring(3);
            renderer = renderer.substring(0, renderer.lastIndexOf("Renderer"));
            this._execCount++;
            this._debugInfo.innerHTML = renderer + " " + this._currentFPS + "fps " + "X:" + x + " Y:" + y + "<br>" +
                "sw:" + this._stageStyleWidth + " sh:" + this._stageStyleHeight +
                " w:" + this._stageWidth + " h:" + this._stageHeight + " s:" + this._stageScale + " dpr:" + this.devicePixelRatio;
        };
    }
}
