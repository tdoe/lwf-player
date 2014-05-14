var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var RendererSelector = (function () {
        function RendererSelector() {
            this.autoSelectRenderer();
        }
        RendererSelector.prototype.getRenderer = function () {
            return this.renderer;
        };

        RendererSelector.prototype.setRenderer = function (playerSettings) {
            if (LwfPlayer.Util.isEmpty(playerSettings.renderer)) {
                this.autoSelectRenderer();
                return;
            }

            switch (playerSettings.renderer) {
                case RendererSelector.canvasRenderer:
                case RendererSelector.webkitCSSRenderer:
                case RendererSelector.webGLRenderer:
                    this.renderer = playerSettings.renderer;
                    break;
                default:
                    throw new Error("unsupported renderer:" + playerSettings.renderer);
            }

            this.autoSelectRenderer();
        };

        RendererSelector.prototype.autoSelectRenderer = function () {
            var canvas = document.createElement("canvas");
            var contextNames = ["webgl", "experimental-webgl"];

            for (var i = 0; i < contextNames.length; i++) {
                if (canvas.getContext(contextNames[i])) {
                    this.renderer = RendererSelector.webGLRenderer;
                    break;
                }
            }

            if (/iP(ad|hone|od).*OS 4/.test(LwfPlayer.Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (/Android 2\.1/.test(LwfPlayer.Util.ua) || /Android 2\.3\.[5-7]/.test(LwfPlayer.Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (/Android 4/.test(LwfPlayer.Util.ua)) {
                if (/Chrome/.test(LwfPlayer.Util.ua)) {
                    this.renderer = RendererSelector.canvasRenderer;
                } else {
                    this.renderer = RendererSelector.webkitCSSRenderer;
                }
            }

            if (LwfPlayer.Util.isEmpty(this.renderer)) {
                this.renderer = RendererSelector.canvasRenderer;
            }
        };
        RendererSelector.webkitCSSRenderer = "useWebkitCSSRenderer";
        RendererSelector.webGLRenderer = "useWebGLRenderer";
        RendererSelector.canvasRenderer = "useCanvasRenderer";
        return RendererSelector;
    })();
    LwfPlayer.RendererSelector = RendererSelector;
})(LwfPlayer || (LwfPlayer = {}));

var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var Util = (function () {
        function Util() {
        }
        Util.forceSettingForAndroid = function (lwfSettings, renderer) {
            lwfSettings.use3D = false;

            if (lwfSettings.worker) {
                lwfSettings.worker = Util.useWebWorker;
            }

            if (/ (SC-0|Galaxy Nexus|SH-0)/.test(Util.ua) && renderer === LwfPlayer.RendererSelector.webkitCSSRenderer) {
                lwfSettings.quirkyClearRect = true;
            }
        };

        Util.getOpacity = function (renderer) {
            if (renderer === LwfPlayer.RendererSelector.webkitCSSRenderer && /Android 2\.3\.[5-7]/.test(Util.ua) && /SH/.test(Util.ua)) {
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
        Util.ua = global.navigator.userAgent;

        Util.isiOS = /iP(ad|hone|od)/.test(Util.ua);

        Util.isAndroid = (/Android/.test(Util.ua));

        Util.isSp = Util.isiOS || Util.isAndroid;

        Util.isChrome = /Chrome/.test(Util.ua);

        Util.isTouchEventEnabled = Util.isSp;

        Util.useWebWorker = !Util.isAndroid || Util.isChrome;

        Util.isPreventDefaultEnabled = Util.isiOS || /Android *(4|3)\..*/.test(Util.ua);
        return Util;
    })();
    LwfPlayer.Util = Util;

    if (Util.isEmpty(global.performance)) {
        global.performance = {};
    }

    global.performance.now = global.performance.now || global.performance.webkitNow || global.performance.mozNow || global.performance.oNow || global.performance.msNow || Date.now;

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

    if (Util.isAndroid && (Util.isChrome || / SC-0/.test(Util.ua))) {
        document.body.addEventListener("touchstart", function () {
        });
    }
})(LwfPlayer || (LwfPlayer = {}));

var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var StageContractor = (function () {
        function StageContractor(player) {
            this.player = null;
            this.targetStage = null;
            this.screenStage = null;
            this.stageScale = 1;
            this.devicePixelRatio = global.devicePixelRatio;
            this.debugInfo = null;
            this.from = global.performance.now();
            this.currentFPS = 0;
            this.execCount = 0;
            this.stageWidth = 0;
            this.stageHeight = 0;
            this.stageStyleWidth = 0;
            this.stageStyleHeight = 0;
            this.player = player;

            this.targetStage = this.player.getPlayerSettings().targetStage;

            if (this.targetStage.style.position === "static" || LwfPlayer.Util.isEmpty(this.targetStage.style.position)) {
                this.targetStage.style.position = "relative";
            }

            if (this.player.getRendererSelector().getRenderer() === LwfPlayer.RendererSelector.webkitCSSRenderer) {
                this.devicePixelRatio = 1;
            }

            if (this.player.getRendererSelector().getRenderer() === LwfPlayer.RendererSelector.webGLRenderer && / F-/.test(LwfPlayer.Util.ua)) {
                this.devicePixelRatio = 2;
            }

            if (LwfPlayer.Util.isEmpty(this.devicePixelRatio)) {
                this.devicePixelRatio = 1;
            }
        }
        StageContractor.prototype.getDevicePixelRatio = function () {
            return this.devicePixelRatio;
        };

        StageContractor.prototype.getStageScale = function () {
            return this.stageScale;
        };

        StageContractor.prototype.getScreenStage = function () {
            return this.screenStage;
        };

        StageContractor.prototype.getScreenStageWidth = function () {
            return +this.screenStage.getAttribute("width");
        };

        StageContractor.prototype.getScreenStageHeight = function () {
            return +this.screenStage.getAttribute("height");
        };

        StageContractor.prototype.changeStageSize = function (width, height) {
            var screenWidth = LwfPlayer.Util.getStageWidth();
            var screenHeight = LwfPlayer.Util.getStageHeight();

            if (width > screenWidth) {
                width = screenWidth;
            }
            if (height > screenHeight) {
                height = screenHeight;
            }

            if (this.player.getLwfSettings().fitForWidth) {
                this.fitForWidth(width, height);
            } else if (this.player.getLwfSettings().fitForHeight) {
                this.fitForHeight(width, height);
            } else {
                this.fitToScreen(width, height);
            }

            this.screenStage.style.width = this.eventReceiveStage.style.width = this.stageStyleWidth + "px";
            this.screenStage.style.height = this.eventReceiveStage.style.height = this.stageStyleHeight + "px";

            this.screenStage.setAttribute("width", this.stageWidth + "");
            this.screenStage.setAttribute("height", this.stageHeight + "");
        };

        StageContractor.prototype.fitForWidth = function (lwfWidth, lwfHeight) {
            this.stageStyleWidth = Math.round(lwfWidth);
            this.stageStyleHeight = Math.round(lwfWidth * lwfHeight / lwfWidth);
            this.setStageWidthAndHeight();
            this.stageScale = this.stageStyleWidth / this.stageWidth;
        };

        StageContractor.prototype.fitForHeight = function (lwfWidth, lwfHeight) {
            this.stageStyleWidth = Math.round(lwfHeight * lwfWidth / lwfHeight);
            this.stageStyleHeight = Math.round(lwfHeight);
            this.setStageWidthAndHeight();
            this.stageScale = this.stageStyleHeight / this.stageHeight;
        };

        StageContractor.prototype.fitToScreen = function (lwfWidth, lwfHeight) {
            var screenWidth = LwfPlayer.Util.getStageWidth();
            var screenHeight = LwfPlayer.Util.getStageHeight();

            var stageRatio = lwfWidth / lwfHeight;
            var screenRatio = screenWidth / screenHeight;

            if (screenRatio > stageRatio) {
                this.stageStyleWidth = lwfWidth * (screenHeight / lwfHeight);
                this.stageStyleHeight = screenHeight;
                this.setStageWidthAndHeight();
                this.stageScale = this.stageStyleWidth / this.stageWidth;
            } else {
                this.stageStyleWidth = screenWidth;
                this.stageStyleHeight = lwfHeight * (screenWidth / lwfWidth);
                this.setStageWidthAndHeight();
                this.stageScale = this.stageStyleHeight / this.stageHeight;
            }
        };

        StageContractor.prototype.setStageWidthAndHeight = function () {
            this.stageWidth = Math.floor(this.stageStyleWidth * this.devicePixelRatio);
            this.stageHeight = Math.floor(this.stageStyleHeight * this.devicePixelRatio);
        };

        StageContractor.prototype.addEventListeners = function () {
            if (LwfPlayer.Util.isTouchEventEnabled) {
                this.eventReceiveStage.addEventListener("touchmove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("touchstart", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("touchend", this.player.onRelease, false);
            } else {
                this.eventReceiveStage.addEventListener("mousedown", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("mousemove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("mouseup", this.player.onRelease, false);
            }
        };

        StageContractor.prototype.removeEventListeners = function () {
            if (LwfPlayer.Util.isTouchEventEnabled) {
                this.eventReceiveStage.removeEventListener("touchstart", this.player.onPress, false);
                this.eventReceiveStage.removeEventListener("touchmove", this.player.onMove, false);
                this.eventReceiveStage.removeEventListener("touchend", this.player.onRelease, false);
            } else {
                this.eventReceiveStage.removeEventListener("mousedown", this.player.onPress, false);
                this.eventReceiveStage.removeEventListener("mousemove", this.player.onMove, false);
                this.eventReceiveStage.removeEventListener("mouseup", this.player.onRelease, false);
            }
        };

        StageContractor.prototype.createScreenStage = function (rendererSelector) {
            if (rendererSelector.getRenderer() === LwfPlayer.RendererSelector.canvasRenderer || rendererSelector.getRenderer() === LwfPlayer.RendererSelector.webGLRenderer) {
                this.screenStage = document.createElement("canvas");
            } else {
                this.screenStage = document.createElement("div");
            }

            var pos = this.player.getLwfSettings().pos;
            if (LwfPlayer.Util.isEmpty(pos)) {
                this.player.getLwfSettings().initPos();
                pos = this.player.getLwfSettings().pos;
            }

            this.screenStage.style.position = pos["position"];
            this.screenStage.style.top = pos["top"] + "px";
            this.screenStage.style.left = pos["left"] + "px";
            this.screenStage.style.zIndex = this.targetStage.style.zIndex + 1;
            this.screenStage.style.opacity = LwfPlayer.Util.getOpacity(rendererSelector.getRenderer());

            this.targetStage.appendChild(this.screenStage);
        };

        StageContractor.prototype.createEventReceiveStage = function () {
            var pos = this.player.getLwfSettings().pos;

            this.eventReceiveStage = document.createElement("div");
            this.eventReceiveStage.style.position = "absolute";
            this.eventReceiveStage.style.top = pos["top"] + "px";
            this.eventReceiveStage.style.left = pos["left"] + "px";
            this.eventReceiveStage.style.zIndex = this.screenStage.style.zIndex + 1;
            this.targetStage.appendChild(this.eventReceiveStage);
        };

        StageContractor.prototype.viewDebugInfo = function () {
            if (LwfPlayer.Util.isEmpty(this.debugInfo)) {
                this.debugInfo = document.createElement("div");
                this.debugInfo.style.position = "absolute";
                this.debugInfo.style.top = "0px";
                this.debugInfo.style.left = "0px";
                this.debugInfo.style.zIndex = "9999";
                this.debugInfo.style.color = "red";
                this.debugInfo.id = "__lwfPlayerDebugInfoID";
                this.targetStage.appendChild(this.debugInfo);
            }

            if (this.execCount % 60 === 0) {
                var _time = global.performance.now();
                this.currentFPS = Math.round(60000.0 / (_time - this.from));
                this.from = _time;
                this.execCount = 0;
            }

            var x = this.player.getCoordinator().getX();
            var y = this.player.getCoordinator().getY();
            var renderer = this.player.getRendererSelector().getRenderer().substring(3);
            renderer = renderer.substring(0, renderer.lastIndexOf("Renderer"));
            this.execCount++;
            this.debugInfo.innerHTML = renderer + " " + this.currentFPS + "fps " + "X:" + x + " Y:" + y + "<br>" + "sw:" + this.stageStyleWidth + " sh:" + this.stageStyleHeight + " w:" + this.stageWidth + " h:" + this.stageHeight + " s:" + this.stageScale + " dpr:" + this.getDevicePixelRatio();
        };
        return StageContractor;
    })();
    LwfPlayer.StageContractor = StageContractor;
})(LwfPlayer || (LwfPlayer = {}));

var LwfPlayer;
(function (LwfPlayer) {
    var Coordinator = (function () {
        function Coordinator(stageContractor) {
            this.x = 0;
            this.y = 0;
            this.isPreventDefaultEnabled = LwfPlayer.Util.isPreventDefaultEnabled;
            this.stageContractor = stageContractor;
        }
        Coordinator.prototype.setIsPreventDefaultEnabled = function (isPreventDefaultEnabled) {
            this.isPreventDefaultEnabled = isPreventDefaultEnabled;
        };

        Coordinator.prototype.setCoordinate = function (event) {
            if (this.isPreventDefaultEnabled) {
                event.preventDefault();
            }

            var stageRect = this.stageContractor.getScreenStage().getBoundingClientRect();
            var stageScale = this.stageContractor.getStageScale();

            if (LwfPlayer.Util.isTouchEventEnabled) {
                this.x = event.touches[0].pageX;
                this.y = event.touches[0].pageY;
            } else {
                this.x = event.clientX;
                this.y = event.clientY;
            }

            this.x -= stageRect.left;
            this.y -= stageRect.top;

            if (LwfPlayer.Util.isSp) {
                this.x -= global.scrollX;
                this.y -= global.scrollY;
            }

            this.x /= stageScale;
            this.y /= stageScale;
        };

        Coordinator.prototype.getX = function () {
            return this.x;
        };

        Coordinator.prototype.getY = function () {
            return this.y;
        };
        return Coordinator;
    })();
    LwfPlayer.Coordinator = Coordinator;
})(LwfPlayer || (LwfPlayer = {}));

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
            lwfSettings.privateData["lwfLoader"] = player;
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
                childSettings.imageMap = LwfPlayer.LwfSettings.getImageMapper(privateData["imageMap"]);
            }

            if (LwfPlayer.Util.isNotEmpty(privateData)) {
                childSettings.privateData = privateData;
            }

            childSettings.fitForHeight = false;
            childSettings.fitForWidth = false;
            childSettings.parentLWF = lwf;
            childSettings.active = false;
            childSettings.lwf = childSettings.getLwfPath(lwfName);
            childSettings.stage = lwfSetting.stage;

            return childSettings;
        };
        return LwfLoader;
    })();
    LwfPlayer.LwfLoader = LwfLoader;
})(LwfPlayer || (LwfPlayer = {}));
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var LwfSettings = (function () {
        function LwfSettings() {
        }
        LwfSettings.prototype.validationLwfSettings = function () {
            if (LwfPlayer.Util.isEmpty(this.lwf)) {
                throw new Error("lwf property is require.");
            }
        };

        LwfSettings.prototype.initPos = function () {
            this.pos = {
                "position": "absolute",
                "top": 0,
                "left": 0
            };
        };

        LwfSettings.prototype.prepareLwfSettings = function (player) {
            if (LwfPlayer.Util.isEmpty(this.privateData)) {
                this.privateData = {};
            }

            if (LwfPlayer.Util.isEmpty(this.useBackgroundColor)) {
                this.useBackgroundColor = true;
            }

            this.stage = player.getStageContractor().getScreenStage();
            this.imageMap = LwfSettings.getImageMapper(this.imageMap);

            if (LwfPlayer.Util.isAndroid) {
                LwfPlayer.Util.forceSettingForAndroid(this, player.getRendererSelector().getRenderer());
            }

            this.onload = player.onLoad;

            LwfPlayer.LwfLoader.setLoader(player, this);
        };

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

        LwfSettings.prototype.getLwfPath = function (lwfName) {
            if (LwfPlayer.Util.isNotEmpty(this.lwfMap)) {
                if (this.lwfMap instanceof Function) {
                    return this.lwfMap(lwfName);
                }

                var path = this.lwfMap[lwfName];
                if (!/\.lwf$/.test(path)) {
                    path += ".lwf";
                }

                return path;
            }

            return LwfPlayer.LwfLoader.getLwfPath(lwfName);
        };
        return LwfSettings;
    })();
    LwfPlayer.LwfSettings = LwfSettings;
})(LwfPlayer || (LwfPlayer = {}));
var LwfPlayer;
(function (LwfPlayer) {
    var PlayerSettings = (function () {
        function PlayerSettings() {
        }
        PlayerSettings.prototype.validationPlayerSettings = function () {
            if (LwfPlayer.Util.isEmpty(this.targetStage)) {
                throw new Error("targetStage property is need HTMLElement");
            }
        };
        return PlayerSettings;
    })();
    LwfPlayer.PlayerSettings = PlayerSettings;
})(LwfPlayer || (LwfPlayer = {}));

