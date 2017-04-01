
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


document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
  $(function(){
	//onLoad();  
    lineas  = new Lineas();
    paradas  = new Paradas();

    paradas_cercanas = new Paradas();
    resultado_cercanas = new Tiempos();
    resultado_parada = new Tiempos();
    favorito_obj = new Favoritos();
    console.log(favorito_obj)
    ultimasParadas = new Array (10);      
    if(localStorage.getItem('ultimasParadas')){
      ultimasParadas = JSON.parse(localStorage.getItem('ultimasParadas'))
    }
    console.log(ultimasParadas)
    getLastParadas(ultimasParadas, '#recientes-container', '#template-tarjeta-parada-cercana')
    if(localStorage.getItem('tarifas')){
      tarifas = localStorage.getItem('tarifas');
      var divContent = {
        tarifas         : '#content-tarifas',    
        observaciones   : '#observaciones-tarifas',  
      }
      writeTarifasHtml(divContent, tarifas);  
    }
    

  /* GET FAVORITOS  */

    try{

      if (localStorage.getItem('favorito')){
        //Comprobación de existencia de la clave favorito (versión anterior)
        favorito_obj.changeFavoritos();  
      }
       
      if (localStorage.getItem('favoritos')){

        favorito_obj.getFavoritos();  
      }else{
        
        
        localStorage.setItem('favoritos','{"favorito":[],"version":3}')
      }

      favorito_obj.writeHtml('#favoritos-container');
    }catch(err){

      Materialize.toast('E.FAV: '+err, 5000)
      console.log(err)

    }

  /* END GET FAVORITOS */



    cargarConfiguracion();
    inicializar();
    
    if (($('.menu').find('.active').parent()).hasClass('hide-header')){
      hideHeader();
    }

    $('#main').show(); 

    $('.menu').find('.active').click()

    try{
      if (localStorage.getItem('fecha_peticion')){
        fecha_peticion = localStorage.getItem('fecha_peticion')
      }else{
        //Enviar fecha 20160101T000000
        fecha_peticion = "20160101T000000"
      }
    }catch(err){
      Materialize.toast('No se ha encontrado fecha_peticion')
      Materialize.toast(traducir("lng-toast-error-fecha","No se ha encontrado fecha_peticion"),5000)
      fecha_peticion = "20160101T000000"
    }

    idioma = getIdioma();
    getDataInicial(fecha_peticion,idioma)

    $('#content').css('padding-top',$('#header-wrap').height());

  })	
}