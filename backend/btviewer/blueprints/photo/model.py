import datetime
import io
import json
import tempfile
from pathlib import Path
from typing import Iterable, Mapping, Union, Generator

import PIL.Image
import flask
import numpy

app: flask.Flask = flask.current_app


class Photo:
    """
    An image taken by a camera.
    """

    def __init__(self, path: Union[Path, str]):
        self.path = Path(app.config['ROOT_DIRECTORY']).joinpath(path).absolute()

    @classmethod
    def validate_filename(cls, filename: str):
        """
        Validate a filename <timestamp>_<photo_id>.np
        https://github.com/SheffieldMLtracking#file-structures
        where timestamp is YYYMMDD_HHMMSS.UUUUUU
        where photo_id is a zero-padded integer
        """
        filename = Path(filename)
        if filename.suffix != ".np":
            raise ValueError(filename)
        timestamp, _, photo_id = filename.stem.rpartition("_")
        photo_id = int(photo_id)
        cls.parse_timestamp(timestamp)

    @classmethod
    def parse_timestamp(cls, timestamp: str) -> datetime.datetime:
        """
        Parse the `timestamp` part of a photo filename.
        https://github.com/SheffieldMLtracking#file-structures
        "YYYMMDD_HHMMSS.UUUUUU" -> datetime.datetime()
        """
        # https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior
        dt = datetime.datetime.strptime(timestamp, "%Y%m%d_%H%M%S.%f")
        # Use UTC timestamp
        dt.replace(tzinfo=datetime.timezone.utc)
        return dt

    @property
    def timestamp_string(self) -> str:
        raise NotImplementedError

    @property
    def filename(self) -> str:
        return f"{self.timestamp_string}_{self.photo_id}.np"

    @property
    def relative_path(self) -> Path:
        return Path(f"{self.session}/{self.set_name}/{self.device_id}/{self.camera_id}/{self.filename}")

    def load(self) -> dict:
        """
        Get the image data from the storage disk.
        :returns:
        {
          "record": {...},
          "image": array(...)
        }
        """
        # https://numpy.org/doc/stable/reference/generated/numpy.load.html
        data = numpy.load(self.path, allow_pickle=True)
        app.logger.info("Loaded '%s'", self.path)
        return data

    def add_label(self, **kwargs):
        """
        Add a label to the image.
        :param kwargs: Label parameters
        :return:
        """
        raise NotImplementedError

    def add_labels(self, labels: list[dict], source: str, version: str, indent: int = 2):
        label_path = self.make_label_path(source=source)

        # Build a list of labels
        document: list[dict] = list()

        # Open existing labels file
        try:
            with label_path.open('r') as file:
                document.extend(json.load(file))
        except FileNotFoundError:
            pass

        # Include the newly-added labels
        document.extend(labels)

        # Append the metadata to each label
        metadata = {
            "source": source,
            "version": version,
            "mode": "manual"
        }
        document = [dict(**metadata, **label) for label in document]

        # Save labels to disk
        with label_path.open('w') as file:
            json.dump(document, file)

        app.logger.info("Labels saved to '%s'", label_path)
        return label_path

    def make_label_path(self, source: str) -> Path:
        """
        The path of the file containing all the label files for this photo for this source.
        """
        # If the photo path is
        # ~/photos/2020-01-01T09+40+43_00123.np
        # the label directory for btviewer is
        # ~/photos/btviewer/2020-01-01T09+40+43_00123.json
        filename = path.with_suffix('.json').name
        label_path = self.path.parent.joinpath(source).joinpath(filename)
        label_path.parent.mkdir(exist_ok=True)
        return label_path

    @property
    def metadata(self) -> dict:
        """
        Get all the image information, except the 2D image data array.
        """
        return {key: value for key, value in self.data.items() if key != 'img'}

    def to_tiff(self):
        """
        Convert image data to TIFF format
        """
        return self.to_bytes(format='TIFF')

    def to_jpeg(self):
        return self.to_bytes(format='JPEG')

    @property
    def data(self) -> Mapping:
        """
        Image data and metadata
        """
        return self.load()

    @property
    def array(self):
        return self.get_array()

    def get_array(self, scale_factor: float = None, dtype=numpy.dtype('uint8'),
                  mean_exposure: float = 0.18) -> numpy.array:
        """
        2D image data array of pixel values.

        By default, this produces a normalised 2D grid of unsigned 8-bit integers (0 to 255).

        :param scale_factor: Multiplication factor for the pixel brightness values
        :param dtype: Data type https://numpy.org/doc/stable/reference/generated/numpy.ndarray.astype.html
        :param mean_exposure: The target average brightness (default 1to 18% grey)
        """
        # Set data type for array values
        dtype = numpy.dtype(dtype)
        maximum_value = numpy.iinfo(dtype).max

        # Load image data
        array: numpy.ndarray = self.data['img']

        if scale_factor is None:
            # Adjust brightness to target average exposure
            scale_factor = maximum_value * mean_exposure / array.mean()

        numpy.multiply(array, scale_factor, out=array, casting='unsafe')

        return array.astype(dtype=dtype)

    @property
    def image(self) -> PIL.Image:
        """
        A PIL image object for the photo data.
        """
        return PIL.Image.fromarray(self.array)

    def to_bytes(self, **kwargs) -> io.BytesIO:
        """
        Convert the 2D image data to an image file format.

        :param kwargs: Keyword arguments for PIL Image.save()
        :returns: Image data buffer
        """
        # Use BytesIO to store the image in memory
        buffer = io.BytesIO()
        self.image.save(buffer, **kwargs)
        buffer.seek(0)

        return buffer

    def to_png(self):
        """
        Convert image data to PNG format
        """
        return self.to_bytes(format='PNG')

    def iter_labels(self) -> Generator[Mapping, None, None]:
        """
        Iterate over label documents for this image.
        """
        # Iterate over JSON files in the label directory
        for path in self.label_directory.glob('*.json'):
            # Load JSON data
            with path.open() as file:
                doc = json.load(file)
                app.logger.info("Loaded '%s'", file.name)
            # Get list of tags
            yield from doc['tags']

    @property
    def labels(self) -> Iterable[Mapping]:
        """
        The tags applied to this image.
        """
        return list(dict(label) for label in self.iter_labels())
