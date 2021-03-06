/// <reference path="lib/params.d.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_stage_contractor.ts"/>

/**
 * Created by tdoe on 5/5/14.
 *
 * this class is the coordinate handler.
 * coordinate input from mouse or touch.
 */
module LwfPlayer {

    export class Coordinator {

        /**
         * X coordinate
         */
        private _x:number = 0;

        /**
         * Y coordinate
         */
        private _y:number = 0;

        /**
         * for need to know HTMLElement size and BoundingClientRect.
         */
        private _stageContractor:StageContractor;

        /**
         * For event.preventDefault() execution check.
         * default is LwfPlayer.Util.isPreventDefaultEnabled.
         *
         * @see LwfPlayer.Util.isPreventDefaultEnabled
         */
        private _isPreventDefaultEnabled:boolean = Util.isPreventDefaultEnabled;

        /**
         * this class is need StageContractor instance.
         *
         * @param stageContractor {LwfPlayer.StageContractor}
         */
        constructor(stageContractor:StageContractor) {
            this._stageContractor = stageContractor;
        }

        /**
         * force set isPreventDefaultEnabled.
         *
         * @param isPreventDefaultEnabled {boolean}
         */
        public set preventDefaultEnabled(isPreventDefaultEnabled:boolean) {
            this._isPreventDefaultEnabled = isPreventDefaultEnabled;
        }

        /**
         * set coordinate by mouse or touch event input.
         * wrapping of mouse, touch and LWF stage size.
         *
         * @param event {MouseEvent|TouchEvent}
         */
        public setCoordinate = (event:any):void => {
            if (this._isPreventDefaultEnabled) {
                event.preventDefault();
            }

            var stageRect = this._stageContractor.screenStage.getBoundingClientRect();
            var stageScale = this._stageContractor.stageScale;

            if (Util.isTouchEventEnabled) {
                this._x = event.touches[0].pageX;
                this._y = event.touches[0].pageY;
            } else {
                this._x = event.clientX;
                this._y = event.clientY;
            }

            this._x -= stageRect.left;
            this._y -= stageRect.top;

            if (Util.isSp) {
                this._x -= global.scrollX;
                this._y -= global.scrollY;
            }

            this._x /= stageScale;
            this._y /= stageScale;
        };

        /**
         * From mouse or touch event get X coordinate.
         *
         * @returns _x {number}
         */
        public get x():number {
            return this._x;
        }

        /**
         * From mouse or touch event get Y coordinate.
         *
         * @returns _y {number}
         */
        public get y():number {
            return this._y;
        }
    }
}