var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var Player = (function () {
        function Player(playerSettings, lwfSettings) {
            this.lwf = null;
            this.cache = null;
            this.playerSettings = null;
            this.lwfSettings = new LwfPlayer.LwfSettings();
            this.stageContractor = null;
            this.coordinator = null;
            this.rendererSelector = new LwfPlayer.RendererSelector();
            this.inputQueue = [];
            this.fromTime = global.performance.now();
            this.pausing = false;
            this.goPlayBack = false;
            this.destroyed = false;
            this.goRestart = false;
            this.setSettingsAndValidation(playerSettings, lwfSettings);
            this.rendererSelector.setRenderer(this.playerSettings);
        }
        Player.prototype.play = function () {
            this.restraint();
            this.initStage();
            this.initLwf();

            this.lwfSettings.prepareLwfSettings(this);

            this.cache.loadLWF(this.lwfSettings);
        };

        Player.prototype.pause = function () {
            this.pausing = true;
        };

        Player.prototype.resume = function () {
            this.pausing = false;
        };

        Player.prototype.playBack = function () {
            this.goPlayBack = true;
        };

        Player.prototype.reStart = function (lwfSettings) {
            this.setSettingsAndValidation(this.playerSettings, lwfSettings);

            this.lwfSettings.prepareLwfSettings(this);

            this.goRestart = true;

            this.cache.loadLWF(this.lwfSettings);
        };

        Player.prototype.destroy = function () {
            this.destroyed = true;
        };

        Player.prototype.getCoordinator = function () {
            return this.coordinator;
        };

        Player.prototype.getPlayerSettings = function () {
            return this.playerSettings;
        };

        Player.prototype.getLwfSettings = function () {
            return this.lwfSettings;
        };

        Player.prototype.getRendererSelector = function () {
            return this.rendererSelector;
        };

        Player.prototype.getStageContractor = function () {
            return this.stageContractor;
        };

        Player.prototype.handleLoadError = function () {
            if (this.lwfSettings.handler && this.lwfSettings.handler["loadError"] instanceof Function) {
                this.lwfSettings.handler["loadError"](this.lwfSettings.error);
            }
            console.error("[LWF] load error: %o", this.lwfSettings.error);
        };

        Player.prototype.handleException = function (exception) {
            if (this.lwfSettings.handler && this.lwfSettings.handler["exception"] instanceof Function) {
                this.lwfSettings.handler["exception"](exception);
            }
            console.error("[LWF] load Exception: %o", exception);
        };

        Player.prototype.exec = function () {
            var _this = this;
            try  {
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

                if (LwfPlayer.Util.isNotEmpty(this.lwf) && !this.pausing) {
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
        };

        Player.prototype.initStage = function () {
            this.stageContractor = new LwfPlayer.StageContractor(this);
            this.stageContractor.createScreenStage(this.rendererSelector);
            this.stageContractor.createEventReceiveStage();
            this.stageContractor.addEventListeners();
            this.coordinator = new LwfPlayer.Coordinator(this.stageContractor);
        };

        Player.prototype.initLwf = function () {
            try  {
                switch (this.rendererSelector.getRenderer()) {
                    case LwfPlayer.RendererSelector.canvasRenderer:
                        global.LWF.useCanvasRenderer();
                        break;

                    case LwfPlayer.RendererSelector.webkitCSSRenderer:
                        global.LWF.useWebkitCSSRenderer();
                        break;

                    case LwfPlayer.RendererSelector.webGLRenderer:
                        global.LWF.useWebGLRenderer();
                        break;

                    default:
                        throw new Error("not supported renderer");
                }

                this.cache = global.LWF.ResourceCache.get();
            } catch (e) {
                this.handleException(e);
            }
        };

        Player.prototype.renderLwf = function () {
            var stageWidth = this.stageContractor.getScreenStageWidth();
            var stageHeight = this.stageContractor.getScreenStageHeight();
            var toTime = global.performance.now();
            var tickTack = (toTime - this.fromTime) / 1000;
            this.fromTime = toTime;

            this.lwf.property.clear();

            if (this.lwfSettings.fitForWidth) {
                this.lwf.fitForWidth(stageWidth, stageHeight);
            } else {
                this.lwf.fitForHeight(stageWidth, stageHeight);
            }

            if (this.getRendererSelector().getRenderer() === LwfPlayer.RendererSelector.webkitCSSRenderer) {
                this.lwf.setTextScale(this.getStageContractor().getDevicePixelRatio());
            }

            this.lwf.property.moveTo(0, 0);
            this.lwf.exec(tickTack);
            this.lwf.render();

            if (this.playerSettings.debug) {
                this.stageContractor.viewDebugInfo();
            }
        };

        Player.prototype.destroyLwf = function () {
            if (LwfPlayer.Util.isNotEmpty(this.lwf)) {
                this.stageContractor.removeEventListeners();
                this.lwf.destroy();
                this.cache = null;
                this.lwf = null;

                console.log("destroy LWF.");
            }
            console.log("LWF is destroyed.");
        };

        Player.prototype.setSettingsAndValidation = function (playerSettings, lwfSettings) {
            if (LwfPlayer.Util.isEmpty(playerSettings) || LwfPlayer.Util.isEmpty(lwfSettings)) {
                throw new Error("not enough argument.");
            }

            if (!(playerSettings instanceof LwfPlayer.PlayerSettings) || !(lwfSettings instanceof LwfPlayer.LwfSettings)) {
                throw new TypeError("require PlayerSettings instance and LwfSettings instance. ex sample/sample1/index.html");
            }

            this.playerSettings = playerSettings;
            this.playerSettings.validationPlayerSettings();

            this.lwfSettings = lwfSettings;
            this.lwfSettings.validationLwfSettings();
        };

        Player.prototype.inputPoint = function (e) {
            this.coordinator.setCoordinate(e);
            this.lwf.inputPoint(this.coordinator.getX(), this.coordinator.getY());
        };

        Player.prototype.inputPress = function (e) {
            this.inputPoint(e);
            this.lwf.inputPress();
        };

        Player.prototype.onMove = function (e) {
            this.inputQueue.push(function () {
                this.inputPoint(e);
            });
        };

        Player.prototype.onPress = function (e) {
            this.inputQueue.push(function () {
                this.inputPress(e);
            });
        };

        Player.prototype.onRelease = function (e) {
            this.inputQueue.push(function () {
                this.lwf.inputRelease();
            });
        };

        Player.prototype.onLoad = function (lwf) {
            if (LwfPlayer.Util.isNotEmpty(lwf)) {
                this.lwf = lwf;
                this.exec();
            } else {
                this.handleLoadError();
            }
        };

        Player.prototype.restraint = function () {
            var __bind = function (fn, me) {
                return function () {
                    fn.apply(me, arguments);
                };
            };

            this.onRelease = __bind(this.onRelease, this);
            this.onPress = __bind(this.onPress, this);
            this.onMove = __bind(this.onMove, this);
            this.onLoad = __bind(this.onLoad, this);
        };

        Player.prototype.loadLWF = function (lwf, lwfName, imageMap, privateData, callback) {
            var childSettings = LwfPlayer.LwfLoader.prepareChildLwfSettings(lwf, lwfName, imageMap, privateData, this.lwfSettings);
            var _this = this;
            childSettings.onload = function (childLwf) {
                if (LwfPlayer.Util.isEmpty(childLwf)) {
                    _this.handleLoadError();
                    return callback(childSettings["error"], childLwf);
                }
                return callback(null, childLwf);
            };

            this.cache.loadLWF(childSettings);
        };
        return Player;
    })();
    LwfPlayer.Player = Player;
})(LwfPlayer || (LwfPlayer = {}));
