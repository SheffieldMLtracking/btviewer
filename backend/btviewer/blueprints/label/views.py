from http import HTTPStatus

import flask

from btviewer.blueprints.photo.model import Photo

app: flask.Flask = flask.current_app
blueprint = flask.Blueprint('label', __name__, url_prefix='/labels')


@blueprint.route('/detail?path=<path:photo_path>', methods=['GET'])
def detail(photo_path: str):
    """
    Get all the tags associated with this image
    """
    photo = Photo(photo_path)
    return flask.jsonify(photo.labels)


@blueprint.route('/create', methods=['POST'])
def create():
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

    # Load the selected image
    photo_path = flask.request.args['path']
    source = flask.request.args['source']
    photo = Photo(photo_path)

    # Get the label data from the request
    labels = flask.request.json

    # Create the labels
    photo.add_labels(labels, source=source)

    # Return a success response
    return flask.Response(status=HTTPStatus.CREATED)
