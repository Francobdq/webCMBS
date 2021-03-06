import os
import logging
import requests
import json
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template
from werkzeug.utils import secure_filename

from werkzeug.middleware.shared_data import SharedDataMiddleware
from flask_qrcode import QRcode

#
UPLOAD_FOLDER = ''

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


logging.basicConfig(level=logging.DEBUG)
logging.debug("Log habilitad!")

QRcode(app)


@app.route('/error', methods=['GET', 'POST'])
def error():
    if request.method == 'POST':
        return redirect("/")
    return render_template("Error.html")


@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        # datos usuario
        nombre = "franco bernaldo de quiros"#request.form['nombre-apellido-input']
        #dni = request.form['dni-input']
        #email = request.form['email-input']
        #direccion = request.form['direccion-input']
        #tel = request.form['tel-input']
        # datos de ingreso
        sede = "baradero" #request.form.get('sede')
        fecha = "09/05/2021"#request.form['fecha-input']
        edificio = "asd"#request.form.get('edificio')
        actividad = "aa"#request.form.get('actividad')
        hora = "20:20"#request.form['horarioActividad']

        #if(sede == None or edificio == None or actividad == None):
            #return redirect("/error")

        # declaracion jurada 1era parte
        #olfato = request.form['olfato']
        #gusto = request.form['gusto']
        #tos = request.form['tos']
        #garganta = request.form['garganta']
        #aire = request.form['aire']

        # declaracion jurada 2da parte
        #embarazada = request.form.get('emabarazadaCheck')
        #cancer = request.form.get('cancerCheck')
        #diabetes = request.form.get('diabetesCheck')
        #hepatica = request.form.get('hepaticaCheck')
        #renal = request.form.get('renalCheck')
        #respiratoria = request.form.get('respiratoriaCheck')
        #cardiologica = request.form.get('cardiologicaCheck')

        #grupoDeRiesgo = 0
        #if (embarazada or cancer or diabetes or hepatica or renal or respiratoria or cardiologica):
        #    grupoDeRiesgo = 1


        #auth_data = {"dni": str(dni),"enSeguimiento": str(1),"grupoDeRiesgo": str(grupoDeRiesgo),"mail": str(email),"nombre": str(nombre),"telefono": str(tel)}
        
        #resp = requests.post('http://areco.gob.ar:9528/api/ingresante/create/'+str(horario)+'/?fechaingreso='+str(fecha), json=auth_data)

        #logging.debug(resp)

        qr = "10231081249123"

        #response = requests.get(url=' http://areco.gob.ar:9528/api/persona/find/1')
        #persona = response.json()["data"]
        #qr = persona["ddjjs"][-1]["solicituds"][-1]["qr"]
        aula = "aula1"

        return render_template('qr.html', qr=qr, nombre=nombre,fecha=fecha,edificio=edificio, sede=sede,hora=hora, aula=aula)



    return render_template("index.html")



app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})
