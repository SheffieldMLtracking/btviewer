import flask

blueprint = flask.Blueprint('label', __name__, url_prefix='/labels')


@blueprint.route('/<path:path>')
def labels(path: str):
    """
    Get all the tags associated with this image
    """
    photo = Photo(path)
    return flask.jsonify(photo.labels)
