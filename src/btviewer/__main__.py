#!/usr/bin/env python

from flask import Flask, make_response, jsonify
import numpy as np
from flask_cors import CORS

# from flask_compress import Compress

# Flask constructor takes the name of
# current module (__name__) as argument.#so btviewer
app = Flask(__name__)
# Compress(app)
CORS(app)
from glob import glob
from retrodetect.image_processing import getblockmaxedimage
import argparse
import webbrowser
import os
import re
import retrodetect
import pickle
import json
from datetime import datetime
import numpy as np
import re
import pickle
import hashlib

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

if (len(pathtoimgs) == 0):
    print("Failed to find any folders in the path, using base path given as camera folder.")
    pathtoimgs = [pathtoimgsdir]
print("Found the following camera folders:")
print(pathtoimgs)

scriptpath = os.path.dirname(os.path.realpath(__file__))
os.chdir(scriptpath)
print(scriptpath)
# indexhtml = os.path.join(scriptpath, 'index.html')
# webbrowser.open("file://index.html",new=2)
webbrowser.open("file://" + os.path.realpath('templates/index.html'), new=2)

if 'port' in args:
    port = args.port
else:
    port = 5000

if args.config is not None:
    configfilename = pathtoimgsdir + '/' + args.config
else:
    configfilename = pathtoimgsdir + '/config_unnamed.json'
print(configfilename)


camera_ids = []
for pti in pathtoimgs:
    camera_ids.append(getorderedcamids(pti))



#1
@app.route('/getindexoftime/<int:cam>/<string:dtstring>')
def getindexoftime(cam, dtstring):
    fns = getimgfilelist(pathtoimgs[cam])
    # targ = converttodt(dtstring) #'20210720_13:58:00.000000')
    # gotoNum = np.argmin(np.abs([(converttodt(re.findall('.*_([0-9]{8}_[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{6})__',fn)[0])-targ).total_seconds() for fn in fns]))

    targ = converttodt(dtstring)  # '13:58:00.000000')
    gotoNum = np.argmin(np.abs(
        [(converttodt(re.findall('.*_([0-9]{2}:[0-9]{2}:[0-9]{2})', fn)[0]) - targ).total_seconds() for fn in fns]))
    return json.dumps(int(gotoNum))


@app.route('/detectfromto/<int:cam>/<int:from_idx>/<int:to_idx>')
def detectall(cam, from_idx, to_idx):
    print("STARTING DETECTION RUN: %d to %d" % (from_idx, to_idx));
    for i in range(from_idx, to_idx):
        detect(cam, i)
    return "done"




@app.route('/detect/<int:cam>/<int:number>')
def detect(cam, number):
    path = pathtoimgs[cam]
    cachefile = 'cache/detect_cache_%s_%d.pkl' % (gethash(path.encode("utf-8")), number)

    if not args.refreshcache:
        try:
            result = pickle.load(open(cachefile, 'rb'))
            print("Cache hit %s" % cachefile)
            return result

        except FileNotFoundError:
            pass
    photo_list = []
    for n in range(number - 10, number + 2):
        if n < 0: continue
        fn = getimgfilename(cam, 0, n)
        try:
            photoitem = np.load(fn, allow_pickle=True)
        except OSError:
            continue  # skip this one if we can't access it
        if photoitem is not None:
            if photoitem['img'] is not None:
                photoitem['img'] = photoitem['img'].astype(np.float16)
        photo_list.append(photoitem)
    contact, found, _ = retrodetect.detectcontact(photo_list, len(photo_list) - 1, Npatches=50, delsize=5, blocksize=3,
                                                  flashthreshold=0.01)
    newcontact = []
    if contact is not None:
        for c in contact:
            c['patch'] = c['patch'].tolist()  # makes it jsonable
            c['searchpatch'] = c['searchpatch'].tolist()  # makes it jsonable
            c['mean'] = float(c['mean'])
            c['searchmax'] = float(c['searchmax'])
            c['centremax'] = float(c['centremax'])
            c['x'] = int(c['x'])
            c['y'] = int(c['y'])
            newcontact.append(c)
    result = jsonify({'contact': newcontact, 'found': found})
    pickle.dump(result, open(cachefile, 'wb'))
    return result


@app.route('/')
def hello_world():
    return 'root node of bee label API.'


@app.route('/filename/<int:cam>/<int:internalcam>/<int:number>')
def filename(cam, internalcam, number):
    fn = getimgfilename(cam, internalcam, number)
    photoitem = np.load(fn, allow_pickle=True)
    returnst = fn
    print(photoitem['record'])
    if 'estimated_true_triggertimestring' in photoitem['record']:
        returnst = returnst + ' (' + photoitem['record']['estimated_true_triggertimestring'] + ')'
    return jsonify(returnst)


