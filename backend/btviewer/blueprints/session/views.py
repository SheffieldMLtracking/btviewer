import flask
from .model import Session

app = flask.current_app

blueprint = flask.Blueprint('session', __name__)


@blueprint.route("/")
def list_():
    """
    This an API endpoint to list all sessions.
    It lists all available session folders in the root directory.

    btviewer ~/my_data/<session>
    where the root directory is ~/my_data/

    :returns: JSON list of session identifiers
    [
        "my_session_1",
        "my_session_2",
        "my_session_3"
    ]
    """
    # Get all the sessions
    sessions = Session.list()
    # Return JSON response to browser
    return flask.jsonify(sessions)
