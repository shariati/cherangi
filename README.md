# Cherangi 
A small javascript library that helps you find the name of a color (Over 10000 color names).


![](screenshot.png)

## Install

```
$ npm install --save cherangi
```


## Usage

```js
const cherangi = require('cherangi');

cherangi('#cfcfcf');

```


## CLI

```
$ npm install --global cherangi
```

```
$ cherangi --help

  Usage
    cherangi 'hexcode'
    cherangi '#hexcode'

  Example
    cherangi 'fff'
    cherangi '#fcfcfc'
```

## Thanks to
* David Aerne for the awesome list of color names (https://github.com/meodai/color-names) 
* EasyRGB.com for providing the formulas
* Zachary Schuessler for the helpful blog about Delta (http://zschuessler.github.io/DeltaE/learn/#toc-defining-delta-e)
