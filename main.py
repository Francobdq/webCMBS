import os
import logging
import requests
import json
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template
from werkzeug.utils import secure_filename

from werkzeug.middleware.shared_data import SharedDataMiddleware
#
UPLOAD_FOLDER = ''

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


logging.basicConfig(level=logging.DEBUG)
logging.debug("Log habilitad!")





def guardarActividades():
    logging.debug("guardando json")
    response = requests.get(url=' http://areco.gob.ar:9528/api/actividad/all')
    response_dict = response.json()

    
    print(response_dict['data'][0])
    with open('data.json', 'w') as file:
        json.dump(response_dict, file, indent=4)




@app.route('/', methods=['GET', 'POST'])
def upload_file():
    #guardarActividades()
    if request.method == 'POST':
        # datos usuario
        nombre = request.form['nombre-apellido-input']
        dni = request.form['dni-input']
        email = request.form['email-input']
        direccion = request.form['direccion-input']
        tel = request.form['tel-input']
        # declaracion jurada
        olfato = request.form['olfato']
        gusto = request.form['gusto']
        tos = request.form['tos']
        garganta = request.form['garganta']
        aire = request.form['aire']



        return "<ul><li>nombre: "+ nombre +"<li/><li>dni: "+ dni +"<li/><li>email: "+ email +"<li/><li>direccion: "+ direccion +"<li/><li>telefono: "+ tel +"<li/></ul> <br/><ul><li>olfato: "+ olfato +"<li/><li>gusto: "+ gusto +"<li/><li>tos: "+ tos +"<li/><li>garganta: "+ garganta +"<li/><li>aire: "+ aire +"<li/></ul>"



    return render_template("index.html")



app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})
