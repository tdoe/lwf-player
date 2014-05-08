/**
 * Created by tdoe on 5/5/14.
 */

/// <reference path="lwf_player.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>

module LwfPlayer {

    "use strict";

    export class LwfSettings {
        public active:boolean;

        public buttonEventMap:Object;

        public callback:Object;

        public error:any;
        public execLimit:Object;

        public fitForHeight:boolean;
        public fitForWidth:boolean;
        public fsCommandMap:any;

        public handler:any;

        public imageMap:any;
        public imageQueryString:string;
        public imagePrefix:string;
        public imageSuffix:string;

        public js:any;

        public loadedCount:number;
        public lwf:string;
        public lwfMap:any;
        public lwfUrl:string;

        public name:string;
        public needsClear:any;

        public onload:Function;
        public onprogress:Function;

        public pageTransitionMap:any;
        public parentLWF:Object;
        public pos:Object;
        public preferredFrameRate:Object;
        public prefix:string;
        public privateData:Object;

        public quirkyClearRect:any;

        public recycleTextCanvas:any;

        public setBackgroundColor:any;
        public soundMap:any;
        public stage:HTMLElement;

        public textInSubpixel:any;
        public total:any;

        public use3D:any;
        public useBackgroundColor:boolean;
        public useVertexColor:boolean;

        public worker:boolean;

        public prepareLwfSettings(player:Player, lwfSettings:LwfSettings):void {
            for (var i in lwfSettings) {
                if (lwfSettings.hasOwnProperty(i)) {
                    this[i] = lwfSettings[i];
                }
            }

            if (this.privateData === void 0) {
                this.privateData = {};
            }

            if (this.useBackgroundColor === void 0) {
                this.useBackgroundColor = true;
            }

            if (this.pos === void 0) {
                this.pos = {
                    "position": "absolute",
                    "top": 0,
                    "left": 0
                };
            }

            this.imageMap = this.getImageMapper(this.imageMap);

            if (Util.isAndroid) {
                /** force to disable use3D on Android devices */
                this.use3D = false;

                if (this.worker) {
                    this.worker = Util.useWebWorker;
                }

                /** handle buggy css behaviour in certain devices */
                if (/ (SC-0|Galaxy Nexus|SH-0)/.test(Util.ua) &&
                    player.getRendererSelector().getRenderer() === RendererSelector.webkitCSSRenderer) {
                    this.quirkyClearRect = true;
                }
            }

            // For backward compatibility lwf-loader.
            this.privateData["lwfLoader"] = player;
        }

        public prepareChildLwfSettings(lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:Object):LwfSettings {
            var childSettings = new LwfSettings();
            childSettings.privateData = {};
            for (var i in privateData) {
                if (privateData.hasOwnProperty(i)) {
                    childSettings.privateData[i] = privateData[i];
                }
            }

            if (imageMap !== void 0 || imageMap !== null) {
                childSettings.imageMap = imageMap;
            } else if (privateData.hasOwnProperty("imageMap")) {
                childSettings.imageMap = this.getImageMapper(privateData["imageMap"]);
            }

            childSettings.fitForHeight = false;
            childSettings.fitForWidth = false;
            childSettings.parentLWF = lwf;
            childSettings.active = false;
            childSettings.lwf = this.getLwfPath(lwfName);
            childSettings.stage = this.stage;

            return childSettings;
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

        private getLwfPath(lwfName):string {
            if (this.lwfMap !== void 0) {
                if (typeof this.lwfMap === "function") {
                    return this.lwfMap(lwfName);
                }

                var path = this.lwfMap[lwfName];
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
    }
}
