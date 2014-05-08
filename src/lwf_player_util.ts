/**
 * Created by tdoe on 5/5/14.
 */

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {

    "use strict";

    export class Util {

        /** current useragent */
        public static ua = navigator.userAgent;

        /** Whether currently running on iOS @type {boolean} */
        public static isiOS:boolean = /iP(ad|hone|od)/.test(Util.ua);

        /** Whether currently running on Android @type {boolean} */
        public static isAndroid:boolean = (/Android/.test(Util.ua));

        /** Whether currently running on SP  @type {boolean} */
        public static isSp:boolean = Util.isiOS || Util.isAndroid;

        /** Whether currently running on Chrome */
        public static isChrome:boolean = /Chrome/.test(Util.ua);

        /** Whether touch event is enabled, by default this refers whether currently running on SP */
        public static isTouchEventEnabled:boolean = Util.isSp;

        /** Turn off Web Worker on Android native browser, allow it runs on Android Chrome  @type {boolean} */
        public static useWebWorker:boolean = !Util.isAndroid || Util.isChrome;

        /** For displaying debug FPS information */
        public static debugInfoElementId:number = 0;

        public static initUtil():void {
            if (typeof global.performance === "undefined") {
                global.performance = {};
            }
            global.performance.now = global.performance.now ||
                global.performance.webkitNow ||
                global.performance.mozNow ||
                global.performance.oNow ||
                global.performance.msNow ||
                Date.now;

            global.requestAnimationFrame = global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozRequestAnimationFrame ||
                global.oRequestAnimationFrame ||
                global.msRequestAnimationFrame;

            /** apply poly fills for iOS6 devices */
            if (global.requestAnimationFrame === void 0 || /iP(ad|hone|od).*OS 6/.test(Util.ua)) {

                var vSync = 1000 / 60;
                var t0 = global.performance.now();

                global.requestAnimationFrame = function (callback:any) {

                    var t1 = global.performance.now();
                    var duration = t1 - t0;
                    var d = vSync - ((duration > vSync) ? duration % vSync : duration);

                    return setTimeout(function () {
                        t0 = global.performance.now();
                        callback();
                    }, d);
                };
            }
        }
    }
}
