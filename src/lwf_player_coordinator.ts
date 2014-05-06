/**
 * Created by tdoe on 5/5/14.
 */

/// <reference path="lwf_player_util.ts"/>

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {
    export class Coordinator {

        private x:number = 0;
        private y:number = 0;
        private stageScale:number = 1;

        public getInputPoint(event:any, stage:HTMLElement, isPreventDefaultEnabled:Boolean) {

            if (isPreventDefaultEnabled) {
                event.preventDefault();
            }

            var stageRect = stage.getBoundingClientRect();

            if (Util.isTouchEventEnabled) {
                var touch = event.touches[0];
                this.x = touch.pageX;
                this.y = touch.pageY;
            } else {
                this.x = event.clientX;
                this.y = event.clientY;
            }

            this.x -= stageRect.left;
            this.y -= stageRect.top;

            if (Util.isSp) {
                this.x -= global.scrollX;
                this.y -= global.scrollY;
            }

            this.x /= this.stageScale;
            this.y /= this.stageScale;
            return this;
        }

        public setStageScale(stageScale:number):void {
            this.stageScale = stageScale;
        }

        public getX():number {
            return this.x;
        }

        public getY():number {
            return this.y;
        }

    }
}
