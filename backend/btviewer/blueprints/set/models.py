from ..session.models import Session
from btviewer.mixins import StructureMixin

from pathlib import Path
from typing import Union


class Set(StructureMixin):
    def __init__(self, set_id: Union[Path, str], session_id: str = None):
        if isinstance(set_id, Path):
            session_id = set_id.parent.name
            set_id = set_id.name

        self.id = str(set_id)
        self.session = Session(session_id)

    @property
    def path(self) -> Path:
        return self.session.path.joinpath(self.id)
