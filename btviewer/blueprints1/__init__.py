
from flask import Blueprint

bp = Blueprint('blueprints', __name__)

from btviewer.blueprints1 import handlers