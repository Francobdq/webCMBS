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


@app.route('/error', methods=['GET', 'POST'])
def error():
    if request.method == 'POST':
        return redirect("/")
    return render_template("Error.html")


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
        # datos de ingreso
        sede = request.form.get('sede')
        fecha = request.form['fecha-input']
        edificio = request.form.get('edificio')
        actividad = request.form.get('actividad')

        if(sede == None or edificio == None or actividad == None):
            return redirect("/error")


        # declaracion jurada 1era parte
        olfato = request.form['olfato']
        gusto = request.form['gusto']
        tos = request.form['tos']
        garganta = request.form['garganta']
        aire = request.form['aire']

        # declaracion jurada 2da parte
        embarazada = request.form.get('emabarazadaCheck')
        cancer = request.form.get('cancerCheck')
        diabetes = request.form.get('diabetesCheck')
        hepatica = request.form.get('hepaticaCheck')
        renal = request.form.get('renalCheck')
        respiratoria = request.form.get('respiratoriaCheck')
        cardiologica = request.form.get('cardiologicaCheck')

        array = [nombre, dni, email,direccion,tel,sede,fecha,edificio,actividad,olfato,gusto,tos,garganta,aire,embarazada,cancer,diabetes,hepatica,renal,respiratoria,cardiologica]

        salida = "<ul>"
        for i in array:
            salida+= "<li>" + str(i) + "</li>"
        
        salida += "</ul>"


        return salida



    return render_template("index.html")



app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})
