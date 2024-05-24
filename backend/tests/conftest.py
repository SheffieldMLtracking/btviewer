"""
Flask testing configuration
https://flask.palletsprojects.com/en/3.0.x/testing/
"""

from pathlib import Path

import pytest

import btviewer.app_factory

ROOT_DIRECTORY = Path(__file__).parent.joinpath('data').absolute()
"Test sample data directory"


@pytest.fixture()
def app():
    app = btviewer.app_factory.create_app(root_directory=ROOT_DIRECTORY)
    app.config.update({
        "TESTING": True,
    })

    # other setup can go here

    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()
