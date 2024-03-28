from btviewer import app

import os
from glob import glob
import argparse

parser = argparse.ArgumentParser(description='Provide simple interface to label bee images')
parser.add_argument('imgpath', type=str, help='Path to images')
parser.add_argument('--refreshcache', help='Whether to refresh the cache', action="store_true")
parser.add_argument('--port', required=False, type=int, help='Port')
parser.add_argument('--config', required=False, type=str, help='Config Filename, e.g. config000000.json')

args = parser.parse_args()

pathtoimgsdir = args.imgpath  # '/home/mike/Documents/Research/bee/photos2020/photos_June20'
print("Absolute path to images:")
print(os.path.abspath(pathtoimgsdir))
pathtoimgsdir = os.path.abspath(pathtoimgsdir)
pathtoimgs = sorted(glob(pathtoimgsdir + '/*/'))

if 'port' in args:
    port = args.port
else:
    port = 5000


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)