    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

    var admobid = {};
    if (/(android)/i.test(navigator.userAgent)) {
        admobid = { // for Android
            banner: 'ca-app-pub-1683858134373419/2524889484',
            interstitial:'ca-app-pub-9249695405712287/8454477151'
           //banner: 'ca-app-pub-3886850395157773/3411786244'
            //interstitial: 'ca-app-pub-9249695405712287/3301233156'
        };
    }
    else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
     admobid = {
            banner: 'ca-app-pub-1683858134373419/2524889484',
            interstitial:'ca-app-pub-9249695405712287/9598291958'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        // display the banner at startup
        loadInterstitial();
        //createSelectedBanner();
        loadApp();
    }
    function initAd() {
        var defaultOptions = {
            // bannerId: admobid.banner,
            // interstitialId: admobid.interstitial,
            // adSize: 'SMART_BANNER',
            // width: integer, // valid when set adSize 'CUSTOM'
            // height: integer, // valid when set adSize 'CUSTOM'
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
            bgColor: 'black', // color name, or '#RRGGBB'
            // x: integer,      // valid when set position to 0 / POS_XY
            // y: integer,      // valid when set position to 0 / POS_XY
            isTesting: false // set to true, to receiving test ad for testing purpose
            // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
//        AndroidFullScreen.immersiveMode(successFunction, errorFunction);    
        }
    // optional, in case respond to events or handle error
    function registerAdEvents() {

        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            //// old version  
            //var iframe = document.getElementById('embed');
            //iframe.src = iframe.src;
            //document.getElementById('fullpage').style.display = 'block';
            //// New version
            document.getElementById('main').style.visibility = 'visible';
            document.getElementById('screen').style.display = 'none';
        });
        document.addEventListener('onAdLoaded', function (data) {
            AdMob.showInterstitial();
        });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { });
        document.addEventListener('onAdDismiss', function (data) {
            //// old version  
            //var iframe = document.getElementById('embed');
            //iframe.src = iframe.src;
            //document.getElementById('fullpage').style.display = 'block';
            //// New version
            document.getElementById('main').style.visibility = 'visible';
            document.getElementById('screen').style.display = 'none';
			});
    }

    function createSelectedBanner() {
       AdMob.createBanner({adId:admobid.banner});
    }

    function successFunction()
    {
    }
 
    function errorFunction(error)
    {
    }

    function loadInterstitial() {
        if ((/(android|windows phone)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: false });
            //document.getElementById('main').style.visibility = 'visible';
            //document.getElementById('screen').style.display = 'none';    
        } else if ((/(ipad|iphone|ipod)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: true });
            //document.getElementById('main').style.visibility = 'visible';
            //document.getElementById('screen').style.display = 'none';    
        } else
        {
            document.getElementById('main').style.visibility = 'visible';
            document.getElementById('screen').style.display = 'none';   
        }
    }


   function checkFirstUse()
    {

           askRating();
           initApp();
		   ////onDeviceReady();
            ////New version
            //document.getElementById('screen').style.display = 'none';
            //document.getElementById('main').style.visibility = 'visible';
           ////Old Version 
           //document.getElementById('fullpage').style.display = 'block';
           // var iframe = document.getElementById('embed');
           // iframe.src = iframe.src;
    }

   function notFirstUse()
    {
        document.getElementById('main').style.visibility = 'visible';
        document.getElementById('screen').style.display = 'none';
    }

function askRating()
{
  AppRate.preferences = {
  openStoreInApp: true,
  useLanguage:  'es',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: false,
  storeAppURL: {
                ios: '1227250068',
                android: 'market://details?id=com.tranvias.withads'
               }
};
 
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