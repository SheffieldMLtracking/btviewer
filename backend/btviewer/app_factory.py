"""
Flask application factory
"""

from pathlib import Path

import flask


def create_app(root_directory: Path, **kwargs) -> flask.Flask:
    """
    Build the Flask app instance

    This function is a Flask application factory
    https://flask.palletsprojects.com/en/3.0.x/patterns/appfactories/

    :param kwargs: keyword arguments for the Flask app
    """
    app = flask.Flask(__name__, **kwargs)
    app.config.update(dict(
        ROOT_DIRECTORY=root_directory,
    ))
    register_blueprints(app)

    return app


def register_blueprints(app: flask.Flask):
    """
    Add the blueprints to the flask app
    https://flask.palletsprojects.com/en/3.0.x/blueprints/
    """

    import btviewer.blueprints.session.views
    # import btviewer.blueprints.set.views
    # import btviewer.blueprints.label.views
    # import btviewer.blueprints.photo.views

    app.register_blueprint(btviewer.blueprints.session.views.blueprint)
    # app.register_blueprint(btviewer.blueprints.set.views.blueprint)
    # app.register_blueprint(btviewer.blueprints.label.views.blueprint)
    # app.register_blueprint(btviewer.blueprints.photo.views.blueprint)
