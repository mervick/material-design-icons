# Bootstrap Material Design Icons

Material design icons are the official [icon set](http://www.google.com/design/spec/style/icons.html#icons-system-icons) 
from Google that are designed under the [material design guidelines](http://www.google.com/design/spec).

In the official package the icons uses a typographic feature called [ligatures](http://alistapart.com/article/the-era-of-symbol-fonts), 
which allows rendering of an icon glyph simply by using its textual name.

In this repository also implemented the ability to use the icons in the bootstrap-style, 
like in `glyphicon`, `font-awesome` or `ionicons`.


## Installation

Via package manager (one of following lines):
```
$ component install mervick/bootstrap-material-icons
$ composer require mervick/bootstrap-material-icons
$ bower install bootstrap-material-icons --save
$ npm install bootstrap-material-icons --save
```

## Usage 

Add to your html page in the `head` area
```html
<link rel="stylesheet" href="css/material-icons.css">
```

### Where are two ways to usage:

- Native, this one is awesome but have some troubles
```html
<i class="material-icons">accessibility</i>
<i class="material-icons">3d_rotation</i>
<i class="material-icons">airline_seat_legroom_reduced</i>
```

- In bootstrap-style, 
```html
<i class="mi mi-accessibility"></i>
<i class="mi mi-3d-rotation"></i>
<i class="mi mi-airline-seat-legroom-reduced"></i>
```

Using bootstrap-style, you can also use additional features such as in Font Awesome:
```html
<!-- Inverse -->
<i class="mi mi-attachment mi-inverse"></i>

<!-- Animated --> 
<i class="mi mi-attachment mi-spin"></i>
<i class="mi mi-attachment mi-pulse"></i>

<!-- Fixed width -->
<i class="mi mi-attachment mi-fw"></i>

<!-- Bordered -->
<i class="mi mi-attachment mi-border"></i>

<!-- Pulled -->
<i class="mi mi-attachment pull-left"></i>
<i class="mi mi-attachment pull-right"></i>

<!-- Sizes -->
<i class="mi mi-attachment mi-size-lg"></i>
<i class="mi mi-attachment mi-size-2x"></i>
<i class="mi mi-attachment mi-size-3x"></i>
<i class="mi mi-attachment mi-size-4x"></i>
<i class="mi mi-attachment mi-size-5x"></i>

<!-- Rotations -->
<i class="mi mi-attachment mi-rotate-90"></i>
<i class="mi mi-attachment mi-rotate-180"></i>
<i class="mi mi-attachment mi-rotate-270"></i>

<!-- Flips -->
<i class="mi mi-attachment mi-flip-horizontal"></i>
<i class="mi mi-attachment mi-flip-vertical"></i>

<!-- In lists -->
<ul class="mi-ul">
    <li><i class="mi-li mi mi-keyboard-arrow-right"></i>Lorem ipsum dolor ...</li>
</ul>
```

All icons set you can find in the file `demo.html`.