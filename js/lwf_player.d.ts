/// <reference path="../src/lib/params.d.ts" />
/// <reference path="../src/lib/lwf.d.ts" />
/**
* Created by tdoe on 5/4/14.
*
* This class handling for LWF-Renderer choice.
* will be cross-browser countermeasure.
*
* @type {Object}
* @const
*/
declare module LwfPlayer {
    /**
    * @type {LwfPlayer.RendererName}
    * @const
    */
    enum RendererName {
        useCanvasRenderer = 0,
        useWebkitCSSRenderer = 1,
        useWebGLRenderer = 2,
    }
}
/**
* Created by tdoe on 5/4/14.
*
* This class handling for LWF-Renderer choice.
* will be cross-browser countermeasure.
*/
declare module LwfPlayer {
    /**
    * @type {LwfPlayer.RendererSelector}
    * @const
    */
    class RendererSelector {
        private _renderer;
        constructor();
        /**
        * get current renderer
        *
        * @returns {string}
        */
        /**
        * set renderer name.
        * can use it only three types.
        * auto-select the optimal renderer set after.
        *
        * @param renderer
        */
        public renderer : string;
        /**
        * detects if current environment is WebGL capable.
        * auto-select the optimal renderer set after.
        * use canvas-renderer when set renderer nothing.
        */
        private autoSelectRenderer;
    }
}
/**
* Created by tdoe on 5/5/14.
*
* This class is for utility and Cross browser polyfills.
*/
declare module LwfPlayer {
    class Util {
        /**
        * current useragent
        */
        static ua: any;
        /**
        * Whether currently running on iOS
        */
        static isiOS: boolean;
        /**
        * Whether currently running on Android
        */
        static isAndroid: boolean;
        /**
        * Whether currently running on SP
        */
        static isSp: boolean;
        /**
        * Whether currently running on Chrome
        */
        static isChrome: boolean;
        /**
        * Whether touch event is enabled, by default this refers whether currently running on SP
        */
        static isTouchEventEnabled: boolean;
        /**
        * Turn off Web Worker on Android native browser, allow it runs on Android Chrome
        */
        static useWebWorker: boolean;
        /**
        * isPreventDefaultEnabled flag
        */
        static isPreventDefaultEnabled: boolean;
        static forceSettingForAndroid: (lwfSettings: LwfSettings, renderer: string) => void;
        /**
        * tune opacity for SH devices using Android 2.3.5-2.3.7 with WebkitCSS Renderer
        *
        * @param renderer
        * @returns {*}
        */
        static getOpacity: (renderer: string) => string;
        /**
        * fix innerWidth for old Android devices
        */
        static getStageWidth: () => number;
        /**
        * fix innerHeight for old Android devices
        */
        static getStageHeight: () => number;
        /**
        * if null or undefined or empty object is return true.
        *
        * @param arg
        *
        * @returns {boolean}
        */
        static isEmpty: (arg: any) => boolean;
        /**
        * @see Util.isEmpty
        *
        * @param arg
        *
        * @returns {boolean}
        */
        static isNotEmpty: (arg: any) => boolean;
    }
}
declare var global: any;
/**
* Created by tdoe on 5/6/14.
*
* This class is for LWF animation rendering element operation.
*/
declare module LwfPlayer {
    /**
    * @type {LwfPlayer.StageContractor}
    * @const
    */
    class StageContractor {
        private _player;
        private _targetStage;
        private _screenStage;
        private _eventReceiveStage;
        private _stageScale;
        private _devicePixelRatio;
        private _debugInfo;
        private _from;
        private _currentFPS;
        private _execCount;
        private _stageWidth;
        private _stageHeight;
        private _stageStyleWidth;
        private _stageStyleHeight;
        /**
        * this class is need Player instance.
        *
        * @param player
        */
        constructor(player: Player);
        /**
        * get devicePixelRatio.
        *
        * @returns {number}
        */
        public devicePixelRatio : number;
        /**
        * get screen stage scale.
        *
        * @returns {number}
        */
        public stageScale : number;
        /**
        * get screen stage element.
        *
        * @returns {HTMLElement}
        */
        public screenStage : HTMLElement;
        /**
        * get screen width by number convert string.
        *
        * @returns {number}
        */
        public screenStageWidth : number;
        /**
        * get screen height by number convert string.
        *
        * @returns {number}
        */
        public screenStageHeight : number;
        /**
        * calculation to set stage size.
        * stage size is passed to LWF
        *
        * @param width  LWF width
        * @param height LWF height
        */
        public changeStageSize: (width: number, height: number) => void;
        /**
        * calc stage size by LWF size.
        * For fit to LWF width.
        *
        * @param lwfWidth
        * @param lwfHeight
        */
        private fitForWidth;
        /**
        * calc stage size by LWF size.
        * For fit to LWF height.
        *
        * @param lwfWidth
        * @param lwfHeight
        */
        private fitForHeight;
        /**
        * calc stage size by screen-size.
        * For full screen LWF display.
        *
        * @param lwfWidth
        * @param lwfHeight
        */
        private fitToScreen;
        /**
        * screen stage size * devicePixelRatio for High-definition screen
        */
        private setStageWidthAndHeight;
        /**
        * remove event listeners
        * call before LWF play.
        */
        public addEventListeners: () => void;
        /**
        * remove event listeners
        * call when LWF destroy.
        */
        public removeEventListeners: () => void;
        /**
        * create LWF animation rendering element.
        * @param rendererSelector
        */
        public createScreenStage: (rendererSelector: RendererSelector) => void;
        /**
        * create mouse or touch event receive element.
        */
        public createEventReceiveStage: () => void;
        /**
        * Display debug information.
        */
        public viewDebugInfo: () => void;
    }
    class Position {
        public top: string;
        public left: string;
        public position: string;
    }
}
/**
* Created by tdoe on 5/5/14.
*
* this class is the coordinate handler.
* coordinate input from mouse or touch.
*/
declare module LwfPlayer {
    class Coordinator {
        /**
        * X coordinate
        */
        private _x;
        /**
        * Y coordinate
        */
        private _y;
        /**
        * for need to know HTMLElement size and BoundingClientRect.
        */
        private _stageContractor;
        /**
        * For event.preventDefault() execution check.
        * default is LwfPlayer.Util.isPreventDefaultEnabled.
        *
        * @see LwfPlayer.Util.isPreventDefaultEnabled
        */
        private _isPreventDefaultEnabled;
        /**
        * this class is need StageContractor instance.
        *
        * @param stageContractor
        */
        constructor(stageContractor: StageContractor);
        /**
        * force set isPreventDefaultEnabled.
        *
        * @param isPreventDefaultEnabled
        */
        public preventDefaultEnabled : boolean;
        /**
        * set coordinate by mouse or touch event input.
        * wrapping of mouse, touch and LWF stage size.
        *
        * @param event
        */
        public setCoordinate: (event: any) => void;
        /**
        * From mouse or touch event get X coordinate.
        *
        * @returns _x
        */
        public x : number;
        /**
        * From mouse or touch event get Y coordinate.
        *
        * @returns _y
        */
        public y : number;
    }
}
/**
* Created by tdoe on 5/9/14.
*
* This class is for For backward compatibility lwf-loader.
*/
declare module LwfPlayer {
    class LwfLoader {
        /**
        * @deprecated
        *
        * get LWF path from ID (OBSOLETED. should be used for backward compatibility only)
        *
        * @param {string} lwfName LWF name.
        *
        * @returns {string} LWF file path.
        */
        static getLwfPath: (lwfName: string) => string;
        static setLoader: (player: Player, lwfSettings: LwfSettings) => void;
        /**
        * For backward compatibility lwf-loader.
        *
        * @param lwf         parent LWF instance.
        * @param lwfName     for child LWF name.
        * @param imageMap    for chile imageMap
        * @param privateData for child privateData object.
        * @param lwfSetting  parent LWF setting.
        *
        * @returns childSettings For attach LWF
        */
        static prepareChildLwfSettings: (lwf: LWF.LWF, lwfName: string, imageMap: any, privateData: any, lwfSetting: LwfSettings) => LwfSettings;
    }
}
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
declare module LwfPlayer {
    class LwfSettings {
        public active: boolean;
        public buttonEventMap: Object;
        public callback: Object;
        public error: any;
        public execLimit: Object;
        public fitForHeight: boolean;
        public fitForWidth: boolean;
        public fsCommandMap: any;
        public handler: any;
        public imageMap: any;
        public imageQueryString: string;
        public imagePrefix: string;
        public imageSuffix: string;
        public js: any;
        public loadedCount: number;
        public lwf: string;
        public lwfMap: any;
        public lwfUrl: string;
        public name: string;
        public needsClear: any;
        public onload: Function;
        public onprogress: Function;
        public pageTransitionMap: any;
        public parentLWF: Object;
        public pos: {
            [index: string]: any;
        };
        public preferredFrameRate: Object;
        public prefix: string;
        public privateData: any;
        public quirkyClearRect: any;
        public recycleTextCanvas: any;
        public setBackgroundColor: any;
        public soundMap: any;
        public stage: HTMLElement;
        public textInSubpixel: any;
        public total: any;
        public use3D: any;
        public useBackgroundColor: boolean;
        public useVertexColor: boolean;
        public worker: boolean;
        /**
        * validation check this instance.
        */
        public validationLwfSettings: () => void;
        /**
        * initialized pos property.
        */
        public initPos: () => void;
        /**
        * require members init.
        *
        * @param player
        */
        public prepareLwfSettings: (player: Player) => void;
        /**
        * Generates function that takes image name as an input and returns the path corresponding to it.
        * If input is a function, return directly. Otherwise, it tries to set path from the previous set imageMap array.
        * ImageMap will be passed into LWF directly.
        *
        * @param imageMap image map data
        *
        * @return function to replace path by maps
        */
        static getImageMapper: (imageMap: any) => Function;
        /**
        * return LWF file path.
        *
        * @param lwfName LWF name.
        *
        * @returns {string|Function} LWF file path.
        */
        public getLwfPath: (lwfName: string) => any;
        [index: string]: any;
        [index: number]: any;
    }
}
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
declare module LwfPlayer {
    /**
    * @type {Object}
    * @const
    */
    class PlayerSettings {
        private _renderer;
        private _isDebugMode;
        private _targetStage;
        /**
        * check this instance status.
        */
        public validationPlayerSettings: () => void;
        /**
        * @const
        * @returns {string}
        */
        /**
        * @const
        * @param renderer
        */
        public renderer : string;
        /**
        * @const
        * @returns {boolean}
        */
        /**
        * @const
        * @param isDebugMode
        */
        public isDebugMode : boolean;
        /**
        * @const
        * @returns {HTMLElement}
        */
        /**
        * @const
        * @param targetStage
        */
        public targetStage : HTMLElement;
    }
}
/**
* Created by tdoe on 5/5/14.
*
* This class is LwfPlayer main class.
* using other LwfPlayer.* class, control LWF animation.
*/
declare module LwfPlayer {
    /**
    * @type {LwfPlayer.Player}
    * @const
    */
    class Player {
        private _lwf;
        private _cache;
        private _playerSettings;
        private _lwfSettings;
        private _stageContractor;
        private _coordinator;
        private _rendererSelector;
        private _inputQueue;
        private _fromTime;
        private _pausing;
        private _goPlayBack;
        private _destroyed;
        private _goRestart;
        /**
        * initialize this Player.
        *
        * @param playerSettings Require targetStage:HTMLElement.
        * @param lwfSettings    Require lwf:load LWF path.
        */
        constructor(playerSettings: PlayerSettings, lwfSettings: LwfSettings);
        /**
        * load and play LWF.
        */
        public play: () => void;
        /**
        * stop lwf animation.
        */
        public pause: () => void;
        /**
        * start lwf animation fromTime pause state.
        */
        public resume: () => void;
        /**
        * LWF play back from beginning.
        */
        public playBack: () => void;
        /**
        * Restart LWF by same player instance.
        * using same stage and renderer.
        *
        * @param lwfSettings
        */
        public reStart: (lwfSettings: LwfSettings) => void;
        /**
        * Caution! stop animation, and destroy LWF instance .
        */
        public destroy: () => void;
        /**
        * return player using LwfPlayer.Coordinator instance.
        *
        * @returns LwfPlayer.Coordinator
        */
        public coordinator : Coordinator;
        /**
        * return player using LwfPlayer.PlayerSettings instance.
        *
        * @returns LwfPlayer.PlayerSettings
        */
        public playerSettings : PlayerSettings;
        /**
        * return player using LwfPlayer.LwfSettings instance.
        *
        * @returns LwfPlayer.LwfSettings
        */
        public lwfSettings : LwfSettings;
        /**
        * return player using LwfPlayer.RendererSelector instance.
        *
        * @returns LwfPlayer.RendererSelector
        */
        public rendererSelector : RendererSelector;
        /**
        * return player using LwfPlayer.StageContractor instance.
        *
        * @returns LwfPlayer.StageContractor
        */
        public stageContractor : StageContractor;
        /**
        * handle load error.
        * can run the error handler that was passed.
        * It is recommended to pass handler["loadError"] function.
        */
        private handleLoadError;
        /**
        * handle exception.
        * can run the Exception handler that was passed.
        * It is recommended to pass handler["exception"] function.
        *
        * @param exception
        */
        private handleException;
        /**
        * exec LWF rendering, and dispatch events.
        * It is loop by requestAnimationFrame.
        */
        private exec;
        /**
        * initialize LWF animation screen stage, and coordinate class.
        */
        private initStage;
        /**
        * Initialize LWF resources.
        * select LWF renderer, and get LWF resource cache.
        */
        private initLwf;
        /**
        * Call LWF rendering processes.
        */
        private renderLwf;
        /**
        * destroy LWF resource and remove event listener.
        */
        private destroyLwf;
        /**
        * check args property, set the instance member.
        *
        * @param playerSettings
        * @param lwfSettings
        */
        private setSettingsAndValidation;
        /**
        * pass the coordinates to LWF from mouse or touch event.
        *
        * @param e
        */
        private inputPoint;
        /**
        * pass the coordinates and input to LWF from mouse or touch event.
        *
        * @param e
        */
        private inputPress;
        /**
        * push queue the mouse or touch coordinates.
        *
        * @param e
        */
        public onMove: (e: Event) => void;
        /**
        * push queue the press by mouse or touch coordinates.
        *
        * @param e
        */
        public onPress: (e: Event) => void;
        /**
        * push queue the release by mouse or touch coordinates.
        *
        * @param e
        */
        public onRelease: (e: Event) => void;
        /**
        * onload call back by LWF.
        *
        * @param lwf
        */
        public onLoad: (lwf: LWF.LWF) => void;
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
        public loadLWF: (lwf: LWF.LWF, lwfName: string, imageMap: any, privateData: any, callback: Function) => void;
    }
}
