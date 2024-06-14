from pathlib import Path
import flask

app: flask.Flask = flask.current_app
blueprint = flask.Blueprint('home', __name__, url_prefix='/frontend')


@blueprint.route('/<path:path>')
def home(path: str):
    """
    Service the static front-end files.

    http://localhost:5000/frontend/index.html
    http://localhost:5000/frontend/assets/index-BNozT0Gm.js
    """
    directory = Path(__file__).parent.parent.parent.parent.parent.joinpath('frontend/dist/')
    return flask.send_from_directory(directory, path)
