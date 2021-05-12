
const HOST = "http://areco.gob.ar:9528";
const URLS = {
    "todasLasSedes": "/api/sede/all",
    "todasLasDependencias": "/api/dependencia/all",
    "edificiosDeSede": "/api/edificio/sede/find/",
    "propuestaDeDependencia": "/api/propuesta/find/dependencia/",
    "actividadesDePropuesta": "/api/actividad/find/propuesta/",
    "actividadesPorFecha": "/api/actividad/find-por-fecha/?fecha=",
    "actividadesPorEdificio": "/api/actividad/find/propuesta/",
    "horariosDeActividad": "/api/horario/find-actividad-fecha/",
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

document.getElementById('fecha-input').value = new Date().toDateInputValue();

request_ActividadesEnFecha = null;
fechaValue = null;
update_fecha();
console.log("actividad en fecha AAAAAAAAAAAA: " + request_ActividadesEnFecha[0]["idActividad"]);
// hace la petición get a una url
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", HOST+theUrl, false ); // false para request sincronica
    xmlHttp.send( null );
    var content = JSON.parse(xmlHttp.responseText);
    console.log(content);
    return content;
}

function update_fecha(){
    var fecha = document.getElementById("fecha-input");
    fechaValue = fecha.value;

    request_ActividadesEnFecha = httpGet(URLS.actividadesPorFecha+fechaValue)["data"];
}

// agrega la opción vacia "seleccione un opcion" (permite modificar ese nombre)
function agregarOpcionSeleccionarVacio(nombre, value, selectID){
    var nuevaOpcion = new Option(nombre, value);

    nuevaOpcion.setAttribute("disabled", true);
    nuevaOpcion.setAttribute("selected", true);

    $(nuevaOpcion).html(nombre);

    $(selectID).append(nuevaOpcion);
    
}

// crea una nueva opción dentro de un select particular
function actualizarOpcionesNombre(opcion, i, id,idBDD, nombre =""){
    console.log("Entro a actualizar opcion nombre: " + opcion[i]["nombre"] + " - " + id + " - " + idBDD + " - " + nombre)

    var nombreNuevaOpcion = nombre;
    if(nombreNuevaOpcion == "")
        nombreNuevaOpcion = opcion[i]["nombre"];

    var nuevaOpcion = new Option(nombreNuevaOpcion, idBDD.toString());

    // para armar el "path"
    nuevaOpcion.setAttribute("id",i);

    $(nuevaOpcion).html(nombreNuevaOpcion);

    $(id).append(nuevaOpcion);

}

// actualiza un select llenando todos los datos
function actualizar(url, idSelectHTML, nombreID_BDD, controlarFecha = false){
    console.log("Entro a actualizar: " + url + " - " + idSelectHTML + " - " + nombreID_BDD + " - " + controlarFecha)
    request_datos = httpGet(url);

    dato = request_datos["data"];

    update_fecha();
    console.log("actividades en fecha: " + request_ActividadesEnFecha);

    for(i = 0; i < dato.length; i++){
        if(controlarFecha){
            for(j = 0; j < request_ActividadesEnFecha.length; j++){
                if(request_ActividadesEnFecha[j] == dato[i][nombreID_BDD])
                    actualizarOpcionesNombre(dato, i, idSelectHTML, dato[i][nombreID_BDD]);
            }
            
        }
        else
            actualizarOpcionesNombre(dato, i, idSelectHTML, dato[i][nombreID_BDD]);

        
    }
}

// utiliza el id del select para devolver el id de la base de datos del elemento seleccionado (-1 en su defecto)
function idBDDFromSelected(id){
    var selectBox = document.getElementById(id);
    return selectBox.options[selectBox.selectedIndex].value;
}

// actualiza en base a una opción del select
function actualizarTodo(url, nombre, nombreSelect, controlarFecha = false){
    var datoNumero = idBDDFromSelected(nombreSelect);

    nombrePrimeraLetraUpper = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    console.log("NombreUpper: " + nombrePrimeraLetraUpper);
    

    actualizar(url+ datoNumero, "#"+nombre, "id"+nombrePrimeraLetraUpper, controlarFecha);
}


// Borra todas las opciones del select y crea la opcion vacia "seleccione una opción"
function reiniciarSelect(idSelect){
    $('#'+idSelect).children().remove().end();    
    agregarOpcionSeleccionarVacio("Seleccione una opción","-1", '#'+idSelect);
}



// cuando cambian la sede tengo que actualizar todos los edificios para esa sede
function cambioSede(){
    reiniciarSelect("edificio");
    actualizarTodo(URLS.edificiosDeSede, "edificio", "sede");
}

// actividad por edificio y propuesta en una determinada fecha.
function actividadesPorEdificiosYPropuestas(edificioNumero, propuestaNumero){
    reiniciarSelect("actividad");

    console.log("---------------- EMPIEZA ------------------");
    console.log("ACTIVIDADES EN EDIFICIO:");
    request_ActividadesEnedificios   = httpGet(URLS.actividadesPorEdificio+edificioNumero)["data"];
    console.log("ACTIVIDADES EN PROPUESTA:");
    request_ActividadesEnpropuesta  = httpGet(URLS.actividadesDePropuesta+propuestaNumero)["data"];
    console.log("ACTIVIDADES EN ESA FECHA:");
    update_fecha();
    console.log("---------------- TERMINA ------------------");
    todo = [];
    console.log("---------------- EMPIEZA FOR ------------------");
    for(k = 0; k < request_ActividadesEnFecha.length; k++){
        for(i = 0; i < request_ActividadesEnedificios.length; i++){
            for(j = 0; j < request_ActividadesEnpropuesta.length; j++){
                console.log("k: " + k + " i: " + i + " j: " + j);
                idActFecha = request_ActividadesEnFecha[k]["idActividad"];
                idActEdifi = request_ActividadesEnedificios[i]["idActividad"];
                idActPropu = request_ActividadesEnpropuesta[j]["idActividad"];
                console.log("actividades en fecha: " + idActFecha  + "actividades en edificio: " + idActEdifi  + "actividades en propuesta: " + idActPropu );
                if(idActFecha == idActEdifi && idActEdifi == idActPropu){
                    console.log("entró")
                    todo.push(request_ActividadesEnFecha[k]);
                }
            }
        }
    }

    console.log("---------------- TERMINA FOR ------------------");
    console.log("---------------- OTRO FOR ------------------");
    for(i = 0; i < todo.length; i++){
        console.log("todo: " + todo[i]["nombre"]);
        actualizarOpcionesNombre(todo, i, "#actividad", todo[i]["idActividad"]);
    }
    console.log("---------------- TERMINA OTRO FOR ------------------");
    
}

