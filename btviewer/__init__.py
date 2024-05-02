from importlib.metadata import version

__version__ = version("btviewer")

from flask import Flask
app = Flask(__name__) # The Flask application instance is created as a global variable

from btviewer import views
# declare the import after initiate the app instance, to avoid circular import,https://flask.palletsprojects.com/en/2.3.x/patterns/packages/