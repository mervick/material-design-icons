# Material Design Icons

Material design icons are the official [icon set](http://www.google.com/design/spec/style/icons.html#icons-system-icons) 
from Google that are designed under the [material design guidelines](http://www.google.com/design/spec).

In the official package the icons uses a typographic feature called [ligatures](http://alistapart.com/article/the-era-of-symbol-fonts), 
which allows rendering of an icon glyph simply by using its textual name.

In this repository also implemented the ability to use the icons in the bootstrap-style, 
like in `glyphicon`, `font-awesome` or `ionicons`.


## Installation

Via package manager (one of following lines):
```
$ component install mervick/material-design-icons
$ composer require mervick/material-design-icons
$ bower install bootstrap-material-design-icons --save
$ npm install bootstrap-material-design-icons --save
```

## Usage 

Add to your html page in the `head` area
```html
<link rel="stylesheet" href="css/material-icons.css">
```

#### Where are two ways to usage:

- Native, this one is awesome but have some troubles
```html
<i class="material-icons">accessibility</i>
<i class="material-icons">3d_rotation</i>
<i class="material-icons">airline_seat_legroom_reduced</i>
```

- In bootstrap-style, 
```html
<i class="md md-accessibility"></i>
<i class="md md-3d-rotation"></i>
<i class="md md-airline-seat-legroom-reduced"></i>
```

Using bootstrap-style, you can also use additional features such as in Font Awesome:
```html
<!-- Inverse -->
<i class="md md-attachment md-inverse"></i>

<!-- Animated --> 
<i class="md md-attachment md-spin"></i>
<i class="md md-attachment md-pulse"></i>

<!-- Fixed width -->
<i class="md md-attachment md-fw"></i>

<!-- Bordered -->
<i class="md md-attachment md-border"></i>

<!-- Pulled -->
<i class="md md-attachment pull-left"></i>
<i class="md md-attachment pull-right"></i>

<!-- Sizes -->
<i class="md md-attachment md-lg"></i>
<i class="md md-attachment md-2x"></i>
<i class="md md-attachment md-3x"></i>
<i class="md md-attachment md-4x"></i>
<i class="md md-attachment md-5x"></i>

<!-- Rotations -->
<i class="md md-attachment md-rotate-90"></i>
<i class="md md-attachment md-rotate-180"></i>
<i class="md md-attachment md-rotate-270"></i>

<!-- Flips -->
<i class="md md-attachment md-flip-horizontal"></i>
<i class="md md-attachment md-flip-vertical"></i>

<!-- In lists -->
<ul class="md-ul">
    <li><i class="md-li md md-keyboard-arrow-right"></i>Lorem ipsum dolor ...</li>
</ul>
```

All icons set you can find in the file `demo.html`.


##License

- Google Material Design Icons fonts is licensed under the CC-BY-4.0:
  - https://github.com/google/material-design-icons/blob/master/LICENSE
- Bootstrap Material Icons CSS and Sass files are licensed under the MIT License:
  - http://opensource.org/licenses/mit-license.html