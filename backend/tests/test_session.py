from http import HTTPStatus

import pytest


def test_session_list(client):
    response = client.get('/session/')
    assert response.status_code == HTTPStatus.OK

    # Check response contents
    sessions: list[str] = response.json
    assert isinstance(sessions, list)
    for session_id in sessions:
        assert isinstance(session_id, str)
