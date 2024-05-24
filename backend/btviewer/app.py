from pathlib import Path

from .app_factory import create_app

app = create_app(root_directory=Path(__file__).parent.joinpath('tests/data'))
