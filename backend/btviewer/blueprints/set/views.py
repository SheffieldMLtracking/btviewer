from ..session.models import Session
from .models import Set

import flask

app: flask.Flask = flask.current_app

blueprint = flask.Blueprint('set', __name__)


@blueprint.route("/<string:session>")
def list_(session: str):
    """
    Show all the sets in this session.
    """
    session = Session(session)
    sets = tuple(str(Set(path)) for path in session.iter_set_paths())

    return flask.jsonify(sets)
