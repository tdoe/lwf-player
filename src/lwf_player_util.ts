/// <reference path="lib/params.d.ts"/>
/// <reference path="lwf_player_renderer_name.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>

/**
 * Created by tdoe on 5/5/14.
 *
 * This class is for utility and Cross browser polyfills.
 */
module LwfPlayer {

    "use strict";

    export class Util {

        /**
         * current useragent
         */
        public static ua = global.navigator.userAgent;

        /**
         * Whether currently running on iOS
         */
        public static isiOS:boolean = /iP(ad|hone|od)/.test(Util.ua);

        /**
         * Whether currently running on Android
         */
        public static isAndroid:boolean = (/Android/.test(Util.ua));

        /**
         * Whether currently running on SP
         */
        public static isSp:boolean = Util.isiOS || Util.isAndroid;

        /**
         * Whether currently running on Chrome
         */
        public static isChrome:boolean = /Chrome/.test(Util.ua);

        /**
         * Whether touch event is enabled, by default this refers whether currently running on SP
         */
        public static isTouchEventEnabled:boolean = Util.isSp;

        /**
         * Turn off Web Worker on Android native browser, allow it runs on Android Chrome
         */
        public static useWebWorker:boolean = !Util.isAndroid || Util.isChrome;

        /**
         * isPreventDefaultEnabled flag
         */
        public static isPreventDefaultEnabled:boolean = Util.isiOS || /Android *(4|3)\..*/.test(Util.ua);

        public static forceSettingForAndroid = (lwfSettings:LwfSettings, renderer:string):void => {
            /** force to disable use3D on Android devices */
            lwfSettings.use3D = false;

            if (lwfSettings.worker) {
                lwfSettings.worker = Util.useWebWorker;
            }

            /** handle buggy css behaviour in certain devices */
            if (/ (SC-0|Galaxy Nexus|SH-0)/.test(Util.ua) &&
                renderer === RendererName[RendererName.useWebkitCSSRenderer]) {
                lwfSettings.quirkyClearRect = true;
            }
        };

        /**
         * tune opacity for SH devices using Android 2.3.5-2.3.7 with WebkitCSS Renderer
         *
         * @param renderer
         * @returns {*}
         */
        public static getOpacity = (renderer:string):string => {
            if (renderer === RendererName[RendererName.useWebkitCSSRenderer] &&
                /Android 2\.3\.[5-7]/.test(Util.ua) &&
                /SH/.test(Util.ua)) {
                return "0.9999";
            }

            return null;
        };

        /**
         * fix innerWidth for old Android devices
         */
        public static getStageWidth = ():number => {
            if (global.innerWidth > global.screen.width) {
                return global.screen.width;
            }

            return global.innerWidth;
        };

        /**
         * fix innerHeight for old Android devices
         */
        public static getStageHeight = ():number => {
            if (global.innerHeight > global.screen.height) {
                return global.screen.height;
            }

            return global.innerHeight;
        };

        /**
         * if null or undefined or empty object is return true.
         *
         * @param arg
         *
         * @returns {boolean}
         */
        public static isEmpty = (arg:any):boolean => {
            if (arg === void 0 || arg === null) {
                return true;
            }

            if (((typeof arg === "string" || arg instanceof String)) || arg instanceof Array) {
                return arg.length === 0;
            }

            if (arg instanceof Function || isFinite(arg)) {
                return false;
            }

            for (var i in arg) {
                if (arg.hasOwnProperty(i)) {
                    return false;
                }
            }

            return !(arg instanceof Boolean);
        };

        /**
         * @see Util.isEmpty
         *
         * @param arg
         *
         * @returns {boolean}
         */
        public static isNotEmpty = (arg:any) => {
            return !Util.isEmpty(arg);
        };
    }

    /**
     * "window.performance.now()" cross browser polyfills
     */
    if (Util.isEmpty(global.performance)) {
        global.performance = {};
    }

    global.performance.now = global.performance.now ||
        global.performance.webkitNow ||
        global.performance.mozNow ||
        global.performance.oNow ||
        global.performance.msNow ||
        Date.now;

    /**
     * "window.requestAnimationFrame()" cross browser polyfills
     */
    global.requestAnimationFrame = global.requestAnimationFrame ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame ||
        global.oRequestAnimationFrame ||
        global.msRequestAnimationFrame;

    if (Util.isEmpty(global.requestAnimationFrame) || /iP(ad|hone|od).*OS 6/.test(Util.ua)) {
        var vSync = 1000 / 60;
        var from = global.performance.now();
        global.requestAnimationFrame = (callback:Function) => {
            var time = global.performance.now();
            var duration = time - from;
            var delay = vSync - ((duration > vSync) ? duration % vSync : duration);
            return setTimeout(() => {
                from = global.performance.now();
                callback();
            }, delay);
        };
    }

    /**
     * handle special behaviour of touch event on certain devices
     */
    if (Util.isAndroid && (Util.isChrome || / SC-0/.test(Util.ua))) {
        document.body.addEventListener("touchstart", () => {
            //nothing todo...
        });
    }
}
