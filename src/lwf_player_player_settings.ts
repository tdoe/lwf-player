/// <reference path="lwf_player_util.ts"/>

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
module LwfPlayer {

    /**
     * @type {Object}
     * @const
     */
    export class PlayerSettings {

        private _renderer:string;
        private _isDebugMode:boolean;
        private _targetStage:HTMLElement;

        /**
         * check this instance status.
         */
        public validationPlayerSettings = ():void => {
            if (Util.isEmpty(this.targetStage)) {
                throw new Error("targetStage property is need HTMLElement");
            }
        };

        /**
         * @const
         * @param renderer
         */
        public set renderer(renderer:string) {
            this._renderer = renderer;
        }

        /**
         * @const
         * @returns {string}
         */
        public get renderer():string {
            return this._renderer;
        }

        /**
         * @const
         * @param isDebugMode
         */
        public set isDebugMode(isDebugMode:boolean) {
            this._isDebugMode = isDebugMode;
        }

        /**
         * @const
         * @returns {boolean}
         */
        public get isDebugMode():boolean {
            return this._isDebugMode;
        }

        /**
         * @const
         * @param targetStage
         */
        public set targetStage(targetStage:HTMLElement) {
            this._targetStage = targetStage;
        }

        /**
         * @const
         * @returns {HTMLElement}
         */
        public get targetStage():HTMLElement {
            return this._targetStage;
        }
    }
}
