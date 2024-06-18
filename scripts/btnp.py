#!/usr/bin/env python


import argparse
import logging
from pathlib import Path

import PIL.Image
import numpy

DESCRIPTION = """
Convert a bee_track numpy data file to JPEG format.
"""
USAGE = """
python -m btnp $input_path
"""

logger = logging.getLogger(__name__)


def get_args() -> argparse.Namespace:
    """
    Command-line arguments
    """
    parser = argparse.ArgumentParser(description=DESCRIPTION, usage=USAGE)
    parser.add_argument('-v', '--verbose', action='store_true')
    parser.add_argument('input_path', type=Path)
    parser.add_argument('-o', '--output_path', type=Path, default=Path(),
                        help='Output file path (default: same as input with image file extension)')
    parser.add_argument('--dtype', default='uint8', help='Numpy array data type')
    parser.add_argument('-m', '--mean_exposure', default=0.18, type=float,
                        help='Target mean exposure percentage (0 to 1)')
    parser.add_argument('-e', '--ext', default='.jpeg', help='Output file extension')

    return parser.parse_args()


def main():
    args = get_args()
    logging.basicConfig(
        format="%(name)s:%(asctime)s:%(levelname)s:%(message)s",
        level=logging.WARNING if args.verbose else logging.INFO
    )

    # Load input data file
    data = numpy.load(args.input_path, allow_pickle=True)
    logger.info("Loaded '%s'", args.input_path)
    array = data['img']

    # Auto-expose image
    dtype = numpy.dtype(args.dtype)
    maximum_value = numpy.iinfo(dtype).max
    scale_factor = maximum_value * args.mean_exposure / array.mean()
    numpy.multiply(array, scale_factor, out=array, casting='unsafe')

    # Convert to output image format
    image = PIL.Image.fromarray(array)

    # Save output
    output_path = args.input_path.with_suffix(args.ext)
    image.save(output_path)
    logger.info("Wrote '%s'", output_path)


if __name__ == '__main__':
    main()
