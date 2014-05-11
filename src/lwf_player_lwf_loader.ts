/**
 * Created by tdoe on 5/9/14.
 *
 * This class is for For backward compatibility lwf-loader.
 */

/// <reference path="lwf_player_util.ts"/>
/// <reference path="lwf_player_lwf_settings.ts"/>
/// <reference path="lwf_player.ts"/>

declare var global:any; // window or worker assigned by LWF

module LwfPlayer {

    "use strict";

    export class LwfLoader {

        /**
         * @deprecated
         *
         * get LWF path from ID (OBSOLETED. should be used for backward compatibility only)
         *
         * @param {string} lwfName LWF name.
         *
         * @returns {string} LWF file path.
         */
        public static getLwfPath(lwfName:string):string {
            var _lwfName = lwfName;
            if (lwfName.indexOf("/") >= 0) {
                _lwfName = lwfName.substring(lwfName.lastIndexOf("/") + 1);
            }

            return lwfName + "/_/" + _lwfName + ".lwf";
        }

        public static setLoader(player:Player, lwfSettings:LwfSettings) {
            lwfSettings.privateData["lwfLoader"] = player;
        }

        /**
         * For backward compatibility lwf-loader.
         *
         * @param lwf         parent LWF instance.
         * @param lwfName     for child LWF name.
         * @param imageMap    for chile imageMap
         * @param privateData for child privateData object.
         * @param lwfSetting  parent LWF setting.
         *
         * @returns childSettings For attach LWF
         */
        public static prepareChildLwfSettings(lwf:LWF.LWF, lwfName:string, imageMap:any, privateData:Object, lwfSetting:LwfSettings):LwfSettings {
            var childSettings = new LwfSettings();

            for (var i in lwfSetting) {
                if (lwfSetting.hasOwnProperty(i)) {
                    childSettings[i] = lwfSetting[i];
                }
            }

            if (imageMap !== void 0 && imageMap !== null) {
                childSettings.imageMap = LwfSettings.getImageMapper(imageMap);
            } else if (privateData.hasOwnProperty("imageMap")) {
                childSettings.imageMap = LwfSettings.getImageMapper(privateData["imageMap"]);
            }

            if (privateData !== void 0 && privateData !== null) {
                childSettings.privateData = privateData;
            }

            childSettings.fitForHeight = false;
            childSettings.fitForWidth = false;
            childSettings.parentLWF = lwf;
            childSettings.active = false;
            childSettings.lwf = childSettings.getLwfPath(lwfName);
            childSettings.stage = lwfSetting.stage;

            return childSettings;
        }
    }
}
