/// <reference path="lib/params.d.ts"/>
/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_lwf_settings.ts"/>
/// <reference path="lwf_player.ts"/>

/**
 * Created by tdoe on 5/9/14.
 *
 * This class is for For backward compatibility lwf-loader.
 */
module LwfPlayer {

    "use strict";

    export class LwfLoader {

        /**
         * @deprecated
         *
         * get LWF path from ID (OBSOLETED. should be used for backward compatibility only)
         *
         * @param lwfName {string} LWF name.
         *
         * @returns {string} LWF file path.
         */
        public static getLwfPath = (lwfName:string):string => {
            var _lwfName = lwfName;

            if (lwfName.indexOf("/") >= 0) {
                _lwfName = lwfName.substring(lwfName.lastIndexOf("/") + 1);
            }

            return lwfName + "/_/" + _lwfName + ".lwf";
        };

        /**
         * @param player      {LwfPlayer.Player}
         * @param lwfSettings {LwfPlayer.LwfSettings}
         */
        public static setLoader = (player:Player, lwfSettings:LwfSettings) => {
            lwfSettings.privateData.lwfLoader = player;
        };

        /**
         * For backward compatibility lwf-loader.
         *
         * @param lwf         {LWF.LWF}                parent LWF instance.
         * @param lwfName     {string}                 for child LWF name.
         * @param imageMap    {object}                 for chile imageMap
         * @param privateData {object}                 for child privateData object.
         * @param lwfSetting  {LwfPlayer.LwfSettings}  parent LWF setting.
         *
         * @returns childSettings {LwfPlayer.LwfSettings} For attach LWF
         */
        public static prepareChildLwfSettings
            = (lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:any, lwfSetting:LwfSettings):LwfSettings => {
            var childSettings = new LwfSettings();

            for (var i in lwfSetting) {
                if (lwfSetting.hasOwnProperty(i)) {
                    childSettings[i] = lwfSetting[i];
                }
            }

            if (Util.isNotEmpty(imageMap)) {
                childSettings.imageMap = LwfSettings.getImageMapper(imageMap);
            } else if (privateData.hasOwnProperty("imageMap")) {
                childSettings.imageMap = LwfSettings.getImageMapper(privateData.imageMap);
            }

            if (Util.isNotEmpty(privateData)) {
                childSettings.privateData = privateData;
            }

            childSettings.lwf = childSettings.getLwfPath(lwfName);
            childSettings.stage = lwfSetting.stage;
            childSettings.fitForHeight = false;
            childSettings.fitForWidth = false;
            childSettings.parentLWF = lwf;
            childSettings.active = false;

            return childSettings;
        };
    }
}
