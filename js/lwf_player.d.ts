/// <reference path="../src/lib/lwf.d.ts" />
declare module LwfPlayer {
    enum RendererName {
        useCanvasRenderer = 0,
        useWebkitCSSRenderer = 1,
        useWebGLRenderer = 2,
    }
}
declare module LwfPlayer {
    class RendererSelector {
        private _renderer;
        constructor();
        public renderer : string;
        private autoSelectRenderer;
    }
}
declare var global: any;
declare module LwfPlayer {
    class Util {
        static ua: any;
        static isiOS: boolean;
        static isAndroid: boolean;
        static isSp: boolean;
        static isChrome: boolean;
        static isTouchEventEnabled: boolean;
        static useWebWorker: boolean;
        static isPreventDefaultEnabled: boolean;
        static forceSettingForAndroid: (lwfSettings: LwfSettings, renderer: string) => void;
        static getOpacity: (renderer: string) => string;
        static getStageWidth: () => number;
        static getStageHeight: () => number;
        static isEmpty: (arg: any) => boolean;
        static isNotEmpty: (arg: any) => boolean;
    }
}
declare var global: any;
declare module LwfPlayer {
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
        constructor(player: Player);
        public devicePixelRatio : number;
        public stageScale : number;
        public screenStage : HTMLElement;
        public screenStageWidth : number;
        public screenStageHeight : number;
        public changeStageSize: (width: number, height: number) => void;
        private fitForWidth;
        private fitForHeight;
        private fitToScreen;
        private setStageWidthAndHeight;
        public addEventListeners: () => void;
        public removeEventListeners: () => void;
        public createScreenStage: (rendererSelector: RendererSelector) => void;
        public createEventReceiveStage: () => void;
        public viewDebugInfo: () => void;
    }
}
declare var global: any;
declare module LwfPlayer {
    class Coordinator {
        private _x;
        private _y;
        private _stageContractor;
        private _isPreventDefaultEnabled;
        constructor(stageContractor: StageContractor);
        public preventDefaultEnabled : boolean;
        public setCoordinate: (event: any) => void;
        public x : number;
        public y : number;
    }
}
declare var global: any;
declare module LwfPlayer {
    class LwfLoader {
        static getLwfPath: (lwfName: string) => string;
        static setLoader: (player: Player, lwfSettings: LwfSettings) => void;
        static prepareChildLwfSettings: (lwf: LWF.LWF, lwfName: string, imageMap: any, privateData: Object, lwfSetting: LwfSettings) => LwfSettings;
    }
}
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
        public pos: Object;
        public preferredFrameRate: Object;
        public prefix: string;
        public privateData: Object;
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
        public validationLwfSettings: () => void;
        public initPos: () => void;
        public prepareLwfSettings: (player: Player) => void;
        static getImageMapper: (imageMap: any) => Function;
        public getLwfPath: (lwfName: string) => any;
    }
}
declare module LwfPlayer {
    class PlayerSettings {
        private _renderer;
        private _isDebugMode;
        private _targetStage;
        public validationPlayerSettings: () => void;
        public renderer : string;
        public isDebugMode : boolean;
        public targetStage : HTMLElement;
    }
}
declare var global: any;
declare module LwfPlayer {
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
        constructor(playerSettings: PlayerSettings, lwfSettings: LwfSettings);
        public play: () => void;
        public pause: () => void;
        public resume: () => void;
        public playBack: () => void;
        public reStart: (lwfSettings: LwfSettings) => void;
        public destroy: () => void;
        public coordinator : Coordinator;
        public playerSettings : PlayerSettings;
        public lwfSettings : LwfSettings;
        public rendererSelector : RendererSelector;
        public stageContractor : StageContractor;
        private handleLoadError;
        private handleException;
        private exec;
        private initStage;
        private initLwf;
        private renderLwf;
        private destroyLwf;
        private setSettingsAndValidation;
        private inputPoint;
        private inputPress;
        public onMove: (e: Event) => void;
        public onPress: (e: Event) => void;
        public onRelease: (e: Event) => void;
        public onLoad: (lwf: LWF.LWF) => void;
        public loadLWF: (lwf: LWF.LWF, lwfName: string, imageMap: any, privateData: Object, callback: Function) => void;
    }
}
