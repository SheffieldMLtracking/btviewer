import datetime
from pathlib import Path
from typing import Iterable


class Photo:
    """
    An image taken by a camera.
    """

    def __init__(self, session: str, set_name: str, device_id: str, camera_id: str, timestamp: datetime.datetime,
                 photo_id: int):
        self.session = session
        self.set_name = set_name
        self.device_id = device_id
        self.camera_id = camera_id
        self.timestamp = timestamp
        self.photo_id = photo_id

    @property
    def timestamp_string(self) -> str:
        raise NotImplementedError


    @property
    def filename(self) -> str:
        return f"{self.timestamp_string}_{self.photo_id}.np"

    @property
    def relative_path(self) -> Path:
        return Path(f"{self.session}/{self.set_name}/{self.device_id}/{self.camera_id}/{self.filename}")

    @property
    def path(self) -> Path:
        return

    def load(self):
        """
        Get the image data from the storage disk.
        :return:
        """
        raise NotImplementedError

    def add_label(self, **kwargs):
        """
        Add a label to the image.
        :param kwargs: Label parameters
        :return:
        """
        raise NotImplementedError

    @property
    def label_directory(self) -> Path:
        """
        The path of the directory containing all the label files associated with this image.
        :return:
        """
        # If the photo path is
        # ~/photos/2020-01-01T09+40+43_00123.tiff
        # the label directory is
        # ~/photos/2020-01-01T09+40+43_00123/
        folder_name = self.path.name
        return self.path.parent.joinpath(folder_name)

    def iter_labels(self) -> Iterable[Path]:
        """
        Iterate over all the label files for this image.
        """
        yield from self.label_directory.glob("*.json")
