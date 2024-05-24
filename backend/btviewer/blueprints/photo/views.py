import flask

from .model import Photo

app: flask.Flask = flask.current_app

blueprint = flask.Blueprint('photo', __name__)


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
