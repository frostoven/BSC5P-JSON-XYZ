### Warning: this star catalog still needs to undergo review and testing to ensure everything is working the way it's supposed to. Avoid using it for any real applications for now.

This catalog targets video game developers and visualisation artists that need
an easy-to-use, real star catalogs at their disposal. This catalog contains all
the stars in the [BSC5P](https://heasarc.gsfc.nasa.gov/W3Browse/star-catalog/bsc5p.html)
catalog (all the stars we can see with the naked eye), but with more accurate
information taken from modern stellar data.

It starts with [this catalog](https://github.com/aggregate1166877/BSC5P-JSON)
as its base but improves on it.

This repo came into existence because of a lack of ready-made resources while
working on the [Cosmosis game project](https://github.com/aggregate1166877/Cosmosis).

The scripts used to perform the conversion are included in this repo in case
anyone needs the data adjusted, see 'Scripts provided' section below.

## Format
As this primarily target video games, things are keep things small for faster
loading / efficient bandwidth usage.

Two file variants are provided:
* Coordinates as right ascension / declination / parallax.
* Coordinates as x,y,z using parsecs as unit of measurement.

**Catalog files provided:**
[Will be updated soon]

**Scripts provided:**
[Will be updated soon]

#### JSON keys
Each file will contain some of the following:

| Key | Type     | Description                                              |
| --- | -------- | -------------------------------------------------------- |
| `n` | string   | Name given to star (additional known names stored in separate file).
| `i` | number or string   | Original BSC5P line number, or 'Custom [n]' if added via the amendments mechanism. Corresponds to the ID used in the additional star names (bsc5p_names.json) file.
| `r` | number[] | Right ascension in **radians**.
| `d` | number[] | Declination in **radians**.
| `p` | number   | Parallax (used to triangulate distance).
| `x` | number   | Ecliptic-projected z coordinate (parsecs). Points north (???).
| `y` | number   | Ecliptic-projected y coordinate (parsecs). Points up (???).
| `z` | number   | Ecliptic-projected z coordinate (parsecs).
| `b` | number   | Apparent brightness.
| `s` | string   | Spectral type (a.k.a colour).

<!--
^^ change x,y,z into a single c, perhaps?

Example, [] might have an entry that looks like this:
```json
{
  
}
```
-->

As noted above, right ascension and declination are expressed in radians. This
is because video game engines and graphics libraries often use radians.
Shipping this catalog with radians therefore reduces the need for an additional
conversion step.
