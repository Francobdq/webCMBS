import os
import logging
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template
from werkzeug.utils import secure_filename

from werkzeug.middleware.shared_data import SharedDataMiddleware
#
UPLOAD_FOLDER = ''

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


logging.basicConfig(level=logging.DEBUG)
logging.debug("Log habilitad!")


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        return redirect(url_for('uploaded_file', filename=nombreOUT))

    return render_template("index.html")



app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})
