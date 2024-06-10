from .model import Photo

import flask

blueprint = flask.Blueprint('photo', __name__, url_prefix='/photo')


@blueprint.route('/<path:filename>')
def detail(filename):
    """
    Serves the photo detail page
    :param filename:
    :return:
    """
    photo = Photo(filename)
    raise NotImplementedError


@blueprint.route('/')
def list_():
    """
    List all photos.
    :return:
    """
    raise NotImplementedError
