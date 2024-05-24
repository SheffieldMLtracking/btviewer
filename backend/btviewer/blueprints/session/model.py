import collections.abc
import dataclasses
from pathlib import Path
from typing import Generator, Tuple, TypeVar

import flask

app = flask.current_app

Session = TypeVar('Session')


class Session:
    """
    A photo data gathering session.
    """

    def __init__(self, set_id: str):
        self.id = set_id

    def __str__(self):
        return self.id

    def __repr__(self):
        return f"Session('{self.id}')"

    @classmethod
    def root_directory(cls) -> Path:
        return Path(app.config['ROOT_DIRECTORY']).absolute()

    @property
    def path(self) -> Path:
        """
        The path of this session's directory.
        e.g. ~/my_data/my_session_1
        """
        return self.root_directory().joinpath(self.id)

    def iter_sets(self) -> Generator[Path, None, None]:
        """
        Get all the photo sets in this session by iterating over
        all the files in this directory.
        """
        for path in self.path.iterdir():
            if path.is_dir():
                yield path

    @classmethod
    def iter_session_paths(cls) -> Generator[Path, None, None]:
        """
        Iterate over all the paths of the available session directories.

        Usage:
        for path in Session.iter_session_paths():
            print(path)
        """
        for path in cls.root_directory().iterdir():
            if path.is_dir():
                yield path

    @classmethod
    def iter_sessions(cls) -> Generator[Session, None, None]:
        """
        Iterate over all the available sessions

        Usage:
        for session in Session.iter_sessions():
            print(session)
        """
        for path in cls.iter_session_paths():
            yield cls(path.name)
