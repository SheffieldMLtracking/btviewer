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
    Create new labels

    The front end will send a POST request to create the labels with an
    array of label information like so:

    POST
    http://localhost:5000/labels/create

    [
        {
          "x": 123,
          "y": 456,
          "confident": true,
          "label": "not the bees!"
        },
        {
          "x": 123,
          "y": 456,
          "confident": true,
          "label": "not the bees!"
        }
    ]
    """
    photo = Photo(path)

    # Get the label data from the request
    labels = flask.request.json

    # Create the labels
    photo.add_labels(labels)

    # Return a success response
    return HTTPStatus.CREATED