@app.route('/configure/<string:path>')
def configure(path):
    global pathtoimgs
    pathtoimgs = path
    return "set new path %s" % path




@app.route('/savelm/<int:cam>/<int:internalcam>/<int:x>/<int:y>/<string:lmname>/<string:coords>')
def savelm(cam, internalcam, x, y, lmname, coords):
    print(coords, len(coords))
    if len(coords.split(",")) == 3:
        coords = [float(s) for s in coords.split(",")]

    try:
        data = json.load(open(configfilename, 'r'))
    except FileNotFoundError:
        data = {}
    camst = 'cam%d' % (cam + 1)  # TODO The camera id stuff is a complete mess.
    internalcamst = 'internalcam%d' % internalcam  # not using which internal camera for now...
    if 'items' not in data:
        data['items'] = {}
    if lmname not in data['items']:
        data['items'][lmname] = {}
    if 'imgcoords' not in data['items'][lmname]:
        data['items'][lmname]['imgcoords'] = {}
    if coords != "skip":
        data['items'][lmname]['coords'] = coords
    data['items'][lmname]['imgcoords'][camst] = [x, y]

    json.dump(data, open(configfilename, 'w'), indent=4)
    return "done"





@app.route('/savepos/<int:cam>/<int:internalcam>/<int:number>/<int:x>/<int:y>/<int:confidence>/<string:label>')
def savepos(cam, internalcam, number, x, y, confidence, label):
    save_pos(cam, internalcam, number, x, y, confidence, label)
    return "done"


@app.route('/deleteallpos/<int:cam>/<int:internalcam>/<int:number>')
def deleteallpos(cam, internalcam, number):
    beetrackfn = pathtoimgsdir + "/bee_track.json"
    try:
        data = json.load(open(beetrackfn, 'r'))
    except FileNotFoundError:
        data = {}
    cam = str(cam)
    number = str(number)
    if cam not in data:
        data[cam] = {}
    if number not in data[cam]:
        data[cam][number] = []
    data[cam][number] = [];

    json.dump(data, open(beetrackfn, 'w'), indent=4)
    return "done"


@app.route('/loadpos/<int:cam>/<int:internalcam>/<int:number>')
def loadpos(cam, internalcam, number):
    d = load_data(cam, internalcam, number)
    return json.dumps(d)


@app.route('/stick/<int:cam>/<int:internalcam>/<int:number>/<int:numtags>')
def stick(cam, internalcam, number, numtags):
    """
    Experiments using a stick to image multiple tags require lots to be labelled simultaneously.
    This does that.
    """
    d = load_data(cam, internalcam, number)
    fn = getimgfilename(cam, internalcam, number)
    n, img, data = load_img(fn)
    if len(d) != 2:
        return "failed"
    xs = np.linspace(d[0]['x'], d[1]['x'], numtags)
    ys = np.linspace(d[0]['y'], d[1]['y'], numtags)

    # delete the old ones
    deleteallpos(cam, number)

    box = 5  # search box size for bright spots
    for i, (x, y) in enumerate(zip(xs, ys)):
        imgbox = img[int(y - box):int(y + box), int(x - box):int(x + box)]
        brightloc = np.unravel_index(imgbox.argmax(), imgbox.shape)[::-1] + np.array([x, y]) - box
        print(x, y, brightloc)
        print(img[int(y - box):int(y + box), int(x - box):int(x + box)])
        save_pos(cam, number, brightloc[0], brightloc[1], 10, 'sticktag%d' % i)
    return "done"








@app.route('/getimage/<int:cam>/<int:internalcam>/<int:number>/<int:x1>/<int:y1>/<int:x2>/<int:y2>')
def getimage(cam, internalcam, number, x1, y1, x2, y2):
    fn = getimgfilename(cam, internalcam, number)

    print(fn)
    n, img, data = load_img(fn)

    if img is None:
        return jsonify({'index': -1, 'photo': 'failed', 'record': 'failed'})

    if internalcam > 0:
        shift = getcachedshift(cam, internalcam, number)
        img = shiftimg(img, shift, 0)

    # fns = sorted(glob('%s/*.np'%(pathtoimgs)))
    # if len(fns)==0:
    #    return "Image not found"

    steps = int((x2 - x1) / 500)
    if steps < 1: steps = 1
    # img = (img.T[x1:x2:steps,y1:y2:steps]).T

    img = (img.T[x1:x2, y1:y2]).T
    k = int(img.shape[0] / steps)
    l = int(img.shape[1] / steps)
    img = img[:k * steps, :l * steps].reshape(k, steps, l, steps).max(axis=(-1, -3))

    # img[int(img.shape[0]/2),:] = 255
    # img[:,int(img.shape[1]/2)] = 255
    return jsonify({'index': n, 'photo': img.tolist(), 'record': data})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
