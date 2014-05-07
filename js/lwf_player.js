
var LwfPlayer;
(function (LwfPlayer) {
    "use strict";

    var Util = (function () {
        function Util() {
        }
        Util.initUtil = function () {
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
            this.useWebGL = false;
            this.renderer = this.autoSelectRenderer_();
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

        RendererSelector.prototype.autoSelectRenderer_ = function () {
            var userAgent = LwfPlayer.Util.ua;
            if (this.useWebGL) {
                var canvas = document.createElement("canvas");
                var contextNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
                var ctx;

                for (var i = 0; i < contextNames.length; i++) {
                    ctx = canvas.getContext(contextNames[i]);
                    if (ctx) {
                        return RendererSelector.webGLRenderer;
                    }
                }
            }

            if (/iP(ad|hone|od).*OS 4/.test(userAgent)) {
                return RendererSelector.webkitCSSRenderer;
            }

            if (/Android 2\.1/.test(userAgent) || /Android 2\.3\.[5-7]/.test(userAgent)) {
                return RendererSelector.webkitCSSRenderer;
            }

            if (/Android 4/.test(userAgent)) {
                if (/Chrome/.test(userAgent)) {
                    return RendererSelector.canvasRenderer;
                } else {
                    return RendererSelector.webkitCSSRenderer;
                }
            }

            return RendererSelector.canvasRenderer;
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

            this.eventStage = document.createElement("div");
            this.targetStage.appendChild(this.eventStage);

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

            this.screenStage.style.width = stageStyleWidth + "px";
            this.screenStage.style.height = stageStyleHeight + "px";

            this.screenStage.setAttribute("width", stageWidth + "");
            this.screenStage.setAttribute("height", stageHeight + "");
        };

        StageContractor.prototype.removeEventListeners = function () {
            if (LwfPlayer.Util.isTouchEventEnabled) {
                this.screenStage.removeEventListener("touchstart", this.player.onPress, false);
                this.screenStage.removeEventListener("touchmove", this.player.onMove, false);
                this.screenStage.removeEventListener("touchend", this.player.onRelease, false);
            } else {
                this.screenStage.removeEventListener("mousedown", this.player.onPress, false);
                this.screenStage.removeEventListener("mousemove", this.player.onMove, false);
                this.screenStage.removeEventListener("mouseup", this.player.onRelease, false);
            }
        };

        StageContractor.prototype.addEventListeners = function () {
            if (LwfPlayer.Util.isTouchEventEnabled) {
                this.screenStage.addEventListener("touchstart", this.player.onPress, false);
                this.screenStage.addEventListener("touchmove", this.player.onMove, false);
                this.screenStage.addEventListener("touchend", this.player.onRelease, false);
            } else {
                this.screenStage.addEventListener("mousedown", this.player.onPress, false);
                this.screenStage.addEventListener("mousemove", this.player.onMove, false);
                this.screenStage.addEventListener("mouseup", this.player.onRelease, false);
            }
        };

        StageContractor.prototype.createScreenStage = function (rendererSelector) {
            if (rendererSelector.getRenderer() === LwfPlayer.RendererSelector.canvasRenderer || rendererSelector.getRenderer() === LwfPlayer.RendererSelector.webGLRenderer) {
                this.screenStage = document.createElement("canvas");
            } else {
                this.screenStage = document.createElement("div");
            }

            this.screenStage.style.position = "relative";
            this.screenStage.style.top = 0 + "px";
            this.screenStage.style.left = 0 + "px";
            this.screenStage.style.zIndex = this.targetStage.style.zIndex + 1;

            if (rendererSelector.getRenderer() === LwfPlayer.RendererSelector.webkitCSSRenderer && /Android 2\.3\.[5-7]/.test(LwfPlayer.Util.ua) && /SH/.test(LwfPlayer.Util.ua)) {
                this.screenStage.style.opacity = "0.9999";
            }

            this.targetStage.appendChild(this.screenStage);
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
            this.stageContractor = stageContractor;
        }
        Coordinator.prototype.getInputPoint = function (event, isPreventDefaultEnabled) {
            if (isPreventDefaultEnabled) {
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
            this.playerSettings = null;
            this.lwfSettings = null;
            this.stageContractor = null;
            this.coordinator = null;
            this.rendererSelector = new LwfPlayer.RendererSelector();
            this.inputQueue = [];
            this.requests = [];
            this.from = global.performance.now();
            this.isPreventDefaultEnabled = false;
            this.pausing = false;
            this.destroyed = false;
            this.playerSettings = playerSettings;
            this.lwfSettings = lwfSettings;

            this.restraint();
            this.initLwf();

            this.stageContractor = new LwfPlayer.StageContractor(this);
            this.stageContractor.createScreenStage(this.rendererSelector);
            this.coordinator = new LwfPlayer.Coordinator(this.stageContractor);

            this.validateLwfSetting();
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

        Player.prototype.requestLWF = function (onload) {
            this.lwfSettings.onload = onload;
            this.requests.push(this.lwfSettings);
        };

        Player.prototype.loadLWFs = function (onLoadAll) {
            this.cache.loadLWFs(this.requests, onLoadAll);
            this.requests = [];
        };

        Player.prototype.loadLWF = function (lwf, lwfName, imageMap, privateData, callback) {
            for (var i in privateData) {
                if (privateData.hasOwnProperty(i)) {
                    this.lwfSettings.privateData[i] = privateData[i];
                }
            }

            if (privateData.hasOwnProperty("imageMap")) {
                this.lwfSettings.imageMap = this.getImageMapper(privateData["imageMap"]);
            }

            var _this = this;
            this.lwfSettings.onload = function (childLwf) {
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

        Player.prototype.getLwfPath = function (lwfName) {
            if (this.lwfSettings.lwfMap !== void 0 && typeof this.lwfSettings.lwfMap === "object") {
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
        };

        Player.prototype.getImageMapper = function (imageMap) {
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

        Player.prototype.exec = function () {
            var _this = this;
            try  {
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
        };

        Player.prototype.initLwf = function () {
            if (this.playerSettings.renderer !== void 0 || this.playerSettings.renderer !== null) {
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

        Player.prototype.validateLwfSetting = function () {
            if (this.lwfSettings.privateData === void 0) {
                this.lwfSettings.privateData = {};
            }

            if (this.lwfSettings.useBackgroundColor === void 0) {
                this.lwfSettings.useBackgroundColor = true;
            }

            this.lwfSettings.stage = this.stageContractor.getScreenStage();
            this.lwfSettings.imageMap = this.getImageMapper(this.lwfSettings.imageMap);

            if (LwfPlayer.Util.isAndroid) {
                this.lwfSettings.use3D = false;

                if (this.lwfSettings.worker) {
                    this.lwfSettings.worker = LwfPlayer.Util.useWebWorker;
                }
            }

            this.lwfSettings.privateData["lwfLoader"] = this;
        };

        Player.prototype.inputPoint = function (e) {
            var coordinate = this.coordinator.getInputPoint(e, this.isPreventDefaultEnabled);
            this.lwf.inputPoint(coordinate.getX(), coordinate.getY());
        };

        Player.prototype.inputPress = function (e) {
            this.inputPoint(e);
            this.lwf.inputPress();
        };

        Player.prototype.inputRelease = function (e) {
            this.inputPoint(e);
            this.lwf.inputRelease();
        };

        Player.prototype.onMove = function (e) {
            var _this = this;
            this.inputQueue.push(function () {
                _this.inputPoint(e);
            });
        };

        Player.prototype.onPress = function (e) {
            var _this = this;
            this.inputQueue.push(function () {
                _this.inputPress(e);
            });
        };

        Player.prototype.onRelease = function (e) {
            var _this = this;
            this.inputQueue.push(function () {
                _this.inputRelease(e);
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
//# sourceMappingURL=lwf_player.js.map
