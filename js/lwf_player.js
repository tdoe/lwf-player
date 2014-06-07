/**
* Created by tdoe on 5/4/14.
*
* This class handling for LWF-Renderer choice.
* will be cross-browser countermeasure.
*
* @type {Object}
* @const
*/
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    /**
    * @type {LwfPlayer.RendererName}
    * @const
    */
    (function (RendererName) {
        RendererName[RendererName["useCanvasRenderer"] = 0] = "useCanvasRenderer";
        RendererName[RendererName["useWebkitCSSRenderer"] = 1] = "useWebkitCSSRenderer";
        RendererName[RendererName["useWebGLRenderer"] = 2] = "useWebGLRenderer";
    })(LwfPlayer.RendererName || (LwfPlayer.RendererName = {}));
    var RendererName = LwfPlayer.RendererName;
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_renderer_name.ts"/>
/**
* Created by tdoe on 5/4/14.
*
* This class handling for LWF-Renderer choice.
* will be cross-browser countermeasure.
*/
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    /**
    * @type {LwfPlayer.RendererSelector}
    * @const
    */
    var RendererSelector = (function () {
        function RendererSelector() {
            var _this = this;
            /**
            * detects if current environment is WebGL capable.
            * auto-select the optimal renderer set after.
            * use canvas-renderer when set renderer nothing.
            */
            this.autoSelectRenderer = function () {
                var canvas = document.createElement("canvas");
                var contextNames = ["webgl", "experimental-webgl"];

                for (var i = 0; i < contextNames.length; i++) {
                    if (canvas.getContext(contextNames[i])) {
                        _this._renderer = LwfPlayer.RendererName[2 /* useWebGLRenderer */];
                        break;
                    }
                }

                /** iOS 4 devices should use CSS renderer due to spec issue */
                if (/iP(ad|hone|od).*OS 4/.test(LwfPlayer.Util.ua)) {
                    _this._renderer = LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */];
                } else if (/Android 2\.1/.test(LwfPlayer.Util.ua) || /Android 2\.3\.[5-7]/.test(LwfPlayer.Util.ua)) {
                    /** Android 2.1 does not work with Canvas, force to use CSS renderer */
                    /** Android 2.3.5 or higher 2.3 versions does not work properly on canvas */
                    _this._renderer = LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */];
                } else if (/Android 4/.test(LwfPlayer.Util.ua)) {
                    /** Android 4.x devices are recommended to run with CSS renderer except for Chrome*/
                    if (/Chrome/.test(LwfPlayer.Util.ua)) {
                        _this._renderer = LwfPlayer.RendererName[0 /* useCanvasRenderer */];
                    } else {
                        _this._renderer = LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */];
                    }
                }

                if (LwfPlayer.Util.isEmpty(_this._renderer)) {
                    _this._renderer = LwfPlayer.RendererName[0 /* useCanvasRenderer */];
                }
            };
            this.autoSelectRenderer();
        }
        Object.defineProperty(RendererSelector.prototype, "renderer", {
            /**
            * get current renderer
            *
            * @returns {string}
            */
            get: function () {
                return this._renderer;
            },
            /**
            * set renderer name.
            * can use it only three types.
            * auto-select the optimal renderer set after.
            *
            * @param renderer
            */
            set: function (renderer) {
                if (LwfPlayer.Util.isEmpty(renderer)) {
                    this.autoSelectRenderer();
                    return;
                }

                switch (renderer) {
                    case LwfPlayer.RendererName[0 /* useCanvasRenderer */]:
                    case LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */]:
                    case LwfPlayer.RendererName[2 /* useWebGLRenderer */]:
                        this._renderer = renderer;
                        break;
                    default:
                        throw new Error("unsupported renderer:" + renderer);
                }

                this.autoSelectRenderer();
            },
            enumerable: true,
            configurable: true
        });

        return RendererSelector;
    })();
    LwfPlayer.RendererSelector = RendererSelector;
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lib/params.d.ts"/>
/// <reference path="lwf_player_renderer_name.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>
/**
* Created by tdoe on 5/5/14.
*
* This class is for utility and Cross browser polyfills.
*/
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var Util = (function () {
        function Util() {
        }
        Util.ua = global.navigator.userAgent;

        Util.isiOS = /iP(ad|hone|od)/.test(Util.ua);

        Util.isAndroid = (/Android/.test(Util.ua));

        Util.isSp = Util.isiOS || Util.isAndroid;

        Util.isChrome = /Chrome/.test(Util.ua);

        Util.isTouchEventEnabled = Util.isSp;

        Util.useWebWorker = !Util.isAndroid || Util.isChrome;

        Util.isPreventDefaultEnabled = Util.isiOS || /Android *(4|3)\..*/.test(Util.ua);

        Util.forceSettingForAndroid = function (lwfSettings, renderer) {
            /** force to disable use3D on Android devices */
            lwfSettings.use3D = false;

            if (lwfSettings.worker) {
                lwfSettings.worker = Util.useWebWorker;
            }

            /** handle buggy css behaviour in certain devices */
            if (/ (SC-0|Galaxy Nexus|SH-0)/.test(Util.ua) && renderer === LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */]) {
                lwfSettings.quirkyClearRect = true;
            }
        };

        Util.getOpacity = function (renderer) {
            if (renderer === LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */] && /Android 2\.3\.[5-7]/.test(Util.ua) && /SH/.test(Util.ua)) {
                return "0.9999";
            }

            return null;
        };

        Util.getStageWidth = function () {
            if (global.innerWidth > global.screen.width) {
                return global.screen.width;
            }

            return global.innerWidth;
        };

        Util.getStageHeight = function () {
            if (global.innerHeight > global.screen.height) {
                return global.screen.height;
            }

            return global.innerHeight;
        };

        Util.isEmpty = function (arg) {
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

        Util.isNotEmpty = function (arg) {
            return !Util.isEmpty(arg);
        };
        return Util;
    })();
    LwfPlayer.Util = Util;

    /**
    * "window.performance.now()" cross browser polyfills
    */
    if (Util.isEmpty(global.performance)) {
        global.performance = {};
    }

    global.performance.now = global.performance.now || global.performance.webkitNow || global.performance.mozNow || global.performance.oNow || global.performance.msNow || Date.now;

    /**
    * "window.requestAnimationFrame()" cross browser polyfills
    */
    global.requestAnimationFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame;

    if (Util.isEmpty(global.requestAnimationFrame) || /iP(ad|hone|od).*OS 6/.test(Util.ua)) {
        var vSync = 1000 / 60;
        var from = global.performance.now();
        global.requestAnimationFrame = function (callback) {
            var time = global.performance.now();
            var duration = time - from;
            var delay = vSync - ((duration > vSync) ? duration % vSync : duration);
            return setTimeout(function () {
                from = global.performance.now();
                callback();
            }, delay);
        };
    }

    /**
    * handle special behaviour of touch event on certain devices
    */
    if (Util.isAndroid && (Util.isChrome || / SC-0/.test(Util.ua))) {
        document.body.addEventListener("touchstart", function () {
            //nothing todo...
        });
    }
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lwf_player_renderer_name.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>

