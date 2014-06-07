/**
 * Created by tdoe on 5/11/14.
 */

describe("RendererSelector class test", function () {
    var rendererSelector;
    var enableWebGL;

    beforeEach(function () {

        rendererSelector = new LwfPlayer.RendererSelector();

        var canvas = document.createElement("canvas");
        var contextNames = ["webgl", "experimental-webgl"];
        enableWebGL = false;
        for (var i = 0; i < contextNames.length; i++) {
            if (canvas.getContext(contextNames[i])) {
                enableWebGL = true;
                break;
            }
        }
    });

    it("test auto selector", function () {
        if (enableWebGL) {
            expect(rendererSelector.renderer).toEqual(LwfPlayer.RendererName[2]);
        } else {
            expect(rendererSelector.renderer).toEqual(LwfPlayer.RendererName[0]);
        }
    });

    it("test setRenderer", function () {
        var playerSetting = new LwfPlayer.PlayerSettings();
        playerSetting.renderer = LwfPlayer.RendererName[1];
        rendererSelector.renderer = playerSetting.renderer;

        if (enableWebGL) {
            expect(rendererSelector.renderer).toEqual(LwfPlayer.RendererName[2]);
        } else {
            expect(rendererSelector.renderer).toEqual(LwfPlayer.RendererName[1]);
        }
    });
});
