/**
 * Created by tdoe on 5/5/14.
 */

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_stage_contractor.ts"/>

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {
    export class Coordinator {

        private x:number = 0;
        private y:number = 0;
        private stageContractor:StageContractor;
        private isPreventDefaultEnabled:boolean = Util.isiOS || /Android *(4|3)\..*/.test(Util.ua);

        constructor(stageContractor:StageContractor) {
            this.stageContractor = stageContractor;
        }

        public setIsPreventDefaultEnabled(isPreventDefaultEnabled:boolean) {
            this.isPreventDefaultEnabled = isPreventDefaultEnabled;
        }

        public getInputPoint(event:any) {
            if (this.isPreventDefaultEnabled) {
                event.preventDefault();
            }

            var stageRect = this.stageContractor.getScreenStage().getBoundingClientRect();
            var stageScale = this.stageContractor.getStageScale();

            if (Util.isTouchEventEnabled) {
                this.x = event.touches[0].pageX;
                this.y = event.touches[0].pageY;
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

            this.x /= stageScale;
            this.y /= stageScale;

            return this;
        }

        public getX():number {
            return this.x;
        }

        public getY():number {
            return this.y;
        }
    }
}
