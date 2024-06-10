from flask import Flask
app = Flask(__name__)

from btviewer import route

#SC: If you have the debugger disabled or trust the users on your network, you can make the server publicly available simply by adding --host=0.0.0.0 to the command line:This tells your operating system to listen on all public IPs.
#if __name__ == "__main__":
#    app.run(host="0.0.0.0", debug=True)
