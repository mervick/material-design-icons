# Bootstrap Material Design Icons

Material design icons are the official [icon set](http://www.google.com/design/spec/style/icons.html#icons-system-icons) 
from Google that are designed under the [material design guidelines](http://www.google.com/design/spec).

In the official package the icons uses a typographic feature called [ligatures](http://alistapart.com/article/the-era-of-symbol-fonts), 
which allows rendering of an icon glyph simply by using its textual name. E.g., `<i class="material-icons">face</i>`.

In this repository also implemented the ability to use the icons in the bootstrap-style, like with `glyphicon`, `font-awesome` or `ionicons`.


## Installation

component
```
$ component install mervick/bootstrap-material-icons
```

bower
```
$ bower install bootstrap-material-icons --save
```

npm
```
$ npm install bootstrap-material-icons --save
```

composer
```
$ composer require mervick/bootstrap-material-icons
```

## Usage 

Add to your html code
```html
<link rel="stylesheet" href="css/material-icons.css">
```

Material-style icon:
```html
<i class="material-icons">home</i>
```
Bootstrap-style icon:
```html
<i class="mdicon mdicon-home"></i>
```

All icons set you can find in the file `demo.html`.