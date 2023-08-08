### Intro
This document explains the process behind building the star catalogs yourself.

The primary script used for doing all the magic is `buildRaDecJson.js`. This
script creates all the catalog files from scratch each time it's run. It
utilises additional scripts in `./utils`.

### Preparation
Ensure you have Node.js 16 or greater installed, and the latest version of npm.

The scripts provided require that you download
[BSC5P-JSON's bsc5p_min.json](https://github.com/frostoven/BSC5P-JSON/blob/primary/bsc5p_min.json)
and
[the SIMBAD cache directory](https://github.com/frostoven/BSC5P-JSON/tree/primary/simbad.u-strasbg.fr_cache)
into this directory for the scripts to work.

Your directory structure should look similar to the following before starting:
```bash
catalogs
simbad.u-strasbg.fr_cache
bsc5p_min.json
buildRaDecJson.js
```

### Building
If building for the first time, install needed dependencies with:

    npm install

You may then run the build script with:

    npm run buildRaDecJson

This will replace all files except `blackbody.json` in `./catalogs`.

If you wish to alter `blackbody.json`, have a look at `./spectrend`, which was
used to generate the blackbody file. Note that's a C file, so you'll need gcc
to compile / run it.
