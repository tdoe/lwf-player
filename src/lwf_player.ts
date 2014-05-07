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
        private lwfSettings:LwfSettings = null;
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
            this.lwfSettings = lwfSettings;

            this.restraint();
            this.initLwf();

            this.stageContractor = new StageContractor(this);
            this.stageContractor.createScreenStage(this.rendererSelector);
            this.coordinator = new Coordinator(this.stageContractor);

            this.validateLwfSetting();
        }

        public play():void {
            var _this = this;
            this.stageContractor.addEventListeners();
            this.requestLWF(function (_lwf:LWF.LWF) {
                _this.lwf = _lwf;
            });
            this.loadLWFs(function (errors:Error) {
                if (errors === null) {
                    _this.exec();
                } else {
                    _this.handleLoadError();
                }
            });
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

        private requestLWF(onload:Function):void {
            this.lwfSettings.onload = onload;
            this.requests.push(this.lwfSettings);
        }

        private loadLWFs(onLoadAll:Function):void {
            this.cache.loadLWFs(this.requests, onLoadAll);
            this.requests = [];
        }

        private loadLWF(lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:Object, callback:Function):void {
            for (var i in privateData) {
                if (privateData.hasOwnProperty(i)) {
                    this.lwfSettings.privateData[i] = privateData[i];
                }
            }

            if (privateData.hasOwnProperty("imageMap")) {
                this.lwfSettings.imageMap = this.getImageMapper(privateData["imageMap"]);
            }

            var _this = this;
            this.lwfSettings.onload = function (childLwf:LWF.LWF) {
                if (!childLwf) {
                    _this.handleLoadError();
                    return callback(this["error"], childLwf);
                }
                return callback(null, childLwf);
            };

            this.lwfSettings.imagePrefix = void 0;
            this.lwfSettings.parentLWF = lwf;
            this.lwfSettings.active = false;
            this.lwfSettings.fitForHeight = this.lwfSettings.fitForWidth = false;
            this.lwfSettings.lwf = this.getLwfPath(lwfName);

            this.cache.loadLWF(this.lwfSettings);
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

        private getLwfPath(lwfName):string {
            if (this.lwfSettings.lwfMap !== void 0) {
                if (typeof this.lwfSettings.lwfMap === "function") {
                    return this.lwfSettings.lwfMap(lwfName);
                }

                var path = this.lwfSettings.lwfMap[lwfName];
                if (!/\.lwf$/.test(path)) {
                    path += ".lwf";
                }

                return path;
            }

            var _lwfName = lwfName;
            if (lwfName.indexOf("/") >= 0) {
                _lwfName = lwfName.substring(lwfName.lastIndexOf("/") + 1);
            }

            return lwfName + "/_/" + _lwfName + ".lwf";
        }

        private getImageMapper(imageMap:any):Function {
            if (typeof imageMap == "function") {
                return imageMap;
            }

            return function (pImageId:string) {
                if (imageMap && imageMap.hasOwnProperty(pImageId)) {
                    return imageMap[pImageId];
                }
                return pImageId;
            };
        }

        private exec():void {
            var _this = this;
            try {
                if (this.destroyed) {
                    this.destroyLwf();
                    return;
                }
                if (this.lwf != null && !this.pausing) {
                    for (var i = 0; i < this.inputQueue.length; i++) {
                        this.inputQueue[i]();
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
            if (this.playerSettings.renderer !== void 0 || this.playerSettings.renderer !== null) {
                this.rendererSelector.setRenderer(this.playerSettings.renderer);
            }

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

        private validateLwfSetting():void {
            if (this.lwfSettings.privateData === void 0) {
                this.lwfSettings.privateData = {};
            }

            if (this.lwfSettings.useBackgroundColor === void 0) {
                this.lwfSettings.useBackgroundColor = true;
            }

            this.lwfSettings.stage = this.stageContractor.getScreenStage();
            this.lwfSettings.imageMap = this.getImageMapper(this.lwfSettings.imageMap);

            if (Util.isAndroid) {
                this.lwfSettings.use3D = false;

                if (this.lwfSettings.worker) {
                    this.lwfSettings.worker = Util.useWebWorker;
                }
            }

            // For backward compatibility lwf-loader.
            this.lwfSettings.privateData["lwfLoader"] = this;
        }

        private inputPoint(e:Event):void {
            var coordinate = this.coordinator.getInputPoint(e);
            this.lwf.inputPoint(coordinate.getX(), coordinate.getY());
        }

        private inputPress(e:Event):void {
            this.inputPoint(e);
            this.lwf.inputPress();
        }

        private inputRelease(e:Event):void {
            this.inputPoint(e);
            this.lwf.inputRelease();
        }

        public onMove(e:Event):void {
            var _this = this;
            this.inputQueue.push(function () {
                _this.inputPoint(e);
            });
        }

        public onPress(e:Event):void {
            var _this = this;
            this.inputQueue.push(function () {
                _this.inputPress(e);
            });
        }

        public onRelease(e:Event):void {
            var _this = this;
            this.inputQueue.push(function () {
                _this.inputRelease(e);
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
