"""
Flask app to run in development mode

Usage:
flask --app backend.btviewer.app run --debug
"""

from pathlib import Path

from .app_factory import create_app

# Use test data
ROOT_DIRECTORY = Path(__file__).parent.parent.joinpath('tests/data')

app = create_app(root_directory=ROOT_DIRECTORY)
