# Bootstrap Material Design Icons

Material design icons are the official [icon set](http://www.google.com/design/spec/style/icons.html#icons-system-icons) 
from Google that are designed under the [material design guidelines](http://www.google.com/design/spec).

In the official package the icons uses a typographic feature called [ligatures](http://alistapart.com/article/the-era-of-symbol-fonts), 
which allows rendering of an icon glyph simply by using its textual name.

In this repository also implemented the ability to use the icons in the bootstrap-style, 
like in `glyphicon`, `font-awesome` or `ionicons`.


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
<link rel="stylesheet" href="css/material-icons.min.css">
```

Material-style icons:
```html
<i class="material-icons">accessibility</i>
<i class="material-icons">3d_rotation</i>
<i class="material-icons">airline_seat_legroom_reduced</i>
```
Bootstrap-style icons:
```html
<i class="mi mi-accessibility"></i>
<i class="mi mi-3d-rotation"></i>
<i class="mi mi-airline-seat-legroom-reduced"></i>
```

All icons set you can find in the file `demo.html`.