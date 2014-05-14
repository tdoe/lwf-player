/**
 * Created by tdoe on 5/5/14.
 *
 * This class is LwfPlayer main class.
 * using other LwfPlayer.* class, control LWF animation.
 */

/// <reference path="lib/lwf.d.ts"/>

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_coordinator.ts"/>
/// <reference path="lwf_player_lwf_settings.ts"/>
/// <reference path="lwf_player_player_settings.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>
/// <reference path="lwf_player_stage_contractor.ts"/>

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {

    "use strict";

    export class Player {

        // fromTime LWF members.
        private lwf:LWF.LWF = null;
        private cache:LWF.ResourceCache = null;

        // LwfPlayer module classes members.
        private playerSettings:PlayerSettings = null;
        private lwfSettings:LwfSettings = new LwfSettings();
        private stageContractor:StageContractor = null;
        private coordinator:Coordinator = null;
        private rendererSelector:RendererSelector = new RendererSelector();

        // this class only members.
        private inputQueue:Function[] = [];
        private fromTime:number = global.performance.now();
        private pausing:Boolean = false;
        private goPlayBack:Boolean = false;
        private destroyed:boolean = false;
        private goRestart:boolean = false;

        /**
         * initialize this Player.
         *
         * @param playerSettings Require targetStage:HTMLElement.
         * @param lwfSettings    Require lwf:load LWF path.
         */
        constructor(playerSettings:PlayerSettings, lwfSettings:LwfSettings) {
            this.setSettingsAndValidation(playerSettings, lwfSettings);
            this.rendererSelector.setRenderer(this.playerSettings);
        }

        /**
         * load and play LWF.
         */
        public play():void {
            this.restraint();
            this.initStage();
            this.initLwf();

            this.lwfSettings.prepareLwfSettings(this);

            this.cache.loadLWF(this.lwfSettings);
        }

        /**
         * stop lwf animation.
         */
        public pause():void {
            this.pausing = true;
        }

        /**
         * start lwf animation fromTime pause state.
         */
        public resume():void {
            this.pausing = false;
        }

        /**
         * LWF play back from beginning.
         */
        public playBack():void {
            this.goPlayBack = true;
        }

        /**
         * Restart LWF by same player instance.
         * using same stage and renderer.
         *
         * @param lwfSettings
         */
        public reStart(lwfSettings:LwfSettings):void {
            this.setSettingsAndValidation(this.playerSettings, lwfSettings);

            this.lwfSettings.prepareLwfSettings(this);

            this.goRestart = true;

            this.cache.loadLWF(this.lwfSettings);
        }

        /**
         * Caution! stop animation, and destroy LWF instance .
         */
        public destroy():void {
            this.destroyed = true;
        }

        /**
         * return player using LwfPlayer.Coordinator instance.
         *
         * @returns LwfPlayer.Coordinator
         */
        public getCoordinator():Coordinator {
            return this.coordinator;
        }

        /**
         * return player using LwfPlayer.PlayerSettings instance.
         *
         * @returns LwfPlayer.PlayerSettings
         */
        public getPlayerSettings():PlayerSettings {
            return this.playerSettings;
        }

        /**
         * return player using LwfPlayer.LwfSettings instance.
         *
         * @returns LwfPlayer.LwfSettings
         */
        public getLwfSettings():LwfSettings {
            return this.lwfSettings;
        }

        /**
         * return player using LwfPlayer.RendererSelector instance.
         *
         * @returns LwfPlayer.RendererSelector
         */
        public getRendererSelector():RendererSelector {
            return this.rendererSelector;
        }

        /**
         * return player using LwfPlayer.StageContractor instance.
         *
         * @returns LwfPlayer.StageContractor
         */
        public getStageContractor():StageContractor {
            return this.stageContractor;
        }

        /**
         * handle load error.
         * can run the error handler that was passed.
         * It is recommended to pass handler["loadError"] function.
         */
        private handleLoadError():void {
            if (this.lwfSettings.handler && this.lwfSettings.handler["loadError"] instanceof Function) {
                this.lwfSettings.handler["loadError"](this.lwfSettings.error);
            }
            console.error("[LWF] load error: %o", this.lwfSettings.error);
        }

        /**
         * handle exception.
         * can run the Exception handler that was passed.
         * It is recommended to pass handler["exception"] function.
         *
         * @param exception
         */
        private handleException(exception:any):void {
            if (this.lwfSettings.handler && this.lwfSettings.handler["exception"] instanceof Function) {
                this.lwfSettings.handler["exception"](exception);
            }
            console.error("[LWF] load Exception: %o", exception);
        }

        /**
         * exec LWF rendering, and dispatch events.
         * It is loop by requestAnimationFrame.
         */
        private exec():void {
            var _this = this;
            try {

                if (this.goRestart) {
                    this.goRestart = false;
                    return;
                }

                if (this.destroyed) {
                    this.destroyLwf();
                    return;
                }

                if (this.goPlayBack) {
                    this.goPlayBack = false;
                    this.lwf.init();
                }

                if (Util.isNotEmpty(this.lwf) && !this.pausing) {
                    for (var i = 0; i < this.inputQueue.length; i++) {
                        this.inputQueue[i].apply(this);
                    }
                    this.stageContractor.changeStageSize(this.lwf.width, this.lwf.height);
                    this.renderLwf();
                }
                this.inputQueue = [];
                global.requestAnimationFrame(function () {
                    _this.exec();
                });
            } catch (e) {
                _this.handleException(e);
            }
        }

        /**
         * initialize LWF animation screen stage, and coordinate class.
         */
        private initStage() {
            this.stageContractor = new StageContractor(this);
            this.stageContractor.createScreenStage(this.rendererSelector);
            this.stageContractor.createEventReceiveStage();
            this.stageContractor.addEventListeners();
            this.coordinator = new Coordinator(this.stageContractor);
        }

        /**
         * Initialize LWF resources.
         * select LWF renderer, and get LWF resource cache.
         */
        private initLwf():void {
            try {
                switch (this.rendererSelector.getRenderer()) {
                    case RendererSelector.canvasRenderer:
                        global.LWF.useCanvasRenderer();
                        break;

                    case RendererSelector.webkitCSSRenderer:
                        global.LWF.useWebkitCSSRenderer();
                        break;

                    case RendererSelector.webGLRenderer:
                        global.LWF.useWebGLRenderer();
                        break;

                    default :
                        throw new Error("not supported renderer");
                }

                this.cache = global.LWF.ResourceCache.get();

            } catch (e) {
                this.handleException(e);
            }
        }

        /**
         * Call LWF rendering processes.
         */
        private renderLwf():void {
            var stageWidth = this.stageContractor.getScreenStageWidth();
            var stageHeight = this.stageContractor.getScreenStageHeight();
            var toTime = global.performance.now();
            var tickTack = (toTime - this.fromTime) / 1000;//fast forward fromTime -> toTime
            this.fromTime = toTime;

            this.lwf.property.clear();

            if (this.lwfSettings.fitForWidth) {
                this.lwf.fitForWidth(stageWidth, stageHeight);
            } else {
                this.lwf.fitForHeight(stageWidth, stageHeight);
            }

            if (this.getRendererSelector().getRenderer() === RendererSelector.webkitCSSRenderer) {
                this.lwf.setTextScale(this.getStageContractor().getDevicePixelRatio());
            }

            this.lwf.property.moveTo(0, 0);
            this.lwf.exec(tickTack);
            this.lwf.render();

            if (this.playerSettings.debug) {
                this.stageContractor.viewDebugInfo();
            }
        }

        /**
         * destroy LWF resource and remove event listener.
         */
        private destroyLwf():void {
            if (Util.isNotEmpty(this.lwf)) {
                this.stageContractor.removeEventListeners();
                this.lwf.destroy();
                this.cache = null;
                this.lwf = null;

                console.log("destroy LWF.");
            }
            console.log("LWF is destroyed.");
        }

        /**
         * check args property, set the instance member.
         *
         * @param playerSettings
         * @param lwfSettings
         */
        private setSettingsAndValidation(playerSettings:PlayerSettings, lwfSettings:LwfSettings):void {
            if (Util.isEmpty(playerSettings) || Util.isEmpty(lwfSettings)) {
                throw new Error("not enough argument.");
            }

            if (!(playerSettings instanceof PlayerSettings) || !(lwfSettings instanceof LwfSettings)) {
                throw new TypeError("require PlayerSettings instance and LwfSettings instance. ex sample/sample1/index.html");
            }

            this.playerSettings = playerSettings;
            this.playerSettings.validationPlayerSettings();

            this.lwfSettings = lwfSettings;
            this.lwfSettings.validationLwfSettings();
        }

        /**
         * pass the coordinates to LWF from mouse or touch event.
         *
         * @param e
         */
        private inputPoint(e:Event):void {
            this.coordinator.setCoordinate(e);
            this.lwf.inputPoint(this.coordinator.getX(), this.coordinator.getY());
        }

        /**
         * pass the coordinates and input to LWF from mouse or touch event.
         *
         * @param e
         */
        private inputPress(e:Event):void {
            this.inputPoint(e);
            this.lwf.inputPress();
        }

        /**
         * push queue the mouse or touch coordinates.
         *
         * @param e
         */
        public onMove(e:Event):void {
            this.inputQueue.push(function () {
                this.inputPoint(e);
            });
        }

        /**
         * push queue the press by mouse or touch coordinates.
         *
         * @param e
         */
        public onPress(e:Event):void {
            this.inputQueue.push(function () {
                this.inputPress(e);
            });
        }

        /**
         * push queue the release by mouse or touch coordinates.
         *
         * @param e
         */
        public onRelease(e:Event):void {
            this.inputQueue.push(function () {
                this.lwf.inputRelease();
            });
        }

        /**
         * onload call back by LWF.
         *
         * @param lwf
         */
        public onLoad(lwf:LWF.LWF) {
            if (Util.isNotEmpty(lwf)) {
                this.lwf = lwf;
                this.exec();
            } else {
                this.handleLoadError();
            }
        }

        /**
         * It is restraint "this" reference to for event listener.
         */
        private restraint():void {
            var __bind = function (fn:Function, me:Player) {
                return function () {
                    fn.apply(me, arguments);
                };
            };

            this.onRelease = __bind(this.onRelease, this);
            this.onPress = __bind(this.onPress, this);
            this.onMove = __bind(this.onMove, this);
            this.onLoad = __bind(this.onLoad, this);
        }

        /**
         *  called by external LWF.
         *  Load external LWF resource to attach on current running LWF.
         *  For backward compatibility lwf-loader.
         *
         * @param lwf         parent LWF instance.
         * @param lwfName     child-LWF ID.
         * @param imageMap    for child-LWF imageMap object or function.
         * @param privateData for child-LWF object.
         * @param callback    callback to return attach LWF instance.
         *
         * @see https://github.com/gree/lwf-loader
         */
        private loadLWF(lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:Object, callback:Function):void {
            var childSettings:LwfSettings =
                    LwfLoader.prepareChildLwfSettings(
                        lwf, lwfName, imageMap, privateData, this.lwfSettings);
            var _this = this;
            childSettings.onload = function (childLwf:LWF.LWF) {
                if (Util.isEmpty(childLwf)) {
                    _this.handleLoadError();
                    return callback(childSettings["error"], childLwf);
                }
                return callback(null, childLwf);
            };

            this.cache.loadLWF(childSettings);
        }
    }
}
