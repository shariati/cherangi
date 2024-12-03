# Cherangi

[![npm version](https://badge.fury.io/js/cherangi.svg)](https://badge.fury.io/js/cherangi)
[![Known Vulnerabilities](https://snyk.io/test/github/shariati/cherangi/badge.svg)](https://snyk.io/test/github/shariati/cherangi)

# ⚠️ Discontinued - Please Use color-names Instead

This project has been discontinued in favor of [color-names](https://github.com/meodai/color-names), which provides all the features of Cherangi and much more:

- **Larger Color Database**: Over 30,000 unique color names
- **Multiple Language Support**: Java, Kotlin, C#, and JavaScript
- **Free Public REST API**: Easy to integrate with any platform
- **Better Color Matching**: More accurate color-to-name mapping
- **Regular Updates**: Actively maintained and frequently updated
- **Multiple Format Support**: JSON, CSV, YML, XML, HTML, SCSS
- **CDN Available**: For quick integration
- **Well Documented**: Comprehensive documentation and examples

## Migration Guide

To migrate from Cherangi to color-names, please visit:
[color-names Documentation](https://github.com/meodai/color-names#readme)

### Quick Start with color-names

```javascript
// Install
npm install color-name-list

// Usage
import { colornames } from 'color-name-list';

// Find exact color
const color = colornames.find(color => color.hex === '#ffffff');
console.log(color.name); // => white

// Find closest color using their API
// https://api.color.pizza/v1/?values=00f,f00,f00
```

## Historical Information

Cherangi (چه رنگی) means "What color?" in Farsi (Persian). This project was created to help developers find color names programmatically, but has since been superseded by the more comprehensive color-names project.

## Thanks

Special thanks to all contributors and users who supported this project. For continued color naming needs, please support the [color-names](https://github.com/meodai/color-names) project.

## License

MIT © [Amin Shariati](LICENSE)
