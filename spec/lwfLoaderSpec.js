/**
 * Created by tdoe on 5/10/14.
 */

describe("LwfLoader class test", function () {

    beforeEach(function () {

    });

    it("test getLwfPath", function () {
        var lwfPath = LwfPlayer.LwfLoader.getLwfPath("test");

        expect(lwfPath).toEqual("test/_/test.lwf");
    });

    it("test getLwfPath with slash", function () {
        var lwfPath = LwfPlayer.LwfLoader.getLwfPath("fizz/buzz");

        expect(lwfPath).toEqual("fizz/buzz/_/buzz.lwf");
    });

    it("test setLoader", function () {
        var playerSetting = new LwfPlayer.PlayerSettings();
        playerSetting.targetStage = document.createElement("div");

        var lwfSetting = new LwfPlayer.LwfSettings();
        lwfSetting.lwf = "test.lwf";
        lwfSetting.privateData = {};

        var player = new LwfPlayer.Player(playerSetting, lwfSetting);

        LwfPlayer.LwfLoader.setLoader(player, lwfSetting);

        expect(lwfSetting.privateData.lwfLoader).toEqual(player);
    });

    it("test prepareChildLwfSettings", function () {

        var lwfSetting = new LwfPlayer.LwfSettings();
        lwfSetting.lwf = "test.lwf";
        lwfSetting.stage = document.createElement("div");

        var lwf = {thisIsDummyLwfInstance: "lwf"};
        var lwfName = "fizz.lwf";
        var imageMap = {
            fizz: "buzz.png"
        };
        var privateData = {
            fizz: "buzz"
        };

        var childSetting = LwfPlayer.LwfLoader.prepareChildLwfSettings(lwf, lwfName, imageMap, privateData, lwfSetting);

        expect(childSetting.parentLWF).toEqual(lwf);
        expect(childSetting.lwf).toEqual("fizz.lwf/_/fizz.lwf.lwf");
        expect(childSetting.privateData).toEqual(privateData);
        expect(childSetting.imageMap).not.toEqual(imageMap);
        expect(childSetting.fitForHeight).toEqual(false);
        expect(childSetting.fitForWidth).toEqual(false);
        expect(childSetting.active).toEqual(false);
        expect(childSetting.stage).toEqual(lwfSetting.stage);
    });

});
