master : [![Build Status](https://travis-ci.org/tdoe/lwf-player.svg?branch=master)](https://travis-ci.org/tdoe/lwf-player)

## lwf-player
easy code and easy than [lwf-loader](https://github.com/gree/lwf-loader).

## Demo play

```
git clone git@github.com:tdoe/lwf-player.git
cd lwf-player/sample
python -m SimpleHTTPServer
```

here in the browser -> [http://localhost:8000/sample1/](http://localhost:8000/sample1/)

## How to use
Load "lwf.js" @see[https://github.com/gree/lwf](https://github.com/gree/lwf)

```
<script type="text/javascript" src="js/lwf.js"></script>
```

Load "lwf_player.js" file.

```
<script type="text/javascript" src="js/lwf_player.min.js"></script>
```

player setting and LWF setting.  
Please use always an instance of LwfPlayer.PlayerSettings.  
playerSetting to the 3 types (maybe more later..

```
var playerSettings = new LwfPlayer.PlayerSettings();
playerSettings.targetStage = document.getElementById('lwf');// require any stage element.
playerSettings.renderer = LwfPlayer.RendererSelector.canvasRenderer; // option. see other renderer is LwfPlayer.RendererSelector class.
playerSettings.debug = true;// option. true is running debug mode.
```

Lwf settings sample.  
Please use always an instance of LwfPlayer.LwfSettings.  
more info is [https://github.com/gree/lwf](https://github.com/gree/lwf)  
 or [lwf_player_lwf_settings.ts](https://github.com/tdoe/lwf-player/blob/master/src/lwf_player_lwf_settings.ts)  
but [lwf_player_lwf_settings.ts](https://github.com/tdoe/lwf-player/blob/master/src/lwf_player_lwf_settings.ts) is not all settings.

```
// for LWF settings.
 var lwfSettings = new LwfPlayer.LwfSettings();
lwfSettings.lwf = "hoge.lwf"; // require LWF file path.
lwfSettings.prefix = "lwf/js/images/prefix";
lwfSettings.imagePrefix = "images/prefix";
lwfSettings.privateData = {...};
```

call player and play.

```
// first arg is lwf-player setting object.
// second arg is LWF setting object.
var player = new LwfPlayer.Player(playerSetting, lwfSetting);
player.play(); // play start LWF.

// othoer methods.
player.pause(); // pause LWF.
player.resume(); // replay LWF from pause.
player.playBack(); // LWF playback from beginning.
player.destroy(); // stop LWF and destroy LWF instance.
```

##License
This software is released under the MIT License, see LICENSE.txt.

##Other LWF Document
http://gree.github.io/lwf/
http://lwf-users.org/

##Thanks
https://github.com/gree/lwf  
https://github.com/gree/lwf-loader
