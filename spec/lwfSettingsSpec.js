/**
 * Created by tdoe on 5/10/14.
 */

describe("LwfSetting class test", function () {
    var lwfSetting;
    beforeEach(function () {
        lwfSetting = new LwfPlayer.LwfSettings();
    });

    it("test getImageMapper by Object", function () {
        var objImageMapper = {
            "test1.png": "/fizz/buzz/test1.png",
            "test2.png": "/foo/bar/test2.png",
            "test3.png": "/hoge/sage/test3.png"
        };

        var imageMapper = LwfPlayer.LwfSettings.getImageMapper(objImageMapper);

        expect(imageMapper("test1.png")).toEqual("/fizz/buzz/test1.png");
        expect(imageMapper("test2.png")).toEqual("/foo/bar/test2.png");
        expect(imageMapper("test3.png")).toEqual("/hoge/sage/test3.png");
    });

    it("test getImageMapper by Function", function () {
        var funcImageMapper = function (imageId) {

            if (imageId === "test1.png") {
                return "/fizz/buzz/test1.png";
            }

            if (imageId === "test2.png") {
                return "/foo/bar/test2.png";
            }

            return "/hoge/sage/test3.png";

        };

        var imageMapper = LwfPlayer.LwfSettings.getImageMapper(funcImageMapper);

        expect(imageMapper("test1.png")).toEqual("/fizz/buzz/test1.png");
        expect(imageMapper("test2.png")).toEqual("/foo/bar/test2.png");
        expect(imageMapper("test3.png")).toEqual("/hoge/sage/test3.png");
    });

    it("test getLwfPath by Function", function () {
        var funcImageMapper = function (imageId) {

            if (imageId === "test1.png") {
                return "/fizz/buzz/test1.png";
            }

            if (imageId === "test2.png") {
                return "/foo/bar/test2.png";
            }

            return "/hoge/sage/test3.png";

        };

        var imageMapper = LwfPlayer.LwfSettings.getImageMapper(funcImageMapper);

        expect(imageMapper("test1.png")).toEqual("/fizz/buzz/test1.png");
        expect(imageMapper("test2.png")).toEqual("/foo/bar/test2.png");
        expect(imageMapper("test3.png")).toEqual("/hoge/sage/test3.png");
    });

    it("test getLwfPath by Object", function () {

        lwfSetting.lwfMap = {
            "test_child1": "/fizz/buzz/test_child1.lwf",
            "test_child2": "/foo/bar/test_child2",
            "test_child3": "/hoge/sage/test_child3"
        };

        expect(lwfSetting.getLwfPath("test_child1")).toEqual("/fizz/buzz/test_child1.lwf");
        expect(lwfSetting.getLwfPath("test_child2")).toEqual("/foo/bar/test_child2.lwf");
        expect(lwfSetting.getLwfPath("test_child3")).toEqual("/hoge/sage/test_child3.lwf");

        delete lwfSetting.lwfMap;

        expect(lwfSetting.getLwfPath("test_child4")).toEqual("test_child4/_/test_child4.lwf");
    });

    it("test prepareLwfSettings", function () {
        var _playerSetting = new LwfPlayer.PlayerSettings();
        _playerSetting.targetStage = document.createElement("div");

        var _lwfSetting = new LwfPlayer.LwfSettings();
        _lwfSetting.lwf = "hoge.lwf";

        var player = new LwfPlayer.Player(_playerSetting, lwfSetting);

        lwfSetting.prepareLwfSettings(player, _lwfSetting);

        expect(lwfSetting.privateData).toBeDefined();
        expect(lwfSetting.useBackgroundColor).toBe(true);
        expect(lwfSetting.pos).toBeDefined();
        expect(lwfSetting.imageMap).toBeDefined();
        expect(lwfSetting.privateData["lwfLoader"]).toEqual(player);
        expect(lwfSetting.lwf).toEqual("hoge.lwf");
    });
});
