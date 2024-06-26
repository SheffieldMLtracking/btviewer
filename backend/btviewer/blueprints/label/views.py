from http import HTTPStatus

import flask

from btviewer.blueprints.photo.model import Photo

app: flask.Flask = flask.current_app
blueprint = flask.Blueprint('label', __name__, url_prefix='/labels')


@blueprint.route('/detail', methods=['GET'])
def detail():
    """
    Get all the tags associated with this image

    Usage:
    /label/detail?path=1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np

    :returns: List of labels
    [
      {"confidence": "Unsure", "x": 321, "y": 789},
      {"confidence": "Sure", "x": 123, "y": 6564},
      {"confidence": "Unsure", "x": 456, "y": 789}
    ]
    """
    photo_path = flask.request.args['path']
    photo = Photo(photo_path)
    return flask.jsonify(photo.labels)


@blueprint.route('/create', methods=['POST'])
def create():
    """
    Create new labels

    The front end will send a POST request to create the labels with an
    array of label information like so:

    POST
    http://localhost:5000/labels/create?path=1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np

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
          "label": "To be, or not to be."
        }
    ]
    """

    # Load the selected image
    photo_path = flask.request.args['path']
    photo = Photo(photo_path)

    # Get the label data from the request
    source = flask.request.args['source']
    version = flask.request.args['version']
    labels = flask.request.json

    # Create the labels
    label_path = photo.add_labels(labels, source=source, version=version)

    # Return a success response
    return flask.jsonify(dict(label_path=label_path)), HTTPStatus.CREATED


@blueprint.route('/delete')
def delete():
    """
    Delete the labels on a photo
    """
    # Load the selected image
    photo_path = flask.request.args['path']
    photo = Photo(photo_path)

    photo.delete_labels()

    return HTTPStatus.OK
