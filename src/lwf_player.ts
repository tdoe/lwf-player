/// <reference path="lib/lwf.d.ts"/>
/// <reference path="lib/params.d.ts"/>

/// <reference path="lwf_player_renderer_name.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_coordinator.ts"/>
/// <reference path="lwf_player_lwf_settings.ts"/>
/// <reference path="lwf_player_player_settings.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>
/// <reference path="lwf_player_stage_contractor.ts"/>

/**
 * Created by tdoe on 5/5/14.
 *
 * This class is LwfPlayer main class.
 * using other LwfPlayer.* class, control LWF animation.
 */
module LwfPlayer {

    "use strict";

    /**
     * @type {LwfPlayer.Player}
     * @const
     */
    export class Player {

        // fromTime LWF members.
        private _lwf:LWF.LWF = null;
        private _cache:LWF.ResourceCache = null;

        // LwfPlayer module classes members.
        private _playerSettings:PlayerSettings = null;
        private _lwfSettings:LwfSettings = new LwfSettings();
        private _stageContractor:StageContractor = null;
        private _coordinator:Coordinator = null;
        private _rendererSelector:RendererSelector = new RendererSelector();

        // this class only members.
        private _inputQueue:Function[] = [];
        private _fromTime:number = global.performance.now();
        private _pausing:Boolean = false;
        private _goPlayBack:Boolean = false;
        private _destroyed:boolean = false;
        private _goRestart:boolean = false;

        /**
         * initialize this Player.
         *
         * @param playerSettings Require targetStage:HTMLElement.
         * @param lwfSettings    Require lwf:load LWF path.
         */
        constructor(playerSettings:PlayerSettings, lwfSettings:LwfSettings) {
            this.setSettingsAndValidation(playerSettings, lwfSettings);
            this._rendererSelector.renderer = this._playerSettings.renderer;
        }

        /**
         * load and play LWF.
         */
        public play = ():void => {
            this.initStage();
            this.initLwf();

            this._lwfSettings.prepareLwfSettings(this);

            this._cache.loadLWF(this._lwfSettings);
        };

        /**
         * stop lwf animation.
         */
        public pause = ():void => {
            this._pausing = true;
        };

        /**
         * start lwf animation fromTime pause state.
         */
        public resume = ():void => {
            this._pausing = false;
        };

        /**
         * LWF play back from beginning.
         */
        public playBack = ():void => {
            this._goPlayBack = true;
        };

        /**
         * Restart LWF by same player instance.
         * using same stage and renderer.
         *
         * @param lwfSettings
         */
        public reStart = (lwfSettings:LwfSettings):void => {
            this._goRestart = true;

            this.setSettingsAndValidation(this._playerSettings, lwfSettings);

            this._lwfSettings.prepareLwfSettings(this);
            this._cache.loadLWF(this._lwfSettings);
        };

        /**
         * Caution! stop animation, and destroy LWF instance .
         */
        public destroy = ():void => {
            this._destroyed = true;
        };

        /**
         * return player using LwfPlayer.Coordinator instance.
         *
         * @returns LwfPlayer.Coordinator
         */
        public get coordinator():Coordinator {
            return this._coordinator;
        }

        /**
         * return player using LwfPlayer.PlayerSettings instance.
         *
         * @returns LwfPlayer.PlayerSettings
         */
        public get playerSettings():PlayerSettings {
            return this._playerSettings;
        }

        /**
         * return player using LwfPlayer.LwfSettings instance.
         *
         * @returns LwfPlayer.LwfSettings
         */
        public get lwfSettings():LwfSettings {
            return this._lwfSettings;
        }

        /**
         * return player using LwfPlayer.RendererSelector instance.
         *
         * @returns LwfPlayer.RendererSelector
         */
        public get rendererSelector():RendererSelector {
            return this._rendererSelector;
        }

        /**
         * return player using LwfPlayer.StageContractor instance.
         *
         * @returns LwfPlayer.StageContractor
         */
        public get stageContractor():StageContractor {
            return this._stageContractor;
        }

        /**
         * handle load error.
         * can run the error handler that was passed.
         * It is recommended to pass handler["loadError"] function.
         */
        private handleLoadError = ():void => {
            if (this._lwfSettings.handler && this._lwfSettings.handler["loadError"] instanceof Function) {
                this._lwfSettings.handler["loadError"](this._lwfSettings.error);
            }
            console.error("[LWF] load error: %o", this._lwfSettings.error);
        };

        /**
         * handle exception.
         * can run the Exception handler that was passed.
         * It is recommended to pass handler["exception"] function.
         *
         * @param exception
         */
        private handleException = (exception:any):void => {
            if (this._lwfSettings.handler && this._lwfSettings.handler["exception"] instanceof Function) {
                this._lwfSettings.handler["exception"](exception);
            }
            console.error("[LWF] load Exception: %o", exception);
        };

        /**
         * exec LWF rendering, and dispatch events.
         * It is loop by requestAnimationFrame.
         */
        private exec = ():void => {
            try {

                if (this._goRestart) {
                    this._goRestart = false;
                    return;
                }

                if (this._destroyed) {
                    this.destroyLwf();
                    return;
                }

                if (this._goPlayBack) {
                    this._goPlayBack = false;
                    this._lwf.init();
                }

                if (Util.isNotEmpty(this._lwf) && !this._pausing) {
                    for (var i = 0; i < this._inputQueue.length; i++) {
                        this._inputQueue[i].apply(this);
                    }
                    this._stageContractor.changeStageSize(this._lwf.width, this._lwf.height);
                    this.renderLwf();
                }
                this._inputQueue = [];
                global.requestAnimationFrame(() => {
                    this.exec();
                });
            } catch (e) {
                this.handleException(e);
            }
        };

