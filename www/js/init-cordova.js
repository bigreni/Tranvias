
function listo(position){
  //Materialize.toast('Pos: '+position.coords.latitude+' '+position.coords.longitude,5000)
  var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  try{
    var configuracion = JSON.parse(localStorage.getItem('configuracion'));
    cercanas = configuracion.numParadas;
    metros   = configuracion.metrosDist;
  }catch(e){
    Materialize.toast(traducir('lng-toast-error-cargando-configuracion','Error cargando la configuracion'),5000)
    cercanas = 5;
    metros   = 5000;
  }


  mapa_cercanas.getCercanas(position, cercanas, metros,'#cercanas-container');
  mapa_cercanas.creaMarcaUsuario(coords,'Posicion: '+position.coords.latitude+' '+position.coords.longitude,'img/icons/usuario.png');
}
function error(e){
  $('#cercanas-container .mensaje').html(traducir('lng-txt-geolocalizacion-off','Geolocalización desactivada. Actívela y reinténtelo'))
  console.log('************* ERROR '+e+' **************')
}

function getGeolocation(){
  if (navigator.geolocation) {
    Materialize.toast(traducir("lng-toast-localizando","Localizando..."),5000)
    navigator.geolocation.getCurrentPosition(listo,error);
    //$('#cercanas-container .mensaje').html('Buscando paradas cercanas <br /> <i class="ion-android-locate" />')

  } else {
    Materialize.toast(traducir("lng-toast-error-localiza","Error en la obtención de coordenadas"),5000)
    $('#cercanas-container .mensaje').html('Su dispositivo no dispone de esta geolocalización')

  }
}


