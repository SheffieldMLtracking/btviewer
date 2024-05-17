import collections.abc
from pathlib import Path
from typing import Generator

import flask

app = flask.current_app
ROOT_DIRECTORY = Path(app.config['ROOT_DIRECTORY'])


class Session:
    """
    A photo data gathering session.
    """

    @classmethod
    def iter_sessions(cls) -> Generator[Path, None, None]:
        """
        Iterate over all the available sessions
        """
        for path in ROOT_DIRECTORY.iterdir():
            if path.is_dir():
                yield path

    @classmethod
    def list(cls) -> collections.abc.Collection:
        return tuple(cls.iter_sessions())
