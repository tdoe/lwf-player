/// <reference path="../src/lib/lwf.d.ts" />
declare module LwfPlayer {
    class RendererSelector {
        static webkitCSSRenderer: string;
        static webGLRenderer: string;
        static canvasRenderer: string;
        private renderer;
        constructor();
        public getRenderer(): string;
        public setRenderer(playerSettings: PlayerSettings): void;
        private autoSelectRenderer();
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
        static forceSettingForAndroid(lwfSettings: LwfSettings, renderer: string): void;
        static getOpacity(renderer: string): string;
        static getStageWidth(): any;
        static getStageHeight(): any;
        static isEmpty(arg: any): boolean;
        static isNotEmpty(arg: any): boolean;
    }
}
declare var global: any;
declare module LwfPlayer {
    class StageContractor {
        private player;
        private targetStage;
        private screenStage;
        private eventReceiveStage;
        private stageScale;
        private devicePixelRatio;
        private debugInfo;
        private from;
        private currentFPS;
        private execCount;
        private stageWidth;
        private stageHeight;
        private stageStyleWidth;
        private stageStyleHeight;
        constructor(player: Player);
        public getDevicePixelRatio(): number;
        public getStageScale(): number;
        public getScreenStage(): HTMLElement;
        public getScreenStageWidth(): number;
        public getScreenStageHeight(): number;
        public changeStageSize(width: number, height: number): void;
        private fitForWidth(lwfWidth, lwfHeight);
        private fitForHeight(lwfWidth, lwfHeight);
        private fitToScreen(lwfWidth, lwfHeight);
        private setStageWidthAndHeight();
        public addEventListeners(): void;
        public removeEventListeners(): void;
        public createScreenStage(rendererSelector: RendererSelector): void;
        public createEventReceiveStage(): void;
        public viewDebugInfo(): void;
    }
}
declare var global: any;
declare module LwfPlayer {
    class Coordinator {
        private x;
        private y;
        private stageContractor;
        private isPreventDefaultEnabled;
        constructor(stageContractor: StageContractor);
        public setIsPreventDefaultEnabled(isPreventDefaultEnabled: boolean): void;
        public setCoordinate(event: any): void;
        public getX(): number;
        public getY(): number;
    }
}
declare var global: any;
declare module LwfPlayer {
    class LwfLoader {
        static getLwfPath(lwfName: string): string;
        static setLoader(player: Player, lwfSettings: LwfSettings): void;
        static prepareChildLwfSettings(lwf: LWF.LWF, lwfName: string, imageMap: any, privateData: Object, lwfSetting: LwfSettings): LwfSettings;
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
        public validationLwfSettings(): void;
        public initPos(): void;
        public prepareLwfSettings(player: Player): void;
        static getImageMapper(imageMap: any): Function;
        public getLwfPath(lwfName: string): any;
    }
}
declare module LwfPlayer {
    class PlayerSettings {
        public renderer: string;
        public debug: boolean;
        public targetStage: HTMLElement;
        public validationPlayerSettings(): void;
    }
}
declare var global: any;
declare module LwfPlayer {
    class Player {
        private lwf;
        private cache;
        private playerSettings;
        private lwfSettings;
        private stageContractor;
        private coordinator;
        private rendererSelector;
        private inputQueue;
        private fromTime;
        private pausing;
        private goPlayBack;
        private destroyed;
        constructor(playerSettings: PlayerSettings, lwfSettings: LwfSettings);
        public play(): void;
        public pause(): void;
        public resume(): void;
        public playBack(): void;
        public destroy(): void;
        public getCoordinator(): Coordinator;
        public getPlayerSettings(): PlayerSettings;
        public getLwfSettings(): LwfSettings;
        public getRendererSelector(): RendererSelector;
        public getStageContractor(): StageContractor;
        private handleLoadError();
        private handleException(exception);
        private exec();
        private initStage();
        private initLwf();
        private renderLwf();
        private renderRewindLwf();
        private destroyLwf();
        private inputPoint(e);
        private inputPress(e);
        public onMove(e: Event): void;
        public onPress(e: Event): void;
        public onRelease(e: Event): void;
        public onLoad(lwf: LWF.LWF): void;
        private restraint();
        private loadLWF(lwf, lwfName, imageMap, privateData, callback);
    }
}
