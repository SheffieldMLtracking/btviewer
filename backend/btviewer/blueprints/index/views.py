from pathlib import Path

import flask

blueprint = flask.Blueprint('index', __name__)

app = flask.current_app


@blueprint.route('/')
def index():
    """
    Serve the GUI frontend web interface.
    """

    frontend_dir = Path(app.instance_path).parent.joinpath('frontend')
    return flask.send_from_directory(frontend_dir, 'index.html')
