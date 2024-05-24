from pathlib import Path


class Set:
    def __init__(self, session_id: str, set_id: str):
        self.session = Session(session_id)
        self.id = str(set_id)

    @property
    def path(self) -> Path:
        return self.session.path.joinpath(self.id)
