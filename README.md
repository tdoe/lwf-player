## lwf-player
easy code and easy than [lwf-loader](https://github.com/gree/lwf-loader).

## How to use
load lwf.js @see[https://github.com/gree/lwf](https://github.com/gree/lwf)

```
<script type="text/javascript" src="js/lwf.js"></script>
```

load lwf_player.js file.

```
<script type="text/javascript" src="js/lwf_player.min.js"></script>
```

player setting and LWF setting.  
playerSetting to the 3 types (maybe more later..

```
var playerSetting = {
        targetStage:document.querySelector("#lwf"), // require target Element.
        renderer: "canvas" , // optional, "canvas" or "webgl" or "webkitcss".
        debug:true  // optional, by "true" Show the debug information.
    };
```

Lwf settings sample.  
more info is [https://github.com/gree/lwf](https://github.com/gree/lwf)  
 or [lwf_player_lwf_settings.ts](https://github.com/tdoe/lwf-player/blob/master/src/lwf_player_lwf_settings.ts)  
but [lwf_player_lwf_settings.ts](https://github.com/tdoe/lwf-player/blob/master/src/lwf_player_lwf_settings.ts) is not all settings.

```
// for LWF settings.
var lwfSetting = {
        lwf:"path/to/lwf_file.lwf",
        prefix:"",
        imagePrefix:"",
        imageMap:{
            "a:png" : "path/to/a.png"
        },
        privateData : {
            ...
        }
    };
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
player.destroy(); // stop LWF and destroy LWF instance.
```

##License
This software is released under the MIT License, see LICENSE.txt.

##Thanks
https://github.com/gree/lwf  
https://github.com/gree/lwf-loader
