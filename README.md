### Warning: this star catalog still needs to undergo review and testing to ensure everything is working the way it's supposed to. Its structure is also still a work in progress and its output continually evolving. Avoid using it for any real applications for now.

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

## Source data
Excerpt [from original data source](https://heasarc.gsfc.nasa.gov/W3Browse/star-catalog/bsc5p.html):
> **Overview**
>
> The BSC5P database table contains data derived from the Bright Star Catalog, 5th Edition, preliminary, which is widely used as a source of basic astronomical and astrophysical data for stars brighter than magnitude 6.5. The database contains the identifications of included stars in several other widely-used catalogs, double- and multiple-star identifications, indication of variability and variable-star identifiers, equatorial positions for B1900.0 and J2000.0, galactic coordinates, UBVRI photoelectric photometric data when they exist, spectral types on the Morgan-Keenan (MK) classification system, proper motions (J2000.0), parallax, radial- and rotational-velocity data, and multiple-star information (number of components, separation, and magnitude differences) for known non-single stars.
>
> **References**
>
> Hoffleit, D. and Warren, Jr., W.H., 1991, "The Bright Star Catalog, 5th Revised Edition (Preliminary Version)".
>
> **Provenance**
>
> This table was created by the HEASARC in 1995 based upon a file obtained from either the ADC or the CDS. A number of revisions have been made by the HEASARC to this original version, e.g., celestial positions were added for the 14 non-stellar objects which have received HR numbers: HR 92, 95, 182, 1057, 1841, 2472, 2496, 3515, 3671, 6309, 6515, 7189, 7539 and 8296. In January 2014, the very incorrect position for HR 3671 = NGC 2808 was fixed (the Declination is -65 degrees not +65 degrees!), and smaller corrections were made to the positions of HR 2496, 3515 and 6515 so as to bring them in better agreement with the positions listed in SIMBAD and NED

## Legal
Use of catalog data subject to [HEASARC](https://heasarc.gsfc.nasa.gov/) terms
of use.

Caching query responses from Simbad subject to the
[SIMBAD Astronomical Database](http://simbad.u-strasbg.fr/simbad/) terms of
use.

Scripts written to facilitate conversion released to public domain under CC0.

## Acknowledgments
This research has made use of the SIMBAD database, operated at CDS, Strasbourg, France.

This research has made use of the VizieR catalogue access tool, CDS, Strasbourg, France (DOI : 10.26093/cds/vizier). The original description of the VizieR service was published in 2000, A&AS 143, 23.
