from http import HTTPStatus

import numpy as np

from btviewer.blueprints.photo.model import Photo


def test_photo_array(app):
    with app.app_context():
        photo = Photo('1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.np')

        assert isinstance(photo.array, np.ndarray)
        assert photo.array.shape == (1536, 2048)
        assert photo.array.min() >= 0
        assert photo.array.max() <= 255


def test_photo_jpeg(client):
    width = 1024
    height = 768
    response = client.get('/photos/1970-01-01/set_A/device_1234/camera_1/20200101_094359.123456_000002.jpeg')
    assert response.status_code == HTTPStatus.OK

    # Check response contents
    assert response.content_type == 'image/jpeg'

    # TODO check dimensions
    # import PIL.Image
    # PIL.Image.frombytes(mode='L', size=(width, height), dataresponse.data)
