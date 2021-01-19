# Material Design Icons
[mervick.github.io/material-design-icons](http://mervick.github.io/material-design-icons/)

Material design icons are the official [icon set](http://www.google.com/design/spec/style/icons.html#icons-system-icons)
from Google that are designed under the [material design guidelines](http://www.google.com/design/spec).

## Installation

#### Yarn
```shell
yarn add @mervick/mdi-icons
```

#### NPM
```shell
npm install @mervick/mdi-icons --save
```

## Usage

Add to your html page in the `head` area
```html
<!-- This include bundle of CSS classes with all Material Icons fonts (5 fonts) -->
<link href="css/material-icons.min.css" rel="stylesheet">
```

You can customize and use only fonts you want:
```html
<!-- base CSS classes (required) -->
<link href="css/material-icons-base.min.css" rel="stylesheet">

<!-- loads Material Icons Regular font -->
<link href="css/material-icons-regular.min.css" rel="stylesheet">

<!-- loads Material Icons Outlined font -->
<link href="css/material-icons-outlined.min.css" rel="stylesheet">

<!-- loads Material Icons Round font -->
<link href="css/material-icons-round.min.css" rel="stylesheet">

<!-- loads Material Icons Sharp font -->
<link href="css/material-icons-sharp.min.css" rel="stylesheet">

<!-- loads Material Icons Two Tone font -->
<link href="css/material-icons-two-tone.min.css" rel="stylesheet">
```

You can also use fonts from Google Fonts:
```html
<!-- base CSS classes (required) -->
<link href="css/material-icons-base.min.css" rel="stylesheet">

<!-- loads Material Icons Regular font -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">

<!-- loads Material Icons Outlined font -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">

<!-- loads Material Icons Round font -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">

<!-- loads Material Icons Sharp font -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">

<!-- loads Material Icons Two Tone font -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Two+Tone" rel="stylesheet">
```

#### There are two ways to use:

- Ligature, this one is awesome but have some troubles
```html
<!-- Material Icons Regular font -->
<i class="material-icons">accessibility</i>
<i class="material-icons">3d_rotation</i>
<i class="material-icons">airline_seat_legroom_reduced</i>

<!-- Material Icons Outlined font -->
<i class="material-icons-outlined">accessibility</i>
<i class="material-icons-outlined">3d_rotation</i>
<i class="material-icons-outlined">airline_seat_legroom_reduced</i>

<!-- Material Icons Round font -->
<i class="material-icons-round">accessibility</i>
<i class="material-icons-round">3d_rotation</i>
<i class="material-icons-round">airline_seat_legroom_reduced</i>

<!-- Material Icons Sharp font -->
<i class="material-icons-sharp">accessibility</i>
<i class="material-icons-sharp">3d_rotation</i>
<i class="material-icons-sharp">airline_seat_legroom_reduced</i>

<!-- Material Icons Two Tone font -->
<i class="material-icons-two-tone">accessibility</i>
<i class="material-icons-two-tone">3d_rotation</i>
<i class="material-icons-two-tone">airline_seat_legroom_reduced</i>
```

- CSS classes (preferred)
```html
<!-- Material Icons Regular font -->
<i class="mdi mdi-accessibility"></i>
<i class="mdi mdi-3d-rotation"></i>
<i class="mdi mdi-airline-seat-legroom-reduced"></i>

<!-- Material Icons Outlined font -->
<i class="mdi-outlined mdi-accessibility"></i>
<i class="mdi-outlined mdi-3d-rotation"></i>
<i class="mdi-outlined mdi-airline-seat-legroom-reduced"></i>

<!-- Material Icons Round font -->
<i class="mdi-round mdi-accessibility"></i>
<i class="mdi-round mdi-3d-rotation"></i>
<i class="mdi-round mdi-airline-seat-legroom-reduced"></i>

<!-- Material Icons Sharp font -->
<i class="mdi-sharp mdi-accessibility"></i>
<i class="mdi-sharp mdi-3d-rotation"></i>
<i class="mdi-sharp mdi-airline-seat-legroom-reduced"></i>

<!-- Material Icons Two Tone font -->
<i class="mdi-two-tone mdi-accessibility"></i>
<i class="mdi-two-tone mdi-3d-rotation"></i>
<i class="mdi-two-tone mdi-airline-seat-legroom-reduced"></i>
```

Using CSS classes, you can also use additional features such as:
```html
<!-- Inverse -->
<i class="mdi mdi-attachment mdi-inverse"></i>

<!-- Animated -->
<i class="mdi mdi-attachment mdi-spin"></i>
<i class="mdi mdi-attachment mdi-pulse"></i>

<!-- Fixed width -->
<i class="mdi mdi-attachment mdi-fw"></i>

<!-- Bordered -->
<i class="mdi mdi-attachment mdi-border"></i>

<!-- Pulled -->
<i class="mdi mdi-attachment pull-left"></i>
<i class="mdi mdi-attachment pull-right"></i>

<!-- Sizes -->
<i class="mdi mdi-attachment mdi-lg"></i>
<i class="mdi mdi-attachment mdi-2x"></i>
<i class="mdi mdi-attachment mdi-3x"></i>
<i class="mdi mdi-attachment mdi-4x"></i>
<i class="mdi mdi-attachment mdi-5x"></i>

<!-- Rotations -->
<i class="mdi mdi-attachment mdi-rotate-90"></i>
<i class="mdi mdi-attachment mdi-rotate-180"></i>
<i class="mdi mdi-attachment mdi-rotate-270"></i>

<!-- Flips -->
<i class="mdi mdi-attachment mdi-flip-horizontal"></i>
<i class="mdi mdi-attachment mdi-flip-vertical"></i>

<!-- In lists -->
<ul class="mdi-ul">
    <li><i class="mdi-li mdi mdi-keyboard-arrow-right"></i>Lorem ipsum dolor ...</li>
</ul>
```

## Licenses

- Google Material Design Icons fonts are licensed under the CC-BY-4.0:
  - https://github.com/google/material-design-icons/blob/master/LICENSE

- Python scripts are licensed under the Apache License, Version 2.0:
  - http://www.apache.org/licenses/LICENSE-2.0

- Bootstrap Material Design Icons CSS and SCSS files are licensed under the MIT License:
  - http://opensource.org/licenses/mit-license.html
