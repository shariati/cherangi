'use strict';
const _ = require('lodash');
const colors = require('./colors');

function stringToHex(hex) {
  // Convert to string and make sure input color is in Uppercase
  hex = (hex || '000000').toString().toUpperCase();
  // Check if the hex code starts with #, If not then prepend a # to the code.
  hex = (hex.substring(0, 1) === '#') ? hex : `#${hex}`;
  // Check if the input code is a valid hex, if not return black #000
  const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex);
  hex = isHex ? hex : '#000000';
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`);
  return hex;
}

function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`);

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

/* 
  http://www.easyrgb.com/en/math.php
  (Standard RGB) input range = 0 ÷ 255
  X, Y and Z output refer to a D65/2° standard illuminant.
*/

function rgbToXYZ(red, green, blue) {
  const RED = ((red / 255) > 0.04045) ? Math.pow((((red / 255) + 0.055) / 1.055) , 2.4) * 100 : ((red / 255) / 12.92) * 100;
  const GREEN = ((green / 255) > 0.04045) ? Math.pow((((green / 255) + 0.055) / 1.055) , 2.4) * 100 : ((green / 255) / 12.92) * 100;
  const BLUE = ((blue / 255) > 0.04045) ? Math.pow((((blue / 255) + 0.055) / 1.055) , 2.4) * 100 : ((blue / 255) / 12.92) * 100;

  const X = RED * 0.4124 + GREEN * 0.3576 + BLUE * 0.1805;
  const Y = RED * 0.2126 + GREEN * 0.7152 + BLUE * 0.0722;
  const Z = RED * 0.0193 + GREEN * 0.1192 + BLUE * 0.9505;
  
  return [ X, Y , Z ];
  
}
/* 
  http://www.easyrgb.com/en/math.php
  XYZ (Tristimulus) Reference values of a perfect reflecting diffuser
  D65 is illuminants and observer has been choosen
  2° (CIE 1964) REFERENCE_X, REFERENCE_Y and REFERENCE_Z.
  Daylight, sRGB, Adobe-RGB
*/
function xyzToCIELab (x, y, z) {

  const REFERENCE_X = 95.047;
  const REFERENCE_Y = 100.000;
  const REFERENCE_Z = 108.883;
  
  const X = ( (x / REFERENCE_X) > 0.008856 ) ? Math.pow((x / REFERENCE_X) , (1/3) ) : (( 7.787 * (x / REFERENCE_X) ) +  (16 / 116) );
  const Y = ( (y / REFERENCE_Y) > 0.008856 ) ? Math.pow((y / REFERENCE_Y) , (1/3) ) : (( 7.787 * (y / REFERENCE_Y) ) +  (16 / 116) );
  const Z = ( (z / REFERENCE_Z) > 0.008856 ) ? Math.pow((z / REFERENCE_Z) , (1/3) ) : (( 7.787 * (z / REFERENCE_Z) ) +  (16 / 116) );

  const CIEL = ( 116 * Y ) - 16;
  const CIEA = 500 * ( X - Y );
  const CIEB = 200 * ( Y - Z );
  
  return [ CIEL, CIEA , CIEB ];
}

// https://en.wikipedia.org/wiki/HSL_and_HSV  
function rgbToHSL(red, green, blue) {
  red = red / 255;
  green = green / 255;
  blue = blue / 255;
  let hue, hue1, saturation;
  const MAX = Math.max(red, Math.max(green, blue));
  const MIN = Math.min(red, Math.min(green, blue));
  const LIGHTNESS = (MAX + MIN) / 2;

  if (MAX === MIN) {
    hue = saturation = 0; // achromatic
  } else {
    const CHROMA = MAX - MIN;
    //saturation = LIGHTNESS > 0.5 ? CHROMA / (2 - MAX - MIN) : CHROMA / (MAX + MIN);
    saturation = CHROMA / (1 - Math.abs(2 * LIGHTNESS - 1));
    switch (MAX) {
      case red:
        hue1 = ((green - blue) / CHROMA) % 6;
        break;
      case green:
        hue1 = ((blue - red) / CHROMA) + 2;
        break;
      case blue:
        hue1 = ((red - green) / CHROMA) + 4;
        break;
    }
    // Hue in Degree
    hue = hue1 * 60;
  }
  // Returns an array of HSL => H (Degree), S%, L%
  return [Math.round(hue), Math.round(saturation * 100), Math.round(LIGHTNESS * 100)];
}

/*
  http://www.easyrgb.com/en/math.php 
  https://en.wikipedia.org/wiki/Color_difference
  graphic arts weighting factors are used
  WHTL = 1, WHTC = 0.045, WHTH = 0.015
  DeltaE94 return value table
  http://zschuessler.github.io/DeltaE/learn/#toc-defining-delta-e
  Delta E	  Perception
  <= 1.0	  Not perceptible by human eyes.
  1 - 2	    Perceptible through close observation.
  2 - 10	  Perceptible at a glance.
  11 - 49	  Colors are more similar than opposite
  100	      Colors are exact opposite
*/

function DeltaE1994(CIELab1  , CIELab2) {
  //Weighting factors
  const WHTL = 1;
  const WHTC = 0.045;
  const WHTH = 0.015;
  
  const xC1 = Math.sqrt(( CIELab1[1] ^ 2 ) + ( CIELab1[2] ^ 2 ));
  const xC2 = Math.sqrt(( CIELab2[1] ^ 2 ) + ( CIELab2[2] ^ 2 ));
  let xDL = CIELab2[0] - CIELab1[0];
  let xDC = xC2 - xC1
  const xDE = Math.sqrt( ( ( CIELab1[0] - CIELab2[0] ) * ( CIELab1[0] - CIELab2[0] ) ) + ( ( CIELab1[1] - CIELab2[1] ) * ( CIELab1[1] - CIELab2[1]) ) + ( ( CIELab1[2] - CIELab2[2] ) * ( CIELab1[2] - CIELab2[2] ) ) );
  
  let xDH = ( xDE * xDE ) - ( xDL * xDL ) - ( xDC * xDC )
  xDH = ( xDH > 0 ) ? Math.sqrt( xDH ) : 0;

  const xSC = 1 + ( 0.045 * xC1 );
  const xSH = 1 + ( 0.015 * xC1 );
  xDL = xDL / WHTL;
  xDC = xDC / (WHTC * xSC);
  xDH = xDH / (WHTH * xSH);
  
  const DeltaE94 = Math.sqrt( xDL ^ 2 + xDC ^ 2 + xDH ^ 2 );
  return DeltaE94;
}

module.exports = function (hexcolor, options) {
  hexcolor = stringToHex(hexcolor);
  let rgbColor = hexToRGB(hexcolor);
  let hslColor = rgbToHSL(rgbColor[0], rgbColor[1], rgbColor[2]);
  options = options || {};

  return {
    rgb: rgbColor,
    hsl: hslColor
  };
};
