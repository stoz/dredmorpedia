# dredmorpedia
Dredmorpedia is an automatically generated encyclopedia for the game [Dungeons of Dredmor](http://www.dungeonsofdredmor.com).

An online version of Dredmorpedia can be found at http://dredmorpedia.com

Game Files
----------

Dredmorpedia requires game files from Dungeons of Dredmor. In the root folder create the folder `data` and copy into it the `dungeon`, `game`, `items`, `skills`, `sprites` and `ui` folders. Also copy the `expansion`, `expansion2` and `expansion3` folders into the root folder. You also need to copy the supplied `mod.xml` files for the base game and each expansion into the appropriate game folder.

Sprites
-------

Most sprites from the base game need to be unpacked into a series of PNG images.

Mods
----

Mods are included in the github repository and are placed in the root folder.

Deployment
----------

The utility s3cmd can be used to deploy Dredmorpedia to Amazon's S3 service. The command below excludes hidden files and unused source graphic file extensions.
```
s3cmd put -P --recursive --rexclude "^\." --rexclude "\/\." --exclude="*.spr" --exclude="*.pal" --exclude="*.xcf" --exclude="*.psd" --exclude="*.md" --exclude="*.txt" --exclude="*.wav" --exclude="*.db" [localpath] s3://[bucketname]
```

Issues
------

Issues can be reported on github or in the [forum thread](http://community.gaslampgames.com/threads/dredmorpedia.1459/).

History
-------

Dredmorpedia was created by J-Factor in 2011. The original version (with 1.1.0 game data) can be found at http://j-factor.com/dredmorpedia
