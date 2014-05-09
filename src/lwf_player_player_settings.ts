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
    export class PlayerSettings {
        public renderer:string;
        public debug:boolean;
        public targetStage:HTMLElement;
    }
}
