# Backend API

This is an API for image processing made using the [Flask web framework](https://flask.palletsprojects.com/en/3.0.x/) in the Python programming language. It's used to interface with the session image data via a REST API.

# Installation

```bash
pip install btviewer
```

# Usage

To run the backend, please run this command, specifying the root folder that contains your image capture sessions:

```bash
btviewer ~/my_data/
```

To see the other options, run:

```
btviewer --help
```

# Development

This directory contains the code files that define the Flask backend API app. The contents are as follows:

- `blueprints/` contains the app code. See: [Modular Applications with Blueprints](https://flask.palletsprojects.com/en/2.3.x/blueprints/)
- `tests/`  contains unit tests. See [Testing Flask Applications](https://flask.palletsprojects.com/en/3.0.x/testing/)

To run the app in development mode:

```bash
flask --app backend.btviewer.app run
```

Further reading:

- Flask [Project Layout](https://flask.palletsprojects.com/en/2.3.x/tutorial/layout/) and [tutorial example](https://github.com/pallets/flask/tree/3.0.2/examples/tutorial)
