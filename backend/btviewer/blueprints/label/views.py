from http import HTTPStatus

import flask

from btviewer.blueprints.photo.model import Photo

blueprint = flask.Blueprint('label', __name__, url_prefix='/labels')


@blueprint.route('/<path:path>', methods=['GET'])
def detail(path: str):
    """
    Get all the tags associated with this image
    """
    photo = Photo(path)
    return flask.jsonify(photo.labels)


@blueprint.route('/<path:path>', methods=['POST'])
def create(path: str):
    """
    Create a new label

    {
      "x": 123,
      "y": 456,
      "confident": true,
      "label": "not the bees!"
    }
    """
    photo = Photo(path)

    photo.add_label(
        x=int(flask.request.form['x']),
        y=int(flask.request.form['y']),
        confident=bool(flask.request.form['confident']),
        label=str(flask.request.form['label']),
    )

    return HTTPStatus.CREATED
