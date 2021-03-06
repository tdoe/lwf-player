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
        expect(util.ua).toMatch(/Android/);
    });

    it("test isiOS", function () {
        expect(util.isiOS).toBe(false);
    });

    it("test isAndroid", function () {
        expect(util.isAndroid).toBe(true);
    });

    it("test isSp", function () {
        expect(util.isSp).toBe(true);
    });

    it("test isChrome", function () {
        expect(util.isChrome).toBe(false);
    });

    it("test isTouchEventEnabled", function () {
        expect(util.isTouchEventEnabled).toBe(true);
    });

    it("test useWebWorker", function () {
        expect(util.useWebWorker).toBe(false);
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
});