// controla si se seleccionó algo en propuesta y en edificio
function controlEdificioYPropuesta(){
    var edificioNumero = idBDDFromSelected("edificio");
    var propuestaNumero = idBDDFromSelected("propuesta");

    if(edificioNumero != -1 && propuestaNumero != -1){
        actividadesPorEdificiosYPropuestas(edificioNumero, propuestaNumero);
        return true;
    }
        
    return false;
}

function cambioEdificio(){
    if(controlEdificioYPropuesta())
        return;

    reiniciarSelect("actividad");
    actualizarTodo(URLS.actividadesPorEdificio, "actividad","edificio", true);
}


// al cambiar la fecha trae las actividades de esa fecha 
function cambioFecha(){
    update_fecha();

    if(controlEdificioYPropuesta())
        return;


    var edificioNumero = idBDDFromSelected("edificio");
    var propuestaNumero = idBDDFromSelected("propuesta");

    if(edificioNumero!= -1 && propuestaNumero != -1)
        actividadesPorEdificiosYPropuestas(edificioNumero, propuestaNumero);
    else if(edificioNumero.value != -1)
        cambioEdificio();
    else if(propuestaNumero.value != -1)
        cambioPropuesta();


}   

// al cambiar la dependencia se actualizan todas las propuestas
function cambioDependencia(){
    reiniciarSelect("horario");
    reiniciarSelect("actividad");
    reiniciarSelect("propuesta");
    actualizarTodo(URLS.propuestaDeDependencia, "propuesta", "dependencia");
}

// al seleccionar una propuesta se actualizan las actividades
function cambioPropuesta(){
    if(controlEdificioYPropuesta())
        return;

    reiniciarSelect("actividad");
    actualizarTodo(URLS.actividadesDePropuesta,"actividad", "propuesta", true);
}


function actualizar2(url, idSelectHTML, nombreID_BDD){
    console.log("Entro a actualizar2: " + url + " - " + idSelectHTML + " - " + nombreID_BDD)
    request_datos = httpGet(url);

    dato = request_datos["data"];

    for(i = 0; i < dato.length; i++)
        actualizarOpcionesNombre(dato, i, idSelectHTML, dato[i][nombreID_BDD], dato[i]["horaInicio"]);
}
// si selecciono una actividad actualizo los horarios de esa actividad
function cambioActividad(){
    // las actividades de un determinado edificio
    // las actividades de una dependencia
    // las actividades de esa fecha
    idActividad = idBDDFromSelected("actividad");
    
    reiniciarSelect("horario");
    console.log("fecha value = " + fechaValue);
    actualizar2(URLS.horariosDeActividad + idActividad +"/?fecha=" + fechaValue, "#horario", "idHorario")
}

function cambioHorario(){
    // no debería hacer nada
}


function ddjj(){
    datos = httpGet("/api/pregunta/all")["data"];

    fullHtml = '';

    for(i = 0; i < datos.length; i++){
        fullHtml += ' \
            <fieldset class="row" required> \
                <p class="col-md-6">'+datos[i]["descripcion"]+'</p> \
                <label class="col-md-1" for="pregunta'+datos[i]["idPregunta"]+'"> <input value="1" type="radio" name="'+datos[i]["idPregunta"]+'" id="pregunta'+datos[i]["idPregunta"]+'" /> Si </label> \
                <label class="col-md-1" for="pregunta'+datos[i]["idPregunta"]+'"> <input value="0" type="radio" name="'+datos[i]["idPregunta"]+'" id="pregunta'+datos[i]["idPregunta"]+'" /> No </label> \
            </fieldset> \
            ';
    }

    fullHtml += '<br/><br/><h5 id="declaracion-jurada-label">Si tu situación de salud contempla alguna de las siguientes opciones, marque las que correspondan:</h5>';

    datos = httpGet("/api/factorderiesgo/all")["data"];
    for(i = 0; i < datos.length; i++){
        fullHtml += ' \
                <br/> \
                <div class="form-check" required> \
                    <input name="pregunta'+datos[i]["idFactorDeRiesgo"]+'" class="form-check-input" type="checkbox" value="'+datos[i]["nombre"]+'" id="pregunta'+datos[i]["idFactorDeRiesgo"]+'"> \
                    <label class="form-check-label" for="pregunta'+datos[i]["idFactorDeRiesgo"]+'">'+datos[i]["nombre"]+'</label> \
                </div> \
            ';
    }

    console.log("datos traidos");
    document.getElementById("Ddjj").innerHTML = fullHtml;
}

reiniciarSelect("sede")
reiniciarSelect("dependencia")
actualizar(URLS.todasLasSedes, "#sede", "idSede");
actualizar(URLS.todasLasDependencias, "#dependencia", "idDependencia");
ddjj();


