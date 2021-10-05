### Warning: this star catalog still needs to undergo review and testing to ensure everything is working the way it's supposed to. Its structure is also still a work in progress and its output continually evolving. Avoid using it for any real applications for now.

This catalog targets video game developers and visualisation artists that need
easy-to-use, real star catalogs at their disposal. This catalog contains all
the stars in the [BSC5P](https://heasarc.gsfc.nasa.gov/W3Browse/star-catalog/bsc5p.html)
catalog (all the stars we can see with the naked eye), but with more accurate
information taken from modern stellar data.  It uses
[this catalog](https://github.com/aggregate1166877/BSC5P-JSON) as its base but
adds modern data.

Some concessions are made. For example, real spectral data might tell us "this
star is either an A type, or an F type. We're certain it's _one of_ the two,
but unsure which _exactly_." This makes visualisation difficult - we can't draw
a star that's defined as two completely different things. This catalog will in
such cases average between the two possibilities and provide you a single
value. In case this is unwanted, the original spectral data string is still
provided for you to process yourself. Note also that some stars have unique
tacked-on special definitions (officially), meaning that automatic calculation
will produce inaccurate results. In such cases manual adjustment *has* to be
done. Many of these special cases will simply be wrong until a manual
adjustment is made.

The scripts used to create the RA/Dec JSON files are included in this repo in
case anyone needs the data adjusted (see 'Scripts provided' section below).
Note however that the scripts used to generate the `x,y,z` coordinate JSON
files are not included because they cannot be run stand-alone (yet). This is
because, for the sake of convenience, a video game engine was used to do the
conversions.
If this repo needs to be updated often, the `x,y,z` conversion code will likely
be converted to a stand-alone tool.

This repo came into existence because of a lack of ready-made resources while
working on the [Cosmosis game project](https://github.com/aggregate1166877/Cosmosis).

## Format
As this catalog primarily target video games, things are keep things small for
faster loading / efficient bandwidth usage.

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
| `i` | number or string | Original BSC5P line number, or 'Custom [n]' if added via the amendments mechanism. Corresponds to the ID used in the additional star names (bsc5p_names.json) file.
| `r` | number[] | Right ascension in **radians**.
| `d` | number[] | Declination in **radians**.
| `p` | number   | Parallax (used to triangulate distance). 1/p = distance in parsecs.
| `b` | number   | Apparent brightness.
| `a` | number   | Naively calculated absolute magnitude. This does not not take dust and other obstruction into account.
| `L` | number   | Naively calculated Luminosity (LSub0). This does not not take dust and other obstruction into account, and can vary many orders of magnitude from real data. This is however still very useful, because being derived directly from perceived brightness and distance, it gives visualisation software a consistent base for calculations and is therefore more a made-up 'relative' unit than real luminosity.
| `c` | hex string | [Deprecated, will be removed soon in favour of `K` below] Bright inner colour of star.
| `K` | vec3     | Colour of star approximated from star temperature (AKA blackbody temperature). A lot of effort and research has gone into make this as physically accurate as humanly possible (while keeping in mind it's still an approximation nonetheless, and will vary by star class and observation quality).
| `g` | hex string  | Colour or glow of star, but cartoony instead of real.
| `x` | number   | [Not yet implemented] Ecliptic-projected z coordinate (parsecs). Points north (???).
| `y` | number   | [Not yet implemented] Ecliptic-projected y coordinate (parsecs). Points up (???).
| `z` | number   | [Not yet implemented] Ecliptic-projected z coordinate (parsecs).
| `e` | object   | Sibling information in multi-star systems.
| `s` | array[]  | Spectral type (a.k.a colour info). See the spectral table below for more information.

<!--
^^ change x,y,z into a single c, perhaps?
-->

As noted above, right ascension and declination are expressed in radians. This
is because video game engines and graphics libraries often use radians.
Shipping this catalog with radians therefore reduces the need for an additional
conversion step.

**Spectral information**

| Key | Type     | Description                                              |
| --- | -------- | -------------------------------------------------------- |
| `C` | string   | Spectral type classification (O, B, A, F, G, K, M).
| `S` | number   | Spectral type subclass (0-9). 0=hottest, 9=coldest. Fractions exist (eg. Mu Normae is O9.7 \[that's an `O`, not a `0`]).
| `L` | number   | Luminosity class. The higher the number, the lower the luminosity for given surface temperature. Ordinary expressed in Roman numerals as `Ia` = _Luminous supergiant_, `Ib` = _supergiant_, `II` = _bright giant_, `III` = _giant_, `IV` = _subgiant_, `V` = _main sequence_. To keep things easy to parse, this script stores these values as regular numbers instead, where: `0=Ia`, `1=Ib`, `2=II`, `3=III`, `4=IV`, `5=V`.
| `L` | number   | Luminosity class. The higher the number, the lower the luminosity for given surface temperature. The amount of variations, gotchas, and duplications with these are quite numerous. So to try keep things simple, this script stores these values as regular numbers instead. See luminosity table below.
| `A` | number   | Approximate luminosity. Note that the accuracy drastically decreases with certain star types (especially hot main sequence stars).
| `C` | bool     | If true, this is an carbon star. Else not set.
| `R` | bool     | If true, this is an R type (carbon) star. Else not set.
| `N` | bool     | If true, this is an N type (carbon) star. Else not set.
| `S` | bool     | If true, this is an S type star. Else not set. As a side note, a significant fraction of S type stars are variable.
| `T` | bool     | If true, this is a T Tauri star. Else not set.
| `W` | bool     | If true, this is a Wolf-Rayet star. Else not set.
| `U` | string   | Luminosity data the conversion script doesn't know how to deal with.

<!--
change `m` to `r` (for Roman Numeral) if something else would need an m.
-->

## Note on interpreted spectral data
Parsing spectral luminosity data is insanely complex because of how
un-computer-friendly it is. For example, `A2/3III/V` means we have a star
that's either `A2` or `A3` with a luminosity of either `III` or `V`. This is
what the `/` means: either/or. Of course, an `A2/F1` means it's either an `A2`
or `F1` (notice how the meaning of the `/` is subtly different). It gets worse;
`+` can mean "multi-star system" or it may simply mean "higher luminosity"
depending on context. This script tries its best to process this correctly, and
is known to work with a lot of crazy luminosities (such as
`A5-6/F1III/IVm s+F8-F9:+F1-F2`). A few thousand entries from the BSC5P were
manually verified. No guarantees are made however and you're encouraged to
raise an issue if you find a problem.

#### Known edge cases
This catalog uses SIMBAD's spectral info because it's written more reasonably
than some other sources. For example, HD 143454 has in the past been written as
both `sdBe+gM3+Q0` and `M3IIIe_sh`. The parser will not understand the former
because the class info is garbled in between spectral peculiarity info. The
latter however will work just fine (and is what this catalog uses). In any
case, this script has mechanisms that allow for per-star amendments if needed.

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

Conversion scripts included in this project released to public domain under
CC0.

## Acknowledgments
This research has made use of the SIMBAD database, operated at CDS, Strasbourg, France.

This research has made use of the VizieR catalogue access tool, CDS, Strasbourg, France (DOI : 10.26093/cds/vizier). The original description of the VizieR service was published in 2000, A&AS 143, 23.
