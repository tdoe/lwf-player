/**
 * Created by tdoe on 5/5/14.
 *
 * this class is the coordinate handler.
 * coordinate input from mouse or touch.
 */

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_stage_contractor.ts"/>

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {
    export class Coordinator {

        /**
         * X coordinate
         */
        private x:number = 0;

        /**
         * Y coordinate
         */
        private y:number = 0;

        /**
         * for need to know HTMLElement size and BoundingClientRect.
         */
        private stageContractor:StageContractor;

        /**
         * For event.preventDefault() execution check.
         * default is LwfPlayer.Util.isPreventDefaultEnabled.
         *
         * @see LwfPlayer.Util.isPreventDefaultEnabled
         */
        private isPreventDefaultEnabled:boolean = Util.isPreventDefaultEnabled;

        /**
         * this class is need StageContractor instance.
         *
         * @param stageContractor
         */
        constructor(stageContractor:StageContractor) {
            this.stageContractor = stageContractor;
        }

        /**
         * force set isPreventDefaultEnabled.
         *
         * @param isPreventDefaultEnabled
         */
        public setIsPreventDefaultEnabled(isPreventDefaultEnabled:boolean):void {
            this.isPreventDefaultEnabled = isPreventDefaultEnabled;
        }

        /**
         * set coordinate by mouse or touch event input.
         * wrapping of mouse, touch and LWF stage size.
         *
         * @param event
         */
        public setCoordinate(event:any):void {
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
        }

        /**
         * From mouse or touch event get X coordinate.
         *
         * @returns x
         */
        public getX():number {
            return this.x;
        }

        /**
         * From mouse or touch event get Y coordinate.
         *
         * @returns y
         */
        public getY():number {
            return this.y;
        }
    }
}
