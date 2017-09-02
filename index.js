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
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`);
  return hex;
}

function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? {
    R: parseInt(result[1], 16),
    G: parseInt(result[2], 16),
    B: parseInt(result[3], 16)
  } : {};
}

/*
  http://www.easyrgb.com/en/math.php
  (Standard RGB) input range = 0 ÷ 255
  X, Y and Z output refer to a D65/2° standard illuminant.
*/

function rgbToXYZ(RGB) {
  const RED = ((RGB.R / 255) > 0.04045) ? Math.pow((((RGB.R / 255) + 0.055) / 1.055), 2.4) * 100 : ((RGB.R / 255) / 12.92) * 100;
  const GREEN = ((RGB.G / 255) > 0.04045) ? Math.pow((((RGB.G / 255) + 0.055) / 1.055), 2.4) * 100 : ((RGB.G / 255) / 12.92) * 100;
  const BLUE = ((RGB.B / 255) > 0.04045) ? Math.pow((((RGB.B / 255) + 0.055) / 1.055), 2.4) * 100 : ((RGB.B / 255) / 12.92) * 100;

  const Xv = (RED * 0.4124) + (GREEN * 0.3576) + (BLUE * 0.1805);
  const Yv = (RED * 0.2126) + (GREEN * 0.7152) + (BLUE * 0.0722);
  const Zv = (RED * 0.0193) + (GREEN * 0.1192) + (BLUE * 0.9505);

  return {
    X: Xv,
    Y: Yv,
    Z: Zv
  };
}

/*
  http://www.easyrgb.com/en/math.php
  XYZ (Tristimulus) Reference values of a perfect reflecting diffuser
  D65 is illuminants and observer has been choosen
  2° (CIE 1964) REFERENCE_X, REFERENCE_Y and REFERENCE_Z.
  Daylight, sRGB, Adobe-RGB
*/

function xyzToCIELab(XYZ) {
  const REFERENCE_X = 95.047;
  const REFERENCE_Y = 100.000;
  const REFERENCE_Z = 108.883;

  const X = ((XYZ.X / REFERENCE_X) > 0.008856) ? Math.pow((XYZ.X / REFERENCE_X), (1 / 3)) : ((7.787 * (XYZ.X / REFERENCE_X)) + (16 / 116));
  const Y = ((XYZ.Y / REFERENCE_Y) > 0.008856) ? Math.pow((XYZ.Y / REFERENCE_Y), (1 / 3)) : ((7.787 * (XYZ.Y / REFERENCE_Y)) + (16 / 116));
  const Z = ((XYZ.Z / REFERENCE_Z) > 0.008856) ? Math.pow((XYZ.Z / REFERENCE_Z), (1 / 3)) : ((7.787 * (XYZ.Z / REFERENCE_Z)) + (16 / 116));

  const CIEL = (116 * Y) - 16;
  const CIEA = 500 * (X - Y);
  const CIEB = 200 * (Y - Z);

  return {
    L: CIEL,
    a: CIEA,
    b: CIEB
  };
}

function rgbToCIELab(RGB) {
  const XYZ = rgbToXYZ(RGB);
  return xyzToCIELab(XYZ);
}

/*
  http://www.easyrgb.com/en/math.php
  https://en.wikipedia.org/wiki/Color_difference

  Delta E* CIE return value table
  http://zschuessler.github.io/DeltaE/learn/#toc-defining-delta-e
*/

function deltaE1994(CIELab1, CIELab2) {
  const DeltaE94 = Math.sqrt(Math.pow((CIELab1.L - CIELab2.L), 2) + Math.pow((CIELab1.a - CIELab2.a), 2) + Math.pow((CIELab1.b - CIELab2.b), 2));
  return DeltaE94;
}

/*
  Delta E	  Perception
  <= 1.0	  Not perceptible by human eyes.
  1 - 2	    Perceptible through close observation.
  2 - 10	  Perceptible at a glance.
  11 - 49	  Colors are more similar than opposite
  100	      Colors are exact opposite
  status
  0   Exact Match
  2	  Not perceptible by human eyes.
  4	  Perceptible through close observation.
  8	  Perceptible at a glance.
  16	Colors are exact opposite
*/

function matchColor(CIELab1, ColorCollection) {
  const delta = deltaE1994(CIELab1, ColorCollection.cieLab);
  if (delta === 0) {
    return {
      status: 1,
      name: ColorCollection.name,
      hex: ColorCollection.hex,
      delta,
      message: 'Exact Match'
    };
  } else if (delta > 0 && delta <= 1) {
    return {
      status: 2,
      name: ColorCollection.name,
      hex: ColorCollection.hex,
      delta,
      message: 'Not perceptible by human eyes'
    };
  } else if (delta > 1 && delta < 2) {
    return {
      status: 4,
      name: ColorCollection.name,
      hex: ColorCollection.hex,
      delta,
      message: 'Perceptible through close observation'
    };
  } else if (delta >= 2 && delta < 10) {
    return {
      status: 8,
      name: ColorCollection.name,
      hex: ColorCollection.hex,
      delta,
      message: 'Perceptible at a glance'
    };
  } 
  return {
    status: -1,
    delta,
    message: 'No Color match found'
  };
}

module.exports = function (hexcolor) {
  hexcolor = stringToHex(hexcolor);
  const rgbColor = hexToRGB(hexcolor);
  const cieLabColor = rgbToCIELab(rgbColor);
  const matchedColor = [];

  colors.collection.forEach(element => {
    if (matchColor(cieLabColor, element).status > 0) {
      matchedColor.push(matchColor(cieLabColor, element));
    }
  });

  const matched = matchedColor.reduce((prevColor, currentColor) => (prevColor.delta < currentColor.delta) ? prevColor : currentColor);
  return matched;
};
