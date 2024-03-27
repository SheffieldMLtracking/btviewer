from retrodetect.image_processing import getshift, shiftimg

def getimgfilelist(path, camid=None):
    if camid is not None:
        return sorted(glob('%s/*%s*.np' % (path, camid)))
    else:
        return sorted(glob('%s/*.np' % (path)))


def getcamfromfilename(fn):
    res = re.findall('photo_object_([0-9A-Z]*)_[0-9]{8}_', fn)
    if len(res) == 0:
        return None
    else:
        return res[0]


def getfnfordatetimeandcamid(path, camid, datetime):
    fns = glob('%s/*%s_%s*.np' % (path, camid, datetime))
    if len(fns) == 0:
        return None
    else:
        return fns[0]


def getdatetimefromfilename(fn):
    res = re.findall('photo_object_[0-9A-Z]*_([0-9]{8}_[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{6})_', fn)
    if len(res) == 0:
        return None
    else:
        return res[0]


def getdatetimelist(path):
    """
    Returns a list of all unique datetimes in path
    """
    fns = getimgfilelist(path)
    return sorted(list(set([getdatetimefromfilename(fn) for fn in fns if getdatetimefromfilename(fn) is not None])))


def guesscamtypegetscore(fn):
    photo = pickle.load(open(fn, 'rb'))
    img = photo['img']
    if img is None: return np.NaN
    # e.g. 0.0001 = greyscale, 0.7 = colour
    score = np.abs(np.mean(img[0:-2:2, 0:-2:2] / 2 + img[2::2, 2::2] / 2 - img[1:-2:2, 1:-2:2]) / np.mean(img))
    return score


def guesscamtype(path, camid):
    score = np.nanmean([guesscamtypegetscore(fn) for fn in getimgfilelist(path, camid)[:50:5]])
    if score < 0.02:
        return 'greyscale'
    else:
        return 'colour'


def getorderedcamids(path):
    """
    Returns camera ids with greyscale ones first
    """
    fns = getimgfilelist(path)
    cam_ids = list(set([getcamfromfilename(fn) for fn in fns if getcamfromfilename(fn) is not None]))
    return [cam_id for cam_id in cam_ids if guesscamtype(path, cam_id) == 'greyscale'] + [cam_id for cam_id in cam_ids
                                                                                          if guesscamtype(path,
                                                                                                          cam_id) == 'colour']


def getimgfilename(cam, internalcam, number):
    path = pathtoimgs[cam]
    dts = getdatetimelist(path)
    if number >= len(dts): return None

    try:
        fn = getfnfordatetimeandcamid(pathtoimgs[cam], camera_ids[cam][internalcam], dts[number])
    except IndexError:
        return None
    return fn


def gethash(obj):
    """
    Returns a 160 bit integer hash
    """
    return int(hashlib.sha1(obj).hexdigest(), 16)


def converttodt(st):
    return datetime.strptime(st, '%H:%M:%S')

def load_img(fn):
    try:
        rawdata = np.load(fn, allow_pickle=True)
    except OSError:
        return None, None, None
    if type(rawdata) == list:
        n, img, data = rawdata
    if type(rawdata) == dict:
        n = rawdata['index']
        img = rawdata['img']
        data = rawdata['record']
    return n, img, data

def getcachedshift(cam, internalcam, number):
    path = pathtoimgs[cam]
    cachefile = 'cache/shift_cache_%s.pkl' % (gethash(path.encode("utf-8")))
    if internalcam == 0:
        return None
    try:
        cache = pickle.load(open(cachefile, 'rb'))
    except FileNotFoundError:
        cache = {}
    if cam in cache:
        if number // 20 in cache[cam]:
            return cache[cam][number // 20]
    else:
        cache[cam] = {}

    fn = getimgfilename(cam, internalcam, number)
    n, img, data = load_img(fn)
    fn = getimgfilename(cam, 0, number)  # get 0th internal cam -> should be greyscale...
    grey_n, grey_img, grey_data = load_img(fn)
    shift = getshift(grey_img, img, step=1)
    shift[0] -= 2  # trying to correct for difference in camera locations!
    cache[cam][number // 20] = shift
    pickle.dump(cache, open(cachefile, 'wb'))
    return shift

def load_data(cam, internalcam, number):
    beetrackfn = pathtoimgsdir + "/bee_track.json"
    try:
        data = json.load(open(beetrackfn, 'r'))
    except FileNotFoundError:
        data = {}
    # print(data)
    camst = str(cam)
    # internalcamst = str(internalcam) #not used.
    numberst = str(number)

    if camst not in data:
        return []
    if numberst not in data[camst]:
        return []
    return data[camst][numberst]

def save_pos(cam, internalcam, number, x, y, confidence, label=None):
    fn = getimgfilename(cam, internalcam, number)
    beetrackfn = pathtoimgsdir + "/bee_track.json"
    try:
        data = json.load(open(beetrackfn, 'r'))
    except FileNotFoundError:
        data = {}
    camst = str(cam)
    numberst = str(number)
    if camst not in data:
        data[camst] = {}
    if numberst not in data[camst]:
        data[camst][numberst] = []
    newrecord = {'x': x, 'y': y, 'confidence': confidence, 'fn': fn}
    if label is not None: newrecord['label'] = label
    shift = getcachedshift(cam, internalcam, number)
    if shift is not None:
        newrecord['shift'] = [int(shift[0]), int(shift[1])];
    data[camst][numberst].append(newrecord);
    json.dump(data, open(beetrackfn, 'w'), indent=4)