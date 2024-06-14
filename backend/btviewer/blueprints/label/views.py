import flask

blueprint = flask.Blueprint('label', __name__, url_prefix='/labels')


@blueprint.route('/')
def list_():
    raise NotImplementedError
