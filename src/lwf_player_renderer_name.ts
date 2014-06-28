/**
 * Created by tdoe on 5/4/14.
 *
 * This class handling for LWF-Renderer choice.
 * will be cross-browser countermeasure.
 */
module LwfPlayer {

    "use strict";

    /**
     * @type {LwfPlayer.RendererName}
     */
    export enum RendererName {
        useCanvasRenderer,
        useWebkitCSSRenderer,
        useWebGLRenderer,
    }
}
