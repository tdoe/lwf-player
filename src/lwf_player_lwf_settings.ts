/**
 * Created by tdoe on 5/5/14.
 *
 * This class is LWF parameter setting class.
 *
 * Child LWF can use this class instance,
 * but a do not use the same instance in other children.
 * because configuration conflict occurs.
 * If you are in need of the same setting, use a deep copy object.
 */

    /// <reference path="lwf_player.ts"/>
    /// <reference path="lwf_player_renderer_selector.ts"/>
    /// <reference path="lwf_player_lwf_loader.ts"/>

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

        /**
         * validation check this instance.
         */
        public validationLwfSettings = () => {
            if (Util.isEmpty(this.lwf)) {
                throw new Error("lwf property is require.");
            }
        };

        /**
         * initialized pos property.
         */
        public initPos = () => {
            this.pos = {
                "position": "absolute",
                "top"     : 0,
                "left"    : 0
            };
        };

        /**
         * require members init.
         *
         * @param player
         */
        public prepareLwfSettings = (player:Player):void => {
            if (Util.isEmpty(this.privateData)) {
                this.privateData = {};
            }

            if (Util.isEmpty(this.useBackgroundColor)) {
                this.useBackgroundColor = true;
            }

            this.stage = player.stageContractor.screenStage;
            this.imageMap = LwfSettings.getImageMapper(this.imageMap);

            if (Util.isAndroid) {
                Util.forceSettingForAndroid(this, player.rendererSelector.renderer);
            }

            this.onload = player.onLoad;

            LwfLoader.setLoader(player, this);
        };

        /**
         * Generates function that takes image name as an input and returns the path corresponding to it.
         * If input is a function, return directly. Otherwise, it tries to set path from the previous set imageMap array.
         * ImageMap will be passed into LWF directly.
         *
         * @param imageMap image map data
         *
         * @return function to replace path by maps
         */
        public static getImageMapper = (imageMap:any):Function => {
            if (imageMap instanceof Function) {
                return imageMap;
            }

            return (pImageId:string) => {
                if (imageMap && imageMap.hasOwnProperty(pImageId)) {
                    return imageMap[pImageId];
                }
                return pImageId;
            };
        };

        /**
         * return LWF file path.
         *
         * @param lwfName LWF name.
         *
         * @returns {string|Function} LWF file path.
         */
        public getLwfPath = (lwfName:string):any => {
            if (Util.isNotEmpty(this.lwfMap)) {
                if (this.lwfMap instanceof Function) {
                    return this.lwfMap(lwfName);
                }

                var path = this.lwfMap[lwfName];
                if (!/\.lwf$/.test(path)) {
                    path += ".lwf";
                }

                return path;
            }

            return LwfLoader.getLwfPath(lwfName);
        };
    }
}
