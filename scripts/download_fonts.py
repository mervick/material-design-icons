#!/usr/bin/env python3
#
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

import re
import os
import requests
import json
from pathlib import Path


def download_font(font_family, version):
    output_directory = os.path.dirname(__file__) + '/../fonts/' + version
    download_fonts(font_family, output_directory)


def download_fonts(font_family, output_directory, output_file_name=None):
    if not os.path.isdir(output_directory):
        os.makedirs(output_directory)

    if not output_file_name:
        output_file_name = font_family.lower().replace(" ", "-")

    user_agents = USER_AGENTS.splitlines()
    user_agents = map(lambda x: x, user_agents)

    font_urls = set()
    for user_agent in user_agents:
        url = 'https://fonts.googleapis.com/css2?family={}'.format("+".join(font_family.strip().split()))
        r = requests.get(url, headers={"user-agent": user_agent})
        r.raise_for_status()
        urls = re.findall('url\((.*?)\)', r.text)
        urls = map(str, urls)
        urls = filter(str, urls)
        font_urls.update(urls)

    fonts_map = {font_url.split('.')[-1].lower(): font_url for font_url in font_urls}

    for file_extension, url in fonts_map.items():
        file_path = os.path.join(output_directory, '{output_file_name}.{file_extension}'.format(
            output_file_name=output_file_name, file_extension=file_extension))
        _download_file(url, file_path)


USER_AGENTS = """
Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.3) Gecko/20090913 Firefox/3.5.3
Mozilla/5.0 (Windows; U; Windows NT 6.1; en; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)
Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)
Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.1) Gecko/20090718 Firefox/3.5.1
Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/4.0.219.6 Safari/532.1
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.5.30729; .NET CLR 3.0.30729)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Win64; x64; Trident/4.0)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SV1; .NET CLR 2.0.50727; InfoPath.2)Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)
Mozilla/4.0 (compatible; MSIE 6.1; Windows XP)
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246
Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36
Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; da-dk) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1
Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00
Mozilla/5.0 (Linux; U; Android 2.3.4; fr-fr; HTC Desire Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
Mozilla/5.0 (Linux; Android 7.0; SAMSUNG SM-N920C Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/6.2 Chrome/56.0.2924.87 Mobile Safari/537.36
Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 BIDUBrowser/2.x Safari/537.31
Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36
Mozilla/5.0 (Android 8.0.0; Tablet; rv:57.0) Gecko/57.0 Firefox/57.0
Mozilla/5.0 (Android 8.1.0; Mobile; rv:61.0) Gecko/61.0 Firefox/61.0
"""


def _download_file(url, file_path):
    try:
        r = requests.get(url)
        r.raise_for_status()
        with open(file_path, 'wb') as f:
            f.write(r.content)
    except requests.exceptions.HTTPError:
        return


if __name__ == '__main__':
    f = (Path(__file__) / "../../package.json").resolve().open('r')
    package = json.load(f)
    download_font("Material Icons", package["version"])
    download_font("Material Icons Outlined", package["version"])
    download_font("Material Icons Round", package["version"])
    download_font("Material Icons Sharp", package["version"])
    download_font("Material Icons Two Tone", package["version"])
