/**
 * Created by tdoe on 5/10/14.
 */

describe("LwfUtil class test", function () {
    var util = LwfPlayer.Util;

    it("test define need object", function () {
        expect(global.performance.now).toBeDefined();
        expect(global.requestAnimationFrame).toBeDefined();
    });

    it("test user agent", function () {
        expect(util.ua).toMatch(/PhantomJS/);
    });

    it("test isiOS", function () {
        expect(util.isiOS).toBe(false);
    });

    it("test isAndroid", function () {
        expect(util.isAndroid).toBe(false);
    });

    it("test isSp", function () {
        expect(util.isSp).toBe(false);
    });

    it("test isChrome", function () {
        expect(util.isChrome).toBe(false);
    });

    it("test isTouchEventEnabled", function () {
        expect(util.isTouchEventEnabled).toBe(false);
    });

    it("test useWebWorker", function () {
        expect(util.useWebWorker).toBe(true);
    });

    it("test isPreventDefaultEnabled", function () {
        expect(util.isPreventDefaultEnabled).toBe(false);
    });

    it("test getStageWidth", function () {
        expect(util.getStageWidth()).not.toBeNaN();
    });

    it("test getStageHeight", function () {
        expect(util.getStageHeight()).not.toBeNaN();
    });

    it("test getOpacity", function () {
        expect(util.getOpacity("useCanvasRenderer")).toEqual(null);
    });

    it("test isEmpty", function () {
        var arg = null;
        expect(util.isEmpty(arg)).toEqual(true);

        arg = undefined;
        expect(util.isEmpty(arg)).toEqual(true);

        arg = "";
        expect(util.isEmpty(arg)).toEqual(true);

        arg = [];
        expect(util.isEmpty(arg)).toEqual(true);

        arg = {};
        expect(util.isEmpty(arg)).toEqual(true);

				arg = function(){
				};
        expect(util.isEmpty(arg)).toEqual(false);

				arg = 1;
				expect(util.isEmpty(arg)).toEqual(false);
    });
});
