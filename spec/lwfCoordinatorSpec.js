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

    var coordinator = player.getCoordinator();

    beforeEach(function () {
    });

    it("test getX", function () {
        expect(coordinator.getX()).toEqual(0);
    });

    it("test getY", function () {
        expect(coordinator.getY()).toEqual(0);
    });

    it("test setCoordinate", function () {
        //dummy event
        var event = {
            clientX: 100,
            clientY: 100
        };
        coordinator.setCoordinate(event);
        expect(coordinator.getX()).toEqual(100);
        expect(coordinator.getY()).toEqual(100);
    });

});
