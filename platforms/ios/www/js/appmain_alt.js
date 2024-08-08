    var interstitial;

    function onLoad() {
      if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }


    function initApp() {
      if (/(android)/i.test(navigator.userAgent)){
        interstitial = new admob.InterstitialAd({
            //dev
            adUnitId: 'ca-app-pub-3940256099942544/1033173712'
            //prod
            //adUnitId: 'ca-app-pub-9249695405712287/8454477151'
          });
        }
        else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
            interstitial = new admob.InterstitialAd({
                //dev
                adUnitId: 'ca-app-pub-3940256099942544/4411468910'
                //prod
                //adUnitId: 'ca-app-pub-9249695405712287/9598291958'
              });
        }
        registerAdEvents();
        interstitial.load();
        //createSelectedBanner();
        //loadApp();
    }

    // optional, in case respond to events or handle error
    function registerAdEvents() {
      // new events, with variable to differentiate: adNetwork, adType, adEvent
          document.addEventListener('admob.ad.load', function (data) {
              document.getElementById('main').style.visibility = 'visible';
              document.getElementById("screen").style.display = 'none';    
          });
          document.addEventListener('admob.ad.loadfail', function (data) {
              document.getElementById('main').style.visibility = 'visible';
              document.getElementById("screen").style.display = 'none'; 
          });
          document.addEventListener('admob.ad.show', function (data) { 
              document.getElementById('main').style.visibility = 'visible';
              document.getElementById("screen").style.display = 'none';     
          });
          document.addEventListener('admob.ad.dismiss', function (data) {
              document.getElementById('main').style.visibility = 'visible';
              document.getElementById("screen").style.display = 'none';     
          });
      }

    function showAd()
    {
      document.getElementById("screen").style.display = 'block';     
      interstitial.show();
      document.getElementById("screen").style.display = 'none'; 
    }


   function checkFirstUse()
    {
      initApp();
      checkPermissions();
      askRating();
    }

   function notFirstUse()
    {
        document.getElementById('main').style.visibility = 'visible';
        document.getElementById('screen').style.display = 'none';
    }

    function initApp1()
{
    if (/(android)/i.test(navigator.userAgent)){
    interstitial = new admob.InterstitialAd({
        //dev
        //adUnitId: 'ca-app-pub-3940256099942544/1033173712'
        //prod
        adUnitId: 'ca-app-pub-9249695405712287/8454477151'
      });
    }
    else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        interstitial = new admob.InterstitialAd({
            //dev
            //adUnitId: 'ca-app-pub-3940256099942544/4411468910'
            //prod
            adUnitId: 'ca-app-pub-9249695405712287/9598291958'
          });
    }
    registerAdEvents1();
    interstitial.load();
}

function registerAdEvents1() {
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('admob.ad.load', function (data) {
      document.getElementById('main').style.visibility = 'visible';
      document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('admob.ad.loadfail', function (data) {
      document.getElementById('main').style.visibility = 'visible';
      document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('admob.ad.show', function (data) { 
      document.getElementById('main').style.visibility = 'visible';
      document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('admob.ad.dismiss', function (data) {
      document.getElementById('main').style.visibility = 'visible';
      document.getElementById("screen").style.display = 'none';     
    });
}

function showAd1()
{
    document.getElementById("screen").style.display = 'block';     
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        interstitial.show();
    }
    document.getElementById("screen").style.display = 'none'; 
}

    function checkPermissions(){
      const idfaPlugin = cordova.plugins.idfa;
  
      idfaPlugin.getInfo()
          .then(info => {
              if (!info.trackingLimited) {
                  return info.idfa || info.aaid;
              } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                  return idfaPlugin.requestPermission().then(result => {
                      if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                          return idfaPlugin.getInfo().then(info => {
                              return info.idfa || info.aaid;
                          });
                      }
                  });
              }
          });
  }

function askRating()
{
    const appRatePlugin = AppRate;
    appRatePlugin.setPreferences({
        reviewType: {
            ios: 'AppStoreReview',
            android: 'InAppBrowser'
            },
  useLanguage:  'es',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1227250068',
                android: 'market://details?id=com.tranvias.withads'
               }
});
 
AppRate.promptForRating(false);
}

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