/**
* Created by tdoe on 5/6/14.
*
* This class is for LWF animation rendering element operation.
*/
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    /**
    * @type {LwfPlayer.StageContractor}
    * @const
    */
    var StageContractor = (function () {
        /**
        * this class is need Player instance.
        *
        * @param player
        */
        function StageContractor(player) {
            var _this = this;
            this._player = null;
            this._targetStage = null;
            this._screenStage = null;
            this._stageScale = 1;
            this._devicePixelRatio = global._devicePixelRatio;
            this._debugInfo = null;
            this._from = global.performance.now();
            this._currentFPS = 0;
            this._execCount = 0;
            this._stageWidth = 0;
            this._stageHeight = 0;
            this._stageStyleWidth = 0;
            this._stageStyleHeight = 0;
            /**
            * calculation to set stage size.
            * stage size is passed to LWF
            *
            * @param width  LWF width
            * @param height LWF height
            */
            this.changeStageSize = function (width, height) {
                var screenWidth = LwfPlayer.Util.getStageWidth();
                var screenHeight = LwfPlayer.Util.getStageHeight();

                if (width > screenWidth) {
                    width = screenWidth;
                }
                if (height > screenHeight) {
                    height = screenHeight;
                }

                if (_this._player.lwfSettings.fitForWidth) {
                    _this.fitForWidth(width, height);
                } else if (_this._player.lwfSettings.fitForHeight) {
                    _this.fitForHeight(width, height);
                } else {
                    _this.fitToScreen(width, height);
                }

                _this._screenStage.style.width = _this._eventReceiveStage.style.width = _this._stageStyleWidth + "px";
                _this._screenStage.style.height = _this._eventReceiveStage.style.height = _this._stageStyleHeight + "px";

                _this._screenStage.setAttribute("width", _this._stageWidth + "");
                _this._screenStage.setAttribute("height", _this._stageHeight + "");
            };
            /**
            * calc stage size by LWF size.
            * For fit to LWF width.
            *
            * @param lwfWidth
            * @param lwfHeight
            */
            this.fitForWidth = function (lwfWidth, lwfHeight) {
                _this._stageStyleWidth = Math.round(lwfWidth);
                _this._stageStyleHeight = Math.round(lwfWidth * lwfHeight / lwfWidth);
                _this.setStageWidthAndHeight();
                _this._stageScale = _this._stageStyleWidth / _this._stageWidth;
            };
            /**
            * calc stage size by LWF size.
            * For fit to LWF height.
            *
            * @param lwfWidth
            * @param lwfHeight
            */
            this.fitForHeight = function (lwfWidth, lwfHeight) {
                _this._stageStyleWidth = Math.round(lwfHeight * lwfWidth / lwfHeight);
                _this._stageStyleHeight = Math.round(lwfHeight);
                _this.setStageWidthAndHeight();
                _this._stageScale = _this._stageStyleHeight / _this._stageHeight;
            };
            /**
            * calc stage size by screen-size.
            * For full screen LWF display.
            *
            * @param lwfWidth
            * @param lwfHeight
            */
            this.fitToScreen = function (lwfWidth, lwfHeight) {
                var screenWidth = LwfPlayer.Util.getStageWidth();
                var screenHeight = LwfPlayer.Util.getStageHeight();

                var stageRatio = lwfWidth / lwfHeight;
                var screenRatio = screenWidth / screenHeight;

                if (screenRatio > stageRatio) {
                    _this._stageStyleWidth = lwfWidth * (screenHeight / lwfHeight);
                    _this._stageStyleHeight = screenHeight;
                    _this.setStageWidthAndHeight();
                    _this._stageScale = _this._stageStyleWidth / _this._stageWidth;
                } else {
                    _this._stageStyleWidth = screenWidth;
                    _this._stageStyleHeight = lwfHeight * (screenWidth / lwfWidth);
                    _this.setStageWidthAndHeight();
                    _this._stageScale = _this._stageStyleHeight / _this._stageHeight;
                }
            };
            /**
            * screen stage size * devicePixelRatio for High-definition screen
            */
            this.setStageWidthAndHeight = function () {
                _this._stageWidth = Math.floor(_this._stageStyleWidth * _this._devicePixelRatio);
                _this._stageHeight = Math.floor(_this._stageStyleHeight * _this._devicePixelRatio);
            };
            /**
            * remove event listeners
            * call before LWF play.
            */
            this.addEventListeners = function () {
                if (LwfPlayer.Util.isTouchEventEnabled) {
                    _this._eventReceiveStage.addEventListener("touchmove", _this._player.onMove, false);
                    _this._eventReceiveStage.addEventListener("touchstart", _this._player.onPress, false);
                    _this._eventReceiveStage.addEventListener("touchend", _this._player.onRelease, false);
                } else {
                    _this._eventReceiveStage.addEventListener("mousedown", _this._player.onPress, false);
                    _this._eventReceiveStage.addEventListener("mousemove", _this._player.onMove, false);
                    _this._eventReceiveStage.addEventListener("mouseup", _this._player.onRelease, false);
                }
            };
            /**
            * remove event listeners
            * call when LWF destroy.
            */
            this.removeEventListeners = function () {
                if (LwfPlayer.Util.isTouchEventEnabled) {
                    _this._eventReceiveStage.removeEventListener("touchstart", _this._player.onPress, false);
                    _this._eventReceiveStage.removeEventListener("touchmove", _this._player.onMove, false);
                    _this._eventReceiveStage.removeEventListener("touchend", _this._player.onRelease, false);
                } else {
                    _this._eventReceiveStage.removeEventListener("mousedown", _this._player.onPress, false);
                    _this._eventReceiveStage.removeEventListener("mousemove", _this._player.onMove, false);
                    _this._eventReceiveStage.removeEventListener("mouseup", _this._player.onRelease, false);
                }
            };
            /**
            * create LWF animation rendering element.
            * @param rendererSelector
            */
            this.createScreenStage = function (rendererSelector) {
                if (rendererSelector.renderer === LwfPlayer.RendererName[0 /* useCanvasRenderer */] || rendererSelector.renderer === LwfPlayer.RendererName[2 /* useWebGLRenderer */]) {
                    _this._screenStage = document.createElement("canvas");
                } else {
                    _this._screenStage = document.createElement("div");
                }

                if (LwfPlayer.Util.isEmpty(_this._player.lwfSettings.pos)) {
                    _this._player.lwfSettings.initPos();
                }

                var pos = _this._player.lwfSettings.pos;

                _this._screenStage.style.position = pos["position"];
                _this._screenStage.style.top = pos["top"] + "px";
                _this._screenStage.style.left = pos["left"] + "px";
                _this._screenStage.style.zIndex = _this._targetStage.style.zIndex + 1;
                _this._screenStage.style.opacity = LwfPlayer.Util.getOpacity(rendererSelector.renderer);

                _this._targetStage.appendChild(_this._screenStage);
            };
            /**
            * create mouse or touch event receive element.
            */
            this.createEventReceiveStage = function () {
                var pos = _this._player.lwfSettings.pos;

                _this._eventReceiveStage = document.createElement("div");
                _this._eventReceiveStage.style.position = "absolute";
                _this._eventReceiveStage.style.top = pos["top"] + "px";
                _this._eventReceiveStage.style.left = pos["left"] + "px";
                _this._eventReceiveStage.style.zIndex = _this._screenStage.style.zIndex + 1;
                _this._targetStage.appendChild(_this._eventReceiveStage);
            };
            /**
            * Display debug information.
            */
            this.viewDebugInfo = function () {
                if (LwfPlayer.Util.isEmpty(_this._debugInfo)) {
                    _this._debugInfo = document.createElement("div");
                    _this._debugInfo.style.position = "absolute";
                    _this._debugInfo.style.top = "0px";
                    _this._debugInfo.style.left = "0px";
                    _this._debugInfo.style.zIndex = "9999";
                    _this._debugInfo.style.color = "red";
                    _this._debugInfo.id = "__lwfPlayerDebugInfoID";
                    _this._targetStage.appendChild(_this._debugInfo);
                }

                if (_this._execCount % 60 === 0) {
                    var _time = global.performance.now();
                    _this._currentFPS = Math.round(60000.0 / (_time - _this._from));
                    _this._from = _time;
                    _this._execCount = 0;
                }

                var x = _this._player.coordinator.x;
                var y = _this._player.coordinator.y;
                var renderer = _this._player.rendererSelector.renderer.substring(3);
                renderer = renderer.substring(0, renderer.lastIndexOf("Renderer"));
                _this._execCount++;
                _this._debugInfo.innerHTML = renderer + " " + _this._currentFPS + "fps " + "X:" + x + " Y:" + y + "<br>" + "sw:" + _this._stageStyleWidth + " sh:" + _this._stageStyleHeight + " w:" + _this._stageWidth + " h:" + _this._stageHeight + " s:" + _this._stageScale + " dpr:" + _this.devicePixelRatio;
            };
            this._player = player;

            this._targetStage = this._player.playerSettings.targetStage;

            // prepare LWF stage
            if (this._targetStage.style.position === "static" || LwfPlayer.Util.isEmpty(this._targetStage.style.position)) {
                this._targetStage.style.position = "relative";
            }

            if (this._player.rendererSelector.renderer === LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */]) {
                this._devicePixelRatio = 1;
            }

            /* set DPR to 2 when running  WebGLRenderer on ARROWS F-series device */
            if (this._player.rendererSelector.renderer === LwfPlayer.RendererName[2 /* useWebGLRenderer */] && / F-/.test(LwfPlayer.Util.ua)) {
                this._devicePixelRatio = 2;
            }

            if (LwfPlayer.Util.isEmpty(this._devicePixelRatio)) {
                this._devicePixelRatio = 1;
            }
        }
        Object.defineProperty(StageContractor.prototype, "devicePixelRatio", {
            /**
            * get devicePixelRatio.
            *
            * @returns {number}
            */
            get: function () {
                return this._devicePixelRatio;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StageContractor.prototype, "stageScale", {
            /**
            * get screen stage scale.
            *
            * @returns {number}
            */
            get: function () {
                return this._stageScale;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StageContractor.prototype, "screenStage", {
            /**
            * get screen stage element.
            *
            * @returns {HTMLElement}
            */
            get: function () {
                return this._screenStage;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StageContractor.prototype, "screenStageWidth", {
            /**
            * get screen width by number convert string.
            *
            * @returns {number}
            */
            get: function () {
                return +this._screenStage.getAttribute("width");
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(StageContractor.prototype, "screenStageHeight", {
            /**
            * get screen height by number convert string.
            *
            * @returns {number}
            */
            get: function () {
                return +this._screenStage.getAttribute("height");
            },
            enumerable: true,
            configurable: true
        });
        return StageContractor;
    })();
    LwfPlayer.StageContractor = StageContractor;

    var Position = (function () {
        function Position() {
        }
        return Position;
    })();
    LwfPlayer.Position = Position;
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lib/params.d.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_stage_contractor.ts"/>
/**
* Created by tdoe on 5/5/14.
*
* this class is the coordinate handler.
* coordinate input from mouse or touch.
*/
var LwfPlayer;
(function (LwfPlayer) {
    var Coordinator = (function () {
        /**
        * this class is need StageContractor instance.
        *
        * @param stageContractor
        */
        function Coordinator(stageContractor) {
            var _this = this;
            /**
            * X coordinate
            */
            this._x = 0;
            /**
            * Y coordinate
            */
            this._y = 0;
            /**
            * For event.preventDefault() execution check.
            * default is LwfPlayer.Util.isPreventDefaultEnabled.
            *
            * @see LwfPlayer.Util.isPreventDefaultEnabled
            */
            this._isPreventDefaultEnabled = LwfPlayer.Util.isPreventDefaultEnabled;
            /**
            * set coordinate by mouse or touch event input.
            * wrapping of mouse, touch and LWF stage size.
            *
            * @param event
            */
            this.setCoordinate = function (event) {
                if (_this._isPreventDefaultEnabled) {
                    event.preventDefault();
                }

                var stageRect = _this._stageContractor.screenStage.getBoundingClientRect();
                var stageScale = _this._stageContractor.stageScale;

                if (LwfPlayer.Util.isTouchEventEnabled) {
                    _this._x = event.touches[0].pageX;
                    _this._y = event.touches[0].pageY;
                } else {
                    _this._x = event.clientX;
                    _this._y = event.clientY;
                }

                _this._x -= stageRect.left;
                _this._y -= stageRect.top;

                if (LwfPlayer.Util.isSp) {
                    _this._x -= global.scrollX;
                    _this._y -= global.scrollY;
                }

                _this._x /= stageScale;
                _this._y /= stageScale;
            };
            this._stageContractor = stageContractor;
        }
        Object.defineProperty(Coordinator.prototype, "preventDefaultEnabled", {
            /**
            * force set isPreventDefaultEnabled.
            *
            * @param isPreventDefaultEnabled
            */
            set: function (isPreventDefaultEnabled) {
                this._isPreventDefaultEnabled = isPreventDefaultEnabled;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Coordinator.prototype, "x", {
            /**
            * From mouse or touch event get X coordinate.
            *
            * @returns _x
            */
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Coordinator.prototype, "y", {
            /**
            * From mouse or touch event get Y coordinate.
            *
            * @returns _y
            */
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        return Coordinator;
    })();
    LwfPlayer.Coordinator = Coordinator;
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lib/params.d.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_lwf_settings.ts"/>
/// <reference path="lwf_player.ts"/>
/**
* Created by tdoe on 5/9/14.
*
* This class is for For backward compatibility lwf-loader.
*/
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var LwfLoader = (function () {
        function LwfLoader() {
        }
        LwfLoader.getLwfPath = function (lwfName) {
            var _lwfName = lwfName;

            if (lwfName.indexOf("/") >= 0) {
                _lwfName = lwfName.substring(lwfName.lastIndexOf("/") + 1);
            }

            return lwfName + "/_/" + _lwfName + ".lwf";
        };

        LwfLoader.setLoader = function (player, lwfSettings) {
            lwfSettings.privateData.lwfLoader = player;
        };

        LwfLoader.prepareChildLwfSettings = function (lwf, lwfName, imageMap, privateData, lwfSetting) {
            var childSettings = new LwfPlayer.LwfSettings();

            for (var i in lwfSetting) {
                if (lwfSetting.hasOwnProperty(i)) {
                    childSettings[i] = lwfSetting[i];
                }
            }

            if (LwfPlayer.Util.isNotEmpty(imageMap)) {
                childSettings.imageMap = LwfPlayer.LwfSettings.getImageMapper(imageMap);
            } else if (privateData.hasOwnProperty("imageMap")) {
                childSettings.imageMap = LwfPlayer.LwfSettings.getImageMapper(privateData.imageMap);
            }

            if (LwfPlayer.Util.isNotEmpty(privateData)) {
                childSettings.privateData = privateData;
            }

            childSettings.lwf = childSettings.getLwfPath(lwfName);
            childSettings.stage = lwfSetting.stage;
            childSettings.fitForHeight = false;
            childSettings.fitForWidth = false;
            childSettings.parentLWF = lwf;
            childSettings.active = false;

            return childSettings;
        };
        return LwfLoader;
    })();
    LwfPlayer.LwfLoader = LwfLoader;
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lib/params.d.ts" />
/// <reference path="lwf_player.ts"/>
/// <reference path="lwf_player_renderer_selector.ts"/>
/// <reference path="lwf_player_lwf_loader.ts"/>
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
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var LwfSettings = (function () {
        function LwfSettings() {
            var _this = this;
            this.pos = {};
            /**
            * validation check this instance.
            */
            this.validationLwfSettings = function () {
                if (LwfPlayer.Util.isEmpty(_this.lwf)) {
                    throw new Error("lwf property is require.");
                }
            };
            /**
            * initialized pos property.
            */
            this.initPos = function () {
                _this.pos = {
                    "top": 0,
                    "left": 0,
                    "position": "absolute"
                };
            };
            /**
            * require members init.
            *
            * @param player
            */
            this.prepareLwfSettings = function (player) {
                if (LwfPlayer.Util.isEmpty(_this.privateData)) {
                    _this.privateData = {};
                }

                if (LwfPlayer.Util.isEmpty(_this.useBackgroundColor)) {
                    _this.useBackgroundColor = true;
                }

                _this.stage = player.stageContractor.screenStage;
                _this.imageMap = LwfSettings.getImageMapper(_this.imageMap);

                if (LwfPlayer.Util.isAndroid) {
                    LwfPlayer.Util.forceSettingForAndroid(_this, player.rendererSelector.renderer);
                }

                _this.onload = player.onLoad;

                LwfPlayer.LwfLoader.setLoader(player, _this);
            };
            /**
            * return LWF file path.
            *
            * @param lwfName LWF name.
            *
            * @returns {string|Function} LWF file path.
            */
            this.getLwfPath = function (lwfName) {
                if (LwfPlayer.Util.isNotEmpty(_this.lwfMap)) {
                    if (_this.lwfMap instanceof Function) {
                        return _this.lwfMap(lwfName);
                    }

                    var path = _this.lwfMap[lwfName];
                    if (!/\.lwf$/.test(path)) {
                        path += ".lwf";
                    }

                    return path;
                }

                return LwfPlayer.LwfLoader.getLwfPath(lwfName);
            };
        }
        LwfSettings.getImageMapper = function (imageMap) {
            if (imageMap instanceof Function) {
                return imageMap;
            }

            return function (pImageId) {
                if (imageMap && imageMap.hasOwnProperty(pImageId)) {
                    return imageMap[pImageId];
                }
                return pImageId;
            };
        };
        return LwfSettings;
    })();
    LwfPlayer.LwfSettings = LwfSettings;
})(LwfPlayer || (LwfPlayer = {}));
/// <reference path="lwf_player_util.ts"/>
/**
* Created by tdoe on 5/6/14.
*
* this class is LwfPlayer.Player setting definition.
*
* renderer
*  "canvas" or "csswebkit" or "webgl"
*
* debug
*  true or false
*
* targetStage
*  append the LWF animation rendering element.
*/
var LwfPlayer;
(function (LwfPlayer) {
    /**
    * @type {Object}
    * @const
    */
    var PlayerSettings = (function () {
        function PlayerSettings() {
            var _this = this;
            /**
            * check this instance status.
            */
            this.validationPlayerSettings = function () {
                if (LwfPlayer.Util.isEmpty(_this.targetStage)) {
                    throw new Error("targetStage property is need HTMLElement");
                }
            };
        }

        Object.defineProperty(PlayerSettings.prototype, "renderer", {
            /**
            * @const
            * @returns {string}
            */
            get: function () {
                return this._renderer;
            },
            /**
            * @const
            * @param renderer
            */
            set: function (renderer) {
                this._renderer = renderer;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(PlayerSettings.prototype, "isDebugMode", {
            /**
            * @const
            * @returns {boolean}
            */
            get: function () {
                return this._isDebugMode;
            },
            /**
            * @const
            * @param isDebugMode
            */
            set: function (isDebugMode) {
                this._isDebugMode = isDebugMode;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(PlayerSettings.prototype, "targetStage", {
            /**
            * @const
            * @returns {HTMLElement}
            */
            get: function () {
                return this._targetStage;
            },
            /**
            * @const
            * @param targetStage
            */
            set: function (targetStage) {
                this._targetStage = targetStage;
            },
            enumerable: true,
            configurable: true
        });
        return PlayerSettings;
    })();
    LwfPlayer.PlayerSettings = PlayerSettings;
})(LwfPlayer || (LwfPlayer = {}));
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
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    /**
    * @type {LwfPlayer.Player}
    * @const
    */
    var Player = (function () {
        /**
        * initialize this Player.
        *
        * @param playerSettings Require targetStage:HTMLElement.
        * @param lwfSettings    Require lwf:load LWF path.
        */
        function Player(playerSettings, lwfSettings) {
            var _this = this;
            // fromTime LWF members.
            this._lwf = null;
            this._cache = null;
            // LwfPlayer module classes members.
            this._playerSettings = null;
            this._lwfSettings = new LwfPlayer.LwfSettings();
            this._stageContractor = null;
            this._coordinator = null;
            this._rendererSelector = new LwfPlayer.RendererSelector();
            // this class only members.
            this._inputQueue = [];
            this._fromTime = global.performance.now();
            this._pausing = false;
            this._goPlayBack = false;
            this._destroyed = false;
            this._goRestart = false;
            /**
            * load and play LWF.
            */
            this.play = function () {
                _this.initStage();
                _this.initLwf();

                _this._lwfSettings.prepareLwfSettings(_this);

                _this._cache.loadLWF(_this._lwfSettings);
            };
            /**
            * stop lwf animation.
            */
            this.pause = function () {
                _this._pausing = true;
            };
            /**
            * start lwf animation fromTime pause state.
            */
            this.resume = function () {
                _this._pausing = false;
            };
            /**
            * LWF play back from beginning.
            */
            this.playBack = function () {
                _this._goPlayBack = true;
            };
            /**
            * Restart LWF by same player instance.
            * using same stage and renderer.
            *
            * @param lwfSettings
            */
            this.reStart = function (lwfSettings) {
                _this._goRestart = true;

                _this.setSettingsAndValidation(_this._playerSettings, lwfSettings);

                _this._lwfSettings.prepareLwfSettings(_this);
                _this._cache.loadLWF(_this._lwfSettings);
            };
            /**
            * Caution! stop animation, and destroy LWF instance .
            */
            this.destroy = function () {
                _this._destroyed = true;
            };
            /**
            * handle load error.
            * can run the error handler that was passed.
            * It is recommended to pass handler["loadError"] function.
            */
            this.handleLoadError = function () {
                if (_this._lwfSettings.handler && _this._lwfSettings.handler["loadError"] instanceof Function) {
                    _this._lwfSettings.handler["loadError"](_this._lwfSettings.error);
                }
                console.error("[LWF] load error: %o", _this._lwfSettings.error);
            };
            /**
            * handle exception.
            * can run the Exception handler that was passed.
            * It is recommended to pass handler["exception"] function.
            *
            * @param exception
            */
            this.handleException = function (exception) {
                if (_this._lwfSettings.handler && _this._lwfSettings.handler["exception"] instanceof Function) {
                    _this._lwfSettings.handler["exception"](exception);
                }
                console.error("[LWF] load Exception: %o", exception);
            };
            /**
            * exec LWF rendering, and dispatch events.
            * It is loop by requestAnimationFrame.
            */
            this.exec = function () {
                try  {
                    if (_this._goRestart) {
                        _this._goRestart = false;
                        return;
                    }

                    if (_this._destroyed) {
                        _this.destroyLwf();
                        return;
                    }

                    if (_this._goPlayBack) {
                        _this._goPlayBack = false;
                        _this._lwf.init();
                    }

                    if (LwfPlayer.Util.isNotEmpty(_this._lwf) && !_this._pausing) {
                        for (var i = 0; i < _this._inputQueue.length; i++) {
                            _this._inputQueue[i].apply(_this);
                        }
                        _this._stageContractor.changeStageSize(_this._lwf.width, _this._lwf.height);
                        _this.renderLwf();
                    }
                    _this._inputQueue = [];
                    global.requestAnimationFrame(function () {
                        _this.exec();
                    });
                } catch (e) {
                    _this.handleException(e);
                }
            };
            /**
            * initialize LWF animation screen stage, and coordinate class.
            */
            this.initStage = function () {
                _this._stageContractor = new LwfPlayer.StageContractor(_this);
                _this._stageContractor.createScreenStage(_this._rendererSelector);
                _this._stageContractor.createEventReceiveStage();
                _this._stageContractor.addEventListeners();
                _this._coordinator = new LwfPlayer.Coordinator(_this._stageContractor);
            };
            /**
            * Initialize LWF resources.
            * select LWF renderer, and get LWF resource cache.
            */
            this.initLwf = function () {
                try  {
                    switch (_this._rendererSelector.renderer) {
                        case LwfPlayer.RendererName[0 /* useCanvasRenderer */]:
                            global.LWF.useCanvasRenderer();
                            break;

                        case LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */]:
                            global.LWF.useWebkitCSSRenderer();
                            break;

                        case LwfPlayer.RendererName[2 /* useWebGLRenderer */]:
                            global.LWF.useWebGLRenderer();
                            break;

                        default:
                            throw new Error("not supported renderer");
                    }

                    _this._cache = global.LWF.ResourceCache.get();
                } catch (e) {
                    _this.handleException(e);
                }
            };
            /**
            * Call LWF rendering processes.
            */
            this.renderLwf = function () {
                var stageWidth = _this._stageContractor.screenStageWidth;
                var stageHeight = _this._stageContractor.screenStageHeight;
                var toTime = global.performance.now();
                var tickTack = (toTime - _this._fromTime) / 1000;
                _this._fromTime = toTime;

                _this._lwf.property.clear();

                if (_this._lwfSettings.fitForWidth) {
                    _this._lwf.fitForWidth(stageWidth, stageHeight);
                } else {
                    _this._lwf.fitForHeight(stageWidth, stageHeight);
                }

                if (_this.rendererSelector.renderer === LwfPlayer.RendererName[1 /* useWebkitCSSRenderer */]) {
                    _this._lwf.setTextScale(_this.stageContractor.devicePixelRatio);
                }

                _this._lwf.property.moveTo(0, 0);
                _this._lwf.exec(tickTack);
                _this._lwf.render();

                if (_this._playerSettings.isDebugMode) {
                    _this._stageContractor.viewDebugInfo();
                }
            };
            /**
            * destroy LWF resource and remove event listener.
            */
            this.destroyLwf = function () {
                if (LwfPlayer.Util.isNotEmpty(_this._lwf)) {
                    _this._stageContractor.removeEventListeners();
                    _this._lwf.destroy();
                    _this._cache = null;
                    _this._lwf = null;

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
            this.setSettingsAndValidation = function (playerSettings, lwfSettings) {
                if (LwfPlayer.Util.isEmpty(playerSettings) || LwfPlayer.Util.isEmpty(lwfSettings)) {
                    throw new Error("not enough argument.");
                }

                if (!(playerSettings instanceof LwfPlayer.PlayerSettings) || !(lwfSettings instanceof LwfPlayer.LwfSettings)) {
                    throw new TypeError("require PlayerSettings instance and LwfSettings instance. ex sample/sample1/index.html");
                }

                _this._playerSettings = playerSettings;
                _this._playerSettings.validationPlayerSettings();

                _this._lwfSettings = lwfSettings;
                _this._lwfSettings.validationLwfSettings();
            };
            /**
            * pass the coordinates to LWF from mouse or touch event.
            *
            * @param e
            */
            this.inputPoint = function (e) {
                _this._coordinator.setCoordinate(e);
                _this._lwf.inputPoint(_this._coordinator.x, _this._coordinator.y);
            };
            /**
            * pass the coordinates and input to LWF from mouse or touch event.
            *
            * @param e
            */
            this.inputPress = function (e) {
                _this.inputPoint(e);
                _this._lwf.inputPress();
            };
            /**
            * push queue the mouse or touch coordinates.
            *
            * @param e
            */
            this.onMove = function (e) {
                _this._inputQueue.push(function () {
                    this.inputPoint(e);
                });
            };
            /**
            * push queue the press by mouse or touch coordinates.
            *
            * @param e
            */
            this.onPress = function (e) {
                _this._inputQueue.push(function () {
                    this.inputPress(e);
                });
            };
            /**
            * push queue the release by mouse or touch coordinates.
            *
            * @param e
            */
            this.onRelease = function (e) {
                _this._inputQueue.push(function () {
                    this._lwf.inputRelease();
                });
            };
            /**
            * onload call back by LWF.
            *
            * @param lwf
            */
            this.onLoad = function (lwf) {
                if (LwfPlayer.Util.isNotEmpty(lwf)) {
                    _this._lwf = lwf;
                    _this.exec();
                } else {
                    _this.handleLoadError();
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
            this.loadLWF = function (lwf, lwfName, imageMap, privateData, callback) {
                var childSettings = LwfPlayer.LwfLoader.prepareChildLwfSettings(lwf, lwfName, imageMap, privateData, _this._lwfSettings);
                childSettings.onload = function (childLwf) {
                    if (LwfPlayer.Util.isEmpty(childLwf)) {
                        this.handleLoadError();
                        return callback(childSettings["error"], childLwf);
                    }
                    return callback(null, childLwf);
                };

                _this._cache.loadLWF(childSettings);
            };
            this.setSettingsAndValidation(playerSettings, lwfSettings);
            this._rendererSelector.renderer = this._playerSettings.renderer;
        }
        Object.defineProperty(Player.prototype, "coordinator", {
            /**
            * return player using LwfPlayer.Coordinator instance.
            *
            * @returns LwfPlayer.Coordinator
            */
            get: function () {
                return this._coordinator;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Player.prototype, "playerSettings", {
            /**
            * return player using LwfPlayer.PlayerSettings instance.
            *
            * @returns LwfPlayer.PlayerSettings
            */
            get: function () {
                return this._playerSettings;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Player.prototype, "lwfSettings", {
            /**
            * return player using LwfPlayer.LwfSettings instance.
            *
            * @returns LwfPlayer.LwfSettings
            */
            get: function () {
                return this._lwfSettings;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Player.prototype, "rendererSelector", {
            /**
            * return player using LwfPlayer.RendererSelector instance.
            *
            * @returns LwfPlayer.RendererSelector
            */
            get: function () {
                return this._rendererSelector;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Player.prototype, "stageContractor", {
            /**
            * return player using LwfPlayer.StageContractor instance.
            *
            * @returns LwfPlayer.StageContractor
            */
            get: function () {
                return this._stageContractor;
            },
            enumerable: true,
            configurable: true
        });
        return Player;
    })();
    LwfPlayer.Player = Player;
})(LwfPlayer || (LwfPlayer = {}));
//# sourceMappingURL=lwf_player.js.map
