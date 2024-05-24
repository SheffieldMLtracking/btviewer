#!/usr/bin/env python

import argparse
import logging

import btviewer

DESCRIPTION = """
"""
USAGE = """
"""

logger = logging.getLogger(__name__)


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=DESCRIPTION, usage=USAGE)
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.add_argument('--version', action='store_true')
    return parser.parse_args()


def main():
    args = get_args()
    if args.version:
        print("btviewer version", btviewer.__version__)
        exit()
    logging.basicConfig(
        format="%(name)s:%(asctime)s:%(levelname)s:%(message)s",
        level=logging.INFO if args.verbose else logging.WARNING
    )

    raise NotImplementedError


if __name__ == '__main__':
    main()