        /**
         * initialize LWF animation screen stage, and coordinate class.
         */
        private initStage = ():void => {
            this._stageContractor = new StageContractor(this);
            this._stageContractor.createScreenStage(this._rendererSelector);
            this._stageContractor.createEventReceiveStage();
            this._stageContractor.addEventListeners();
            this._coordinator = new Coordinator(this._stageContractor);
        };

        /**
         * Initialize LWF resources.
         * select LWF renderer, and get LWF resource cache.
         */
        private initLwf = ():void => {
            try {
                switch (this._rendererSelector.renderer) {
                    case RendererName[RendererName.useCanvasRenderer]:
                        global.LWF.useCanvasRenderer();
                        break;

                    case RendererName[RendererName.useWebkitCSSRenderer]:
                        global.LWF.useWebkitCSSRenderer();
                        break;

                    case RendererName[RendererName.useWebGLRenderer]:
                        global.LWF.useWebGLRenderer();
                        break;

                    default :
                        throw new Error("not supported renderer");
                }

                this._cache = global.LWF.ResourceCache.get();

            } catch (e) {
                this.handleException(e);
            }
        };

        /**
         * Call LWF rendering processes.
         */
        private renderLwf = ():void => {
            var stageWidth = this._stageContractor.screenStageWidth;
            var stageHeight = this._stageContractor.screenStageHeight;
            var toTime = global.performance.now();
            var tickTack = (toTime - this._fromTime) / 1000;
            this._fromTime = toTime;

            this._lwf.property.clear();

            if (this._lwfSettings.fitForWidth) {
                this._lwf.fitForWidth(stageWidth, stageHeight);
            } else {
                this._lwf.fitForHeight(stageWidth, stageHeight);
            }

            if (this.rendererSelector.renderer === RendererName[RendererName.useWebkitCSSRenderer]) {
                this._lwf.setTextScale(this.stageContractor.devicePixelRatio);
            }

            this._lwf.property.moveTo(0, 0);
            this._lwf.exec(tickTack);
            this._lwf.render();

            if (this._playerSettings.isDebugMode) {
                this._stageContractor.viewDebugInfo();
            }
        };

        /**
         * destroy LWF resource and remove event listener.
         */
        private destroyLwf = ():void => {
            if (Util.isNotEmpty(this._lwf)) {
                this._stageContractor.removeEventListeners();
                this._lwf.destroy();
                this._cache = null;
                this._lwf = null;

                console.log("destroy LWF.");
            }
            console.log("LWF is destroyed.");
        };

        /**
         * check args property, set the instance member.
         *
         * @param playerSettings
         * @param lwfSettings
         */
        private setSettingsAndValidation = (playerSettings:PlayerSettings, lwfSettings:LwfSettings):void => {
            if (Util.isEmpty(playerSettings) || Util.isEmpty(lwfSettings)) {
                throw new Error("not enough argument.");
            }

            if (!(playerSettings instanceof PlayerSettings) || !(lwfSettings instanceof LwfSettings)) {
                throw new TypeError("require PlayerSettings instance and LwfSettings instance. ex sample/sample1/index.html");
            }

            this._playerSettings = playerSettings;
            this._playerSettings.validationPlayerSettings();

            this._lwfSettings = lwfSettings;
            this._lwfSettings.validationLwfSettings();
        };

        /**
         * pass the coordinates to LWF from mouse or touch event.
         *
         * @param e
         */
        private inputPoint = (e:Event):void => {
            this._coordinator.setCoordinate(e);
            this._lwf.inputPoint(this._coordinator.x, this._coordinator.y);
        };

        /**
         * pass the coordinates and input to LWF from mouse or touch event.
         *
         * @param e
         */
        private inputPress = (e:Event):void => {
            this.inputPoint(e);
            this._lwf.inputPress();
        };

        /**
         * push queue the mouse or touch coordinates.
         *
         * @param e
         */
        public onMove = (e:Event):void => {
            this._inputQueue.push(function () {
                this.inputPoint(e);
            });
        };

        /**
         * push queue the press by mouse or touch coordinates.
         *
         * @param e
         */
        public onPress = (e:Event):void => {
            this._inputQueue.push(function () {
                this.inputPress(e);
            });
        };

        /**
         * push queue the release by mouse or touch coordinates.
         *
         * @param e
         */
        public onRelease = (e:Event):void => {
            this._inputQueue.push(function () {
                this._lwf.inputRelease();
            });
        };

        /**
         * onload call back by LWF.
         *
         * @param lwf
         */
        public onLoad = (lwf:LWF.LWF):void => {
            if (Util.isNotEmpty(lwf)) {
                this._lwf = lwf;
                this.exec();
            } else {
                this.handleLoadError();
            }
        };

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
        public loadLWF = (lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:any, callback:Function):void => {
            var childSettings:LwfSettings =
                    LwfLoader.prepareChildLwfSettings(
                        lwf, lwfName, imageMap, privateData, this._lwfSettings);
            childSettings.onload = function (childLwf:LWF.LWF) {
                if (Util.isEmpty(childLwf)) {
                    this.handleLoadError();
                    return callback(childSettings["error"], childLwf);
                }
                return callback(null, childLwf);
            };

            this._cache.loadLWF(childSettings);
        };
    }
}
