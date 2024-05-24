#!/usr/bin/env python

import argparse
import logging
from pathlib import Path

import btviewer.app_factory

DESCRIPTION = """
This is a browser-based app for viewing and human labelling of tracking images.
"""

USAGE = """
btviewer ~/my_data/
"""


def get_args() -> argparse.Namespace:
    """
    Configure command-line arguments.
    """

    parser = argparse.ArgumentParser(description=DESCRIPTION, usage=USAGE)

    # Actions
    # https://docs.python.org/dev/library/argparse.html#action
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.add_argument('--version', action='version', version=f'%(prog)s {btviewer.__version__}')

    # Flask options
    parser.add_argument('--debug', type=bool, default=True)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', default=5000)

    # btviewer options
    parser.add_argument('root_directory', type=Path)

    return parser.parse_args()


def show_version():
    print("btviewer version", btviewer.__version__)
    exit()


def main():
    args = get_args()
    if args.version:
        show_version()

    # Run in development mode
    app = btviewer.app_factory.create_app(root_directory=args.root_directory)
    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == '__main__':
    main()
