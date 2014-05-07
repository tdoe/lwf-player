
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var Util = (function () {
        function Util() {
        }
        Util.initUtil = function () {
            if (typeof global.performance === "undefined") {
                global.performance = {};
            }
            global.performance.now = global.performance.now || global.performance.webkitNow || global.performance.mozNow || global.performance.oNow || global.performance.msNow || Date.now;

            global.requestAnimationFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame;

            if (global.requestAnimationFrame === void 0 || /iP(ad|hone|od).*OS 6/.test(Util.ua)) {
                var vSync = 1000 / 60;
                var t0 = global.performance.now();

                global.requestAnimationFrame = function (callback) {
                    var t1 = global.performance.now();
                    var duration = t1 - t0;
                    var d = vSync - ((duration > vSync) ? duration % vSync : duration);

                    return setTimeout(function () {
                        t0 = global.performance.now();
                        callback();
                    }, d);
                };
            }
        };
        Util.ua = navigator.userAgent;

        Util.isiOS = /iP(ad|hone|od)/.test(Util.ua);

        Util.isAndroid = (/Android/.test(Util.ua));

        Util.isSp = Util.isiOS || Util.isAndroid;

        Util.isChrome = /Chrome/.test(Util.ua);

        Util.isTouchEventEnabled = Util.isSp;

        Util.useWebWorker = !Util.isAndroid || Util.isChrome;

        Util.debugInfoElementId = 0;
        return Util;
    })();
    LwfPlayer.Util = Util;
})(LwfPlayer || (LwfPlayer = {}));
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var RendererSelector = (function () {
        function RendererSelector() {
            this.autoSelectRenderer();
        }
        RendererSelector.prototype.getDevicePixelRatio = function () {
            var devicePixelRatio = window.devicePixelRatio;

            if (this.renderer === RendererSelector.webkitCSSRenderer) {
                devicePixelRatio = 1;
            }

            if (this.renderer === RendererSelector.webGLRenderer && / F-/.test(LwfPlayer.Util.ua)) {
                devicePixelRatio = 2;
            }

            return devicePixelRatio;
        };

        RendererSelector.prototype.getRenderer = function () {
            return this.renderer;
        };

        RendererSelector.prototype.setRenderer = function (rendererName) {
            this.renderer = RendererSelector.canvasRenderer;

            if (rendererName === RendererSelector.rendererWebkitCSS) {
                this.renderer = RendererSelector.webkitCSSRenderer;
            } else if (rendererName === RendererSelector.rendererWebGL) {
                this.renderer = RendererSelector.webGLRenderer;
            }
        };

        RendererSelector.prototype.autoSelectRenderer = function () {
            var canvas = document.createElement("canvas");
            var contextNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];

            for (var i = 0; i < contextNames.length; i++) {
                if (canvas.getContext(contextNames[i])) {
                    this.renderer = RendererSelector.webGLRenderer;
                    return;
                }
            }

            if (/iP(ad|hone|od).*OS 4/.test(LwfPlayer.Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
                return;
            }

            if (/Android 2\.1/.test(LwfPlayer.Util.ua) || /Android 2\.3\.[5-7]/.test(LwfPlayer.Util.ua)) {
                this.renderer = RendererSelector.webkitCSSRenderer;
                return;
            }

            if (/Android 4/.test(LwfPlayer.Util.ua)) {
                if (/Chrome/.test(LwfPlayer.Util.ua)) {
                    this.renderer = RendererSelector.canvasRenderer;
                    return;
                } else {
                    this.renderer = RendererSelector.webkitCSSRenderer;
                    return;
                }
            }

            this.renderer = RendererSelector.canvasRenderer;
        };
        RendererSelector.webkitCSSRenderer = "useWebkitCSSRenderer";
        RendererSelector.webGLRenderer = "useWebGLRenderer";
        RendererSelector.canvasRenderer = "useCanvasRenderer";

        RendererSelector.rendererWebkitCSS = "webkitcss";
        RendererSelector.rendererWebGL = "webgl";
        RendererSelector.rendererCanvas = "canvas";
        return RendererSelector;
    })();
    LwfPlayer.RendererSelector = RendererSelector;
})(LwfPlayer || (LwfPlayer = {}));
var LwfPlayer;
(function (LwfPlayer) {
    var StageContractor = (function () {
        function StageContractor(player) {
            this.player = null;
            this.targetStage = null;
            this.screenStage = null;
            this.stageScale = 1;
            this.debugInfo = null;
            this.from = global.performance.now();
            this.currentFPS = 0;
            this.execCount = 0;
            this.player = player;

            this.targetStage = this.player.getPlayerSettings().targetStage;
            if (this.targetStage === void 0 || this.targetStage === null) {
                throw new Error();
            }

            if (this.targetStage.style.position === "static" || this.targetStage.style.position === "") {
                this.targetStage.style.position = "relative";
            }

            this.devicePixelRatio = this.player.getRendererSelector().getDevicePixelRatio();
        }
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
            var stageStyleWidth = 0;
            var stageStyleHeight = 0;
            var stageWidth = ~~width * this.devicePixelRatio;
            var stageHeight = ~~height * this.devicePixelRatio;

            if (LwfPlayer.Util.isAndroid) {
                if (global.innerWidth > global.screen.width) {
                    stageWidth = global.screen.width;
                }
                if (global.innerHeight > global.screen.height) {
                    stageHeight = global.screen.height;
                }
            }

            if (width > global.innerWidth) {
                width = global.innerWidth;
            }
            if (height > global.innerHeight) {
                height = global.innerHeight;
            }

            if (this.player.getLwfSettings().fitForWidth) {
                stageStyleWidth = Math.round(width);
                stageStyleHeight = Math.round(width * height / width);
                this.stageScale = stageStyleWidth / stageWidth;
            } else {
                stageStyleWidth = Math.round(height * width / height);
                stageStyleHeight = Math.round(height);
                this.stageScale = stageStyleHeight / stageHeight;
            }

            this.screenStage.style.width = this.eventReceiveStage.style.width = stageStyleWidth + "px";
            this.screenStage.style.height = this.eventReceiveStage.style.height = stageStyleHeight + "px";

            this.screenStage.setAttribute("width", stageWidth + "");
            this.screenStage.setAttribute("height", stageHeight + "");
            this.eventReceiveStage.setAttribute("width", stageWidth + "");
            this.eventReceiveStage.setAttribute("height", stageHeight + "");
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

        StageContractor.prototype.addEventListeners = function () {
            if (LwfPlayer.Util.isTouchEventEnabled) {
                if (LwfPlayer.Util.isAndroid && (LwfPlayer.Util.isChrome || / SC-0/.test(LwfPlayer.Util.ua))) {
                    document.body.addEventListener("touchstart", function () {
                    });
                }
                this.eventReceiveStage.addEventListener("touchstart", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("touchmove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("touchend", this.player.onRelease, false);
            } else {
                this.eventReceiveStage.addEventListener("mousedown", this.player.onPress, false);
                this.eventReceiveStage.addEventListener("mousemove", this.player.onMove, false);
                this.eventReceiveStage.addEventListener("mouseup", this.player.onRelease, false);
            }
        };

        StageContractor.prototype.createScreenStage = function (rendererSelector) {
            if (rendererSelector.getRenderer() === LwfPlayer.RendererSelector.canvasRenderer || rendererSelector.getRenderer() === LwfPlayer.RendererSelector.webGLRenderer) {
                this.screenStage = document.createElement("canvas");
            } else {
                this.screenStage = document.createElement("div");
            }

            var pos = this.player.getLwfSettings().pos;

            this.screenStage.style.position = pos["position"];
            this.screenStage.style.top = pos["top"] + "px";
            this.screenStage.style.left = pos["left"] + "px";
            this.screenStage.style.zIndex = this.targetStage.style.zIndex + 1;

            if (rendererSelector.getRenderer() === LwfPlayer.RendererSelector.webkitCSSRenderer && /Android 2\.3\.[5-7]/.test(LwfPlayer.Util.ua) && /SH/.test(LwfPlayer.Util.ua)) {
                this.screenStage.style.opacity = "0.9999";
            }

            this.targetStage.appendChild(this.screenStage);

            if (LwfPlayer.Util.isSp) {
                this.eventReceiveStage = document.createElement("div");
                this.eventReceiveStage.style.position = "absolute";
                this.eventReceiveStage.style.top = pos["top"] + "px";
                this.eventReceiveStage.style.left = pos["left"] + "px";
                this.eventReceiveStage.style.zIndex = this.screenStage.style.zIndex + 1;
                this.targetStage.appendChild(this.eventReceiveStage);
            } else {
                this.eventReceiveStage = this.targetStage;
            }
        };

        StageContractor.prototype.viewDebugInfo = function () {
            if (this.debugInfo === null) {
                this.debugInfo = document.createElement("div");
                this.debugInfo.style.position = "absolute";
                this.debugInfo.style.top = "0px";
                this.debugInfo.style.left = "0px";
                this.debugInfo.style.zIndex = "9999";
                this.debugInfo.style.color = "red";
                this.debugInfo.className = "lwfPlayerDebugInfo";
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
            this.execCount++;
            this.debugInfo.innerHTML = this.player.getRendererSelector().getRenderer() + " " + this.currentFPS + "fps " + "X:" + x + " Y:" + y;
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
            this.isPreventDefaultEnabled = LwfPlayer.Util.isiOS || /Android *(4|3)\..*/.test(LwfPlayer.Util.ua);
            this.stageContractor = stageContractor;
        }
        Coordinator.prototype.setIsPreventDefaultEnabled = function (isPreventDefaultEnabled) {
            this.isPreventDefaultEnabled = isPreventDefaultEnabled;
        };

        Coordinator.prototype.getInputPoint = function (event) {
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

            return this;
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

    var LwfSettings = (function () {
        function LwfSettings() {
        }
        LwfSettings.prototype.prepareLwfSettings = function (player, lwfSettings) {
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

            if (LwfPlayer.Util.isAndroid) {
                this.use3D = false;

                if (this.worker) {
                    this.worker = LwfPlayer.Util.useWebWorker;
                }

                if (/ (SC-0|Galaxy Nexus|SH-0)/.test(LwfPlayer.Util.ua) && player.getRendererSelector().getRenderer() === LwfPlayer.RendererSelector.webkitCSSRenderer) {
                    this.quirkyClearRect = true;
                }
            }

            this.privateData["lwfLoader"] = player;
        };

        LwfSettings.prototype.prepareChildLwfSettings = function (lwf, lwfName, privateData) {
            for (var i in privateData) {
                if (privateData.hasOwnProperty(i)) {
                    this.privateData[i] = privateData[i];
                }
            }

            if (privateData.hasOwnProperty("imageMap")) {
                this.imageMap = this.getImageMapper(privateData["imageMap"]);
            }

            this.fitForHeight = false;
            this.fitForWidth = false;
            this.parentLWF = lwf;
            this.active = false;
            this.lwf = this.getLwfPath(lwfName);
        };

        LwfSettings.prototype.getImageMapper = function (imageMap) {
            if (typeof imageMap == "function") {
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
        };
        return LwfSettings;
    })();
    LwfPlayer.LwfSettings = LwfSettings;
})(LwfPlayer || (LwfPlayer = {}));
var LwfPlayer;
(function (LwfPlayer) {
    var PlayerSettings = (function () {
        function PlayerSettings() {
            this.renderer = "canvas";
            this.debug = true;
            this.targetStage = null;
        }
        return PlayerSettings;
    })();
    LwfPlayer.PlayerSettings = PlayerSettings;
})(LwfPlayer || (LwfPlayer = {}));

var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    LwfPlayer.Util.initUtil();

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
            this.requests = [];
            this.from = global.performance.now();
            this.pausing = false;
            this.destroyed = false;
            this.playerSettings = playerSettings;
            this.lwfSettings.prepareLwfSettings(this, lwfSettings);
            this.stageContractor = new LwfPlayer.StageContractor(this);
            this.stageContractor.createScreenStage(this.rendererSelector);
            this.coordinator = new LwfPlayer.Coordinator(this.stageContractor);
            this.lwfSettings.stage = this.stageContractor.getScreenStage();

            this.restraint();
            this.initLwf();
        }
        Player.prototype.play = function () {
            var _this = this;
            this.stageContractor.addEventListeners();
            this.requestLWF(function (_lwf) {
                _this.lwf = _lwf;
            });
            this.loadLWFs(function (errors) {
                if (errors === null) {
                    _this.exec();
                } else {
                    _this.handleLoadError();
                }
            });
        };

        Player.prototype.pause = function () {
            this.pausing = true;
        };

        Player.prototype.resume = function () {
            this.pausing = false;
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

        Player.prototype.requestLWF = function (onload) {
            this.lwfSettings.onload = onload;
            this.requests.push(this.lwfSettings);
        };

        Player.prototype.loadLWFs = function (onLoadAll) {
            this.cache.loadLWFs(this.requests, onLoadAll);
            this.requests = [];
        };

        Player.prototype.loadLWF = function (lwf, lwfName, imageMap, privateData, callback) {
            this.lwfSettings.prepareChildLwfSettings(lwf, lwfName, privateData);

            var _this = this;
            this.lwfSettings.onload = function (childLwf) {
                if (!childLwf) {
                    _this.handleLoadError();
                    return callback(this.lwfSettings["error"], childLwf);
                }
                return callback(null, childLwf);
            };

            this.cache.loadLWF(this.lwfSettings);
        };

        Player.prototype.handleLoadError = function () {
            if (this.lwfSettings.handler && typeof this.lwfSettings.handler["loadError"] === "function") {
                this.lwfSettings.handler["loadError"](this.lwfSettings.error);
            }
            console.error("[LWF] load error: %o", this.lwfSettings.error);
        };

        Player.prototype.handleException = function (exception) {
            if (this.lwfSettings.handler && typeof this.lwfSettings.handler["exception"] === "function") {
                this.lwfSettings.handler["exception"](exception);
            }
            console.error("[LWF] load Exception: %o", exception);
        };

        Player.prototype.exec = function () {
            var _this = this;
            try  {
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
        };

        Player.prototype.initLwf = function () {
            if (this.playerSettings.renderer !== void 0 && this.playerSettings.renderer !== null) {
                this.rendererSelector.setRenderer(this.playerSettings.renderer);
            }

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
        };

        Player.prototype.destroyLwf = function () {
            if (this.lwf !== null) {
                this.stageContractor.removeEventListeners();
                this.lwf.destroy();
                this.cache = null;
                this.lwf = null;

                console.log("destroy LWF.");
            }
            console.log("LWF is destroyed.");
        };

        Player.prototype.inputPoint = function (e) {
            var coordinate = this.coordinator.getInputPoint(e);
            this.lwf.inputPoint(coordinate.getX(), coordinate.getY());
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

        Player.prototype.restraint = function () {
            var __bind = function (fn, me) {
                return function () {
                    fn.apply(me, arguments);
                };
            };

            this.onRelease = __bind(this.onRelease, this);
            this.onPress = __bind(this.onPress, this);
            this.onMove = __bind(this.onMove, this);
        };
        return Player;
    })();
    LwfPlayer.Player = Player;
})(LwfPlayer || (LwfPlayer = {}));
