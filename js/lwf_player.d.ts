/// <reference path="../src/lib/lwf.d.ts" />
declare var global: any;
declare module LwfPlayer {
    class Util {
        static ua: string;
        static isiOS: boolean;
        static isAndroid: boolean;
        static isSp: boolean;
        static isChrome: boolean;
        static isTouchEventEnabled: boolean;
        static useWebWorker: boolean;
        static debugInfoElementId: number;
        static initUtil(): void;
    }
}
declare module LwfPlayer {
    class RendererSelector {
        static webkitCSSRenderer: string;
        static webGLRenderer: string;
        static canvasRenderer: string;
        static rendererWebkitCSS: string;
        static rendererWebGL: string;
        static rendererCanvas: string;
        private renderer;
        constructor();
        public getRenderer(): string;
        public setRenderer(rendererName: string): void;
        private autoSelectRenderer();
    }
}
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
        constructor(player: Player);
        public getDevicePixelRatio(): number;
        public getStageScale(): number;
        public getScreenStage(): HTMLElement;
        public getScreenStageWidth(): number;
        public getScreenStageHeight(): number;
        public changeStageSize(width: number, height: number): void;
        public removeEventListeners(): void;
        public addEventListeners(): void;
        public createScreenStage(rendererSelector: RendererSelector): void;
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
        public getInputPoint(event: any): Coordinator;
        public getX(): number;
        public getY(): number;
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
        public prepareLwfSettings(player: Player, lwfSettings: LwfSettings): void;
        public prepareChildLwfSettings(lwf: LWF.LWF, lwfName: string, privateData: Object): void;
        private getImageMapper(imageMap);
        private getLwfPath(lwfName);
    }
}
declare module LwfPlayer {
    class PlayerSettings {
        public renderer: string;
        public debug: boolean;
        public targetStage: HTMLElement;
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
        private requests;
        private from;
        private pausing;
        private destroyed;
        constructor(playerSettings: PlayerSettings, lwfSettings: LwfSettings);
        public play(): void;
        public pause(): void;
        public resume(): void;
        public destroy(): void;
        public getCoordinator(): Coordinator;
        public getPlayerSettings(): PlayerSettings;
        public getLwfSettings(): LwfSettings;
        public getRendererSelector(): RendererSelector;
        public getStageContractor(): StageContractor;
        private requestLWF(onload);
        private loadLWFs(onLoadAll);
        private loadLWF(lwf, lwfName, imageMap, privateData, callback);
        private handleLoadError();
        private handleException(exception);
        private exec();
        private initLwf();
        private renderLwf();
        private destroyLwf();
        private inputPoint(e);
        private inputPress(e);
        public onMove(e: Event): void;
        public onPress(e: Event): void;
        public onRelease(e: Event): void;
        private restraint();
    }
}
