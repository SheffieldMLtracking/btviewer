from pathlib import Path

import flask

from .models import Session

app: flask.Flask = flask.current_app

blueprint = flask.Blueprint('session', __name__, url_prefix='/sessions')


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
    sessions = tuple((str(session) for session in Session.iter_sessions()))

    # Return JSON response to browser
    return flask.jsonify(sessions)


@blueprint.route("/<path:url>")
def list_path(url: str):
    """
    List directory contents of any data subdirectory

    <root_directory>/<session>/<set>/<device id>/<camera id>/<timestamp>_<photo id>.np
    """

    url = Path(url)
    parent_path = Session.root_directory().joinpath(url)

    # Are we in a camera directory?
    if len(url.parents) >= 4:
        # Get photo files
        file_paths = Session.iter_files(parent_path)
        file_names = tuple(str(path.name) for path in file_paths)
        return flask.jsonify(file_names)

    else:
        # Get subdirectory names
        subdir_paths = Session.iter_subdirectories(parent_path)
        subdir_names = tuple(str(path.name) for path in subdir_paths)
        return flask.jsonify(subdir_names)
