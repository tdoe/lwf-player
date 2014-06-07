/**
 * Created by tdoe on 5/11/14.
 */

describe("Coordinator class test", function () {

    var playerSettings = new LwfPlayer.PlayerSettings();
    playerSettings.targetStage = document.createElement("div");

    var lwfSettings = new LwfPlayer.LwfSettings();
    lwfSettings.lwf = "hoge.lwf";
    lwfSettings.fitForWidth = true;

    var player = new LwfPlayer.Player(playerSettings, lwfSettings);

    beforeEach(function () {
        player.play();
    });

    it("test setCoordinate", function () {
        //dummy event
        var event = {
            clientX: 100,
            clientY: 100
        };
        var coordinator = player.coordinator;
        coordinator.setCoordinate(event);
        expect(coordinator.x).toEqual(100);
        expect(coordinator.y).toEqual(100);
    });

});
