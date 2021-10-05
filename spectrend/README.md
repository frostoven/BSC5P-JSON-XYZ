Generates a table containing kelvin -> RGB values (see
`blackbody.json` in the project root).

Original by John Walker:<br>
http://www.fourmilab.ch/

Original last updated: March 9, 2003

This version modified by aggregate1166877 to output values
in a JSON format, October 5, 2021.

This program is in the public domain.

For complete information about the techniques employed in
this program, see the World-Wide Web document:

http://www.fourmilab.ch/documents/specrend/

The xyz_to_rgb() function, which was wrong in the original
version of this program, was corrected by:

* Andrew J. S. Hamilton 21 May 1999
* Andrew.Hamilton@Colorado.EDU
* http://casa.colorado.edu/~ajsh/

who also added the gamma correction facilities and
modified constrain_rgb() to work by desaturating the
colour by adding white.

A program which uses these functions to plot CIE
"tongue" diagrams called "ppmcie" is included in
the Netpbm graphics toolkit:
http://netpbm.sourceforge.net/
(The program was called cietoppm in earlier
versions of Netpbm.)
