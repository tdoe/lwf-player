/**
 * Created by tdoe on 5/10/14.
 */

describe("StageContractor class test", function () {


    var playerSettings = new LwfPlayer.PlayerSettings();
    playerSettings.targetStage = document.createElement("div");

    var lwfSettings = new LwfPlayer.LwfSettings();
    lwfSettings.lwf = "hoge.lwf";
    lwfSettings.fitForWidth = true;

    var player = new LwfPlayer.Player(playerSettings, lwfSettings);
    player.initStage();

    var stageContractor = player.getStageContractor();

    it("test getDevicePixelRatio", function () {
        expect(stageContractor.getDevicePixelRatio()).toMatch(/\d/);
    });

    it("test getStageScale", function () {
        stageContractor.changeStageSize(320, 480);
        expect(stageContractor.getStageScale()).toEqual(1);
    });
});
