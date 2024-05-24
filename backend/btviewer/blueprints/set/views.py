from .model import Session

import flask

app: flask.Flask = flask.current_app

blueprint = flask.Blueprint('set', __name__, url_prefix='/session')


@blueprint.route("/<string:session>")
def list_(session: str):
    session = Session(session)
    sets = tuple(str(set_) for set_ in session.iter_sets())

    return flask.jsonify(sets)
