from pathlib import Path

import flask

from .model import Photo

app: flask.Flask = flask.current_app
blueprint = flask.Blueprint('photo', __name__, url_prefix='/photos')


@blueprint.route('<path:path>.tiff')
def image_tiff(path):
    """
    /photos/<session>/<set>/<device id>/<camera id>/<timestamp>_<photo id>.tiff
    """
    path = path + ".np"
    photo = Photo(path)

    # TIFF image data
    return flask.Response(photo.to_tiff(), mimetype='image/tiff')


@blueprint.route('<path:path>.png')
def image_png(path):
    """
    /photos/<session>/<set>/<device id>/<camera id>/<timestamp>_<photo id>.png
    """
    path = path + ".np"
    photo = Photo(path)

    # Return the image as a PNG file
    return flask.send_file(photo.to_png(), mimetype='image/png', as_attachment=False)


@blueprint.route('/<path:path>')
def detail(path: str):
    """
    Show the photo metadata

    :param path: The path of the data file
    :return:
    """
    photo = Photo(path)
    return flask.jsonify(photo.metadata)


@blueprint.route('/<path:path>')
def tags(path: str):
    """
    Get all the tags associated with this image
    """
    raise NotImplementedError


@blueprint.route('/')
def list_():
    """
    List all photos.
    :return:
    """
    raise NotImplementedError
