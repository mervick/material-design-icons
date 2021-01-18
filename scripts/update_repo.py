#!/usr/bin/env python3
#
# Copyright 2020 Google LLC
# Copyright 2021 Andrey Izman <izmanw@gmail.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import os
import json
import icons
import download_fonts
from pathlib import Path
import re
import requests
import time
from typing import NamedTuple, Set, Sequence, Tuple


_METADATA_URL = "http://fonts.google.com/metadata/icons?incomplete=1"


class Asset(NamedTuple):
    src_url_pattern: str
    dest_dir_pattern: str


class Fetch(NamedTuple):
    src_url: str
    dest_file: Path


class Icon(NamedTuple):
    name: str
    category: str
    version: int
    sizes_px: Tuple[int, ...]
    stylistic_sets: Set[str]


_SET_ASSETS = (
    # Fonts are acquired by abusing the Google Fonts web api. Nobody tell them :D
    Asset(
        "https://fonts.googleapis.com/css2?family={stylistic_set_url}",
        "fonts/{version}/{stylistic_set_font}.css",
    ),
)


def _latest_metadata():
    resp = requests.get(_METADATA_URL)
    resp.raise_for_status()
    raw_json = resp.text[5:]
    return json.loads(raw_json)


def _current_versions():
    return (Path(__file__) / "../current_versions.json").resolve()


def _version_key(icon: Icon):
    return f"{icon.category}::{icon.name}"


def _icons(metadata):
    all_sets = set(metadata["families"])
    for raw_icon in metadata["icons"]:
        unsupported = set(raw_icon["unsupported_families"])
        yield Icon(
            raw_icon["name"],
            raw_icon["categories"][0],
            raw_icon["version"],
            tuple(raw_icon["sizes_px"]),
            all_sets - unsupported,
        )


def ucwords(s):
    return " ".join([w[0].upper() + w[1:] for w in s.split(' ')])


def _create_fetch(asset, args):
    src_url = asset.src_url_pattern.format(**args)
    dest_file = asset.dest_dir_pattern.format(**args)
    dest_file = (Path(__file__) / "../.." / dest_file).resolve()
    return Fetch(src_url, dest_file)


def _do_fetch(fetch):
    resp = requests.get(fetch.src_url)
    resp.raise_for_status()
    fetch.dest_file.parent.mkdir(parents=True, exist_ok=True)
    fetch.dest_file.write_bytes(resp.content)


def _do_fetches(fetches):
    start_t = time.monotonic()
    print_t = start_t
    for idx, fetch in enumerate(fetches):
        _do_fetch(fetch)
        t = time.monotonic()
        if t - print_t > 5:
            print_t = t
            est_complete = (t - start_t) * (len(fetches) / (idx + 1))
            print(f"{idx}/{len(fetches)}, estimating {int(est_complete)}s left")


def _fetch_fonts(css_files: Sequence[Path]):
    fonts = {}
    codepoints = {}

    for css_file in css_files:
        css = css_file.read_text()
        url = re.search(r"src:\s+url\(([^)]+)\)", css).group(1)
        assert url.endswith(".otf") or url.endswith(".ttf")
        fetch = Fetch(url, css_file.parent / (css_file.stem + url[-4:]))
        _do_fetch(fetch)
        css_file.unlink()

        with open(fetch.dest_file.with_suffix(".codepoints"), "w") as f:
            for name, codepoint in sorted(icons.enumerate(fetch.dest_file)):
                f.write(f"{name} {codepoint:04x}\n")
                codepoints[name] = f"{codepoint:04x}";

        font = fetch.dest_file.with_suffix('').name
        fonts[font] = ucwords(font.replace('-', ' '))

    return fonts, codepoints


def _is_css(p: Path):
    return p.suffix == ".css"


def _files(fetches: Sequence[Fetch], pred):
    return [f.dest_file for f in fetches if pred(f.dest_file)]


def _pattern_args(metadata, stylistic_set):
    return {
        "host": metadata["host"],
        "stylistic_set_snake": stylistic_set.replace(" ", "").lower(),
        "stylistic_set_url": stylistic_set.replace(" ", "+"),
        "stylistic_set_font": stylistic_set.replace(" ", "-").lower(),
    }


def get_codepoints(version):
    current_versions = json.loads(_current_versions().read_text())
    metadata = _latest_metadata()
    stylistic_sets = tuple(metadata["families"])

    fetches = []
    skips = []

    for icon in tuple(_icons(metadata)):
        ver_key = _version_key(icon)
        if icon.version <= current_versions.get(ver_key, 0):
            continue
        current_versions[ver_key] = icon.version

    for stylistic_set in stylistic_sets:
        for asset in _SET_ASSETS:
            pattern_args = _pattern_args(metadata, stylistic_set)
            pattern_args.update({"version": version})
            fetch = _create_fetch(asset, pattern_args)
            fetches.append(fetch)

    _do_fetches(fetches)

    with open(_current_versions(), "w") as f:
        json.dump(current_versions, f, indent=4, sort_keys=True)

    return _fetch_fonts(_files(fetches + skips, _is_css))


def update():
    f = (Path(__file__) / "../../package.json").resolve().open('r')
    package = json.load(f)
    version = package["version"]

    # get fonts and codepoints
    fonts, codepoints = get_codepoints(version)

    # download fonts
    for _, font in fonts.items():
        download_fonts.download_font(font, version)

    metadata = _latest_metadata()

    f = (Path(__file__) / "../../demo/js/metadata.js").resolve().open('w')
    f.write(('window.metadata = ' + json.dumps(metadata) + ';'))

    # generate css
    with (Path(__file__) / "../../scss/_icons.scss").resolve().open('w') as f:
        f.write("@import \"variables\";\n\n")
        for icon in metadata["icons"]:
            f.write(".#{{$md-prefix}}-{name}:before {{ content: \"\\{codepoint}\"; }}\n".format(
                name=icon["name"].replace('_', '-'),
                codepoint=codepoints[icon["name"]]
            ))


if __name__ == '__main__':
    update()
