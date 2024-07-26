# Contribution guide

For the overall guidelines, see [SheffieldMLtracking contribution guide](https://github.com/SheffieldMLtracking/.github/blob/main/CONTRIBUTING.md).

# Development

These are notes for developers working on this code.

This directory contains the code files that define the Flask backend API app. The contents are as follows:

- `blueprints/` contains the app code. See: [Modular Applications with Blueprints](https://flask.palletsprojects.com/en/2.3.x/blueprints/)
- `tests/`  contains unit tests. See [Testing Flask Applications](https://flask.palletsprojects.com/en/3.0.x/testing/)
- `pyproject.toml` specifies the [Python package](https://packaging.python.org/)
- `MANIFEST.in` tells the build system what [other files to include](https://setuptools.pypa.io/en/latest/userguide/miscellaneous.html#controlling-files-in-the-distribution) (such as the static files)

## Installation

To create a virtual environment

```bash
python -m venv .venv
```

Activate the environment

```bash
# Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

To install the package in [editable mode](https://pip.pypa.io/en/stable/topics/local-project-installs/#editable-installs):

```bash
pip install --editable ./backend
```

## Usage

To run the app in development mode:

```bash
flask --app backend.btviewer.app --debug run --port 5000
```

We must always use port 5000 because the front-end is configured to use that port.

To run the frontend user interface in development mode, see the [frontend contribution guide](../frontend/CONTRIBUTING.md).

## Deployment

The Python package is built and published by a GitHub Actions workflow.

To test the installation of the package in a separate environment, you can install it directly from GitHub using the [VCS support](https://pip.pypa.io/en/stable/topics/vcs-support/) feature of `pip install`. For example:

```bash
branch="my_name"
pip install git+https://github.com/SheffieldMLtracking/btviewer@$branch#subdirectory=backend
```



## Further reading

- Flask [Project Layout](https://flask.palletsprojects.com/en/2.3.x/tutorial/layout/) and [tutorial example](https://github.com/pallets/flask/tree/3.0.2/examples/tutorial)