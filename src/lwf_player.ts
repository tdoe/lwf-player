/**
 * Created by tdoe on 5/5/14.
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

    // init "requestAnimationFrame" and "performance.now"
    Util.initUtil();

    export class Player {

        private lwf:LWF.LWF = null;
        private cache:LWF.ResourceCache = null;

        private playerSettings:PlayerSettings = null;
        private lwfSettings:LwfSettings = new LwfSettings();
        private stageContractor:StageContractor = null;
        private coordinator:Coordinator = null;
        private rendererSelector:RendererSelector = new RendererSelector();

        private inputQueue:Function[] = [];
        private requests:Object[] = [];
        private from:number = global.performance.now();

        private pausing:Boolean = false;
        private destroyed:boolean = false;

        constructor(playerSettings:PlayerSettings, lwfSettings:LwfSettings) {
            this.playerSettings = playerSettings;
            this.lwfSettings.prepareLwfSettings(this, lwfSettings);
            if (this.playerSettings.renderer !== void 0 && this.playerSettings.renderer !== null) {
                this.rendererSelector.setRenderer(this.playerSettings.renderer);
            }
            this.stageContractor = new StageContractor(this);
            this.stageContractor.createScreenStage(this.rendererSelector);
            this.coordinator = new Coordinator(this.stageContractor);
            this.lwfSettings.stage = this.stageContractor.getScreenStage();

            this.restraint();
            this.initLwf();
        }

        public play():void {
            var _this = this;
            this.stageContractor.addEventListeners();
            this.lwfSettings.onload = function (_lwf:LWF.LWF) {
                if (_lwf !== null) {
                    _this.lwf = _lwf;
                    _this.exec();
                } else {
                    _this.handleLoadError();
                }
            };
            this.cache.loadLWF(this.lwfSettings);
        }

        public pause():void {
            this.pausing = true;
        }

        public resume():void {
            this.pausing = false;
        }

        public destroy():void {
            this.destroyed = true;
        }

        public getCoordinator():Coordinator {
            return this.coordinator;
        }

        public getPlayerSettings():PlayerSettings {
            return this.playerSettings;
        }

        public getLwfSettings():LwfSettings {
            return this.lwfSettings;
        }

        public getRendererSelector():RendererSelector {
            return this.rendererSelector;
        }

        public getStageContractor():StageContractor {
            return this.stageContractor;
        }

        // For backward compatibility lwf-loader.
        private loadLWF(lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:Object, callback:Function):void {
            var childSettings:LwfSettings = this.lwfSettings.prepareChildLwfSettings(lwf, lwfName, imageMap, privateData);
            var _this = this;
            childSettings.onload = function (childLwf:LWF.LWF) {
                if (!childLwf) {
                    _this.handleLoadError();
                    return callback(childSettings["error"], childLwf);
                }
                return callback(null, childLwf);
            };

            this.cache.loadLWF(childSettings);
        }

        private handleLoadError():void {
            if (this.lwfSettings.handler && typeof this.lwfSettings.handler["loadError"] === "function") {
                this.lwfSettings.handler["loadError"](this.lwfSettings.error);
            }
            console.error("[LWF] load error: %o", this.lwfSettings.error);
        }

        private handleException(exception):void {
            if (this.lwfSettings.handler && typeof this.lwfSettings.handler["exception"] === "function") {
                this.lwfSettings.handler["exception"](exception);
            }
            console.error("[LWF] load Exception: %o", exception);
        }

        private exec():void {
            var _this = this;
            try {
                if (this.destroyed) {
                    this.destroyLwf();
                    return;
                }
                if (this.lwf !== null && !this.pausing) {
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

        private renderLwf():void {
            var time = global.performance.now();
            var tick = time - this.from;
            var stageWidth = this.stageContractor.getScreenStageWidth();
            var stageHeight = this.stageContractor.getScreenStageHeight();

            this.from = time;

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
            this.lwf.exec(tick / 1000);
            this.lwf.render();

            if (this.playerSettings.debug) {
                this.stageContractor.viewDebugInfo();
            }
        }

        private destroyLwf():void {
            if (this.lwf !== null) {
                this.stageContractor.removeEventListeners();
                this.lwf.destroy();
                this.cache = null;
                this.lwf = null;

                console.log("destroy LWF.");
            }
            console.log("LWF is destroyed.");
        }

        private inputPoint(e:Event):void {
            var coordinate = this.coordinator.getInputPoint(e);
            this.lwf.inputPoint(coordinate.getX(), coordinate.getY());
        }

        private inputPress(e:Event):void {
            this.inputPoint(e);
            this.lwf.inputPress();
        }

        public onMove(e:Event):void {
            this.inputQueue.push(function () {
                this.inputPoint(e);
            });
        }

        public onPress(e:Event):void {
            this.inputQueue.push(function () {
                this.inputPress(e);
            });
        }

        public onRelease(e:Event):void {
            this.inputQueue.push(function () {
                this.lwf.inputRelease();
            });
        }

        private restraint():void {
            var __bind = function (fn:Function, me:Player) {
                return function () {
                    fn.apply(me, arguments);
                };
            };

            this.onRelease = __bind(this.onRelease, this);
            this.onPress = __bind(this.onPress, this);
            this.onMove = __bind(this.onMove, this);
        }
    }
}
