#!/usr/bin/env python

import argparse
import logging
import os
import webbrowser
from pathlib import Path

import flask
import btviewer.app_factory
import waitress

DESCRIPTION = """
This is a browser-based app for viewing and human labelling of tracking images.
Example usage: btviewer ~/path/to/data/
"""


def get_args() -> argparse.Namespace:
    """
    Configure command-line arguments.
    """

    parser = argparse.ArgumentParser(description=DESCRIPTION)

    # Actions
    # https://docs.python.org/dev/library/argparse.html#action
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.add_argument('--version', action='version', version=f'%(prog)s {btviewer.__version__}')

    # Flask options
    parser.add_argument('--debug', type=bool, default=True)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', default=5000)
    parser.add_argument('--threads', default=os.cpu_count(), type=int)

    # btviewer options
    parser.add_argument('root_directory', type=Path)

    return parser.parse_args()


def main():
    args = get_args()
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO)

    # Create WSGI app
    app = btviewer.app_factory.create_app(root_directory=args.root_directory)

    logging.info("Data root directory: %s", app.config['ROOT_DIRECTORY'])

    # Get URI of backend
    uri = f"http://{args.host}:{args.port}"
    logging.info(f'Running backend with {args.threads} threads')

    # Open frontend in web browser
    static_uri = uri + '/static/index.html'
    webbrowser.open(static_uri)

    print('flask where')
    print(flask.url_for('static', filename='index.html'))

    # Run web server
    # https://docs.pylonsproject.org/projects/waitress/en/latest/arguments.html
    waitress.serve(app, host=args.host, port=args.port, threads=args.threads)


if __name__ == '__main__':
    main()
