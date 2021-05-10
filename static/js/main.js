// hace la petición get a una url
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false para request sincronica
    xmlHttp.send( null );
    var content = JSON.parse(xmlHttp.responseText);
    console.log(content);
    return content;
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
function actualizar(url, idSelectHTML, nombreID_BDD){
    dato = httpGet(url)[0];

    for(i = 0; i < dato.length; i++){
        actualizarOpcionesNombre(dato, i, idSelectHTML, dato[i][nombreID_BDD]);
    }
}

// actualiza en base a una opción del select
function actualizarTodo(url, nombre){
    var selectBox = document.getElementById(nombre);
    var datoNumero = selectBox.options[selectBox.selectedIndex].id;

    actualizar(url+ datoNumero, "#"+nombre, "id_"+nombre);
}

// Borra todas las opciones del select y crea la opcion vacia "seleccione una opción"
function reiniciarSelect(idSelect){
    $('#'+idSelect).children().remove().end();    
    agregarOpcionSeleccionarVacio("Seleccione una opción","-1", '#'+idSelect);
}

// cuando cambian la sede tengo que actualizar todos los edificios para esa sede
function cambioSede(){
    reiniciarSelect("edificio");
    actualizarTodo("http://areco.gob.ar:9528/api/edificios/", "sede");
}


function cambioEdificio(){

}

function cambioFecha(){
    // al cambiar la fecha trae las actividades de esa fecha 
}

// al cambiar la dependencia se actualizan todas las propuestas
function cambioDependencia(){
    reiniciarSelect("propuesta");
    actualizarTodo("http://areco.gob.ar:9528/api/propuestas/", "dependencia");
}

// al seleccionar una propuesta se actualizan las actividades
function cambioPropuesta(){
    reiniciarSelect("actividad");
    actualizarTodo("http://areco.gob.ar:9528/api/actividades/", "propuesta");
}

function cambioActividad(){

}

function cambioHorario(){

}


actualizar("http://areco.gob.ar:9528/api/sede/all", "#sede", "id_sede");