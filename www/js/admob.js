    function onLoad() {
        //if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        //    document.addEventListener('deviceready', checkFirstUse, false);
        //} else {
            checkFirstUse();
        //}
    }

    var admobid = {};
    if (/(android)/i.test(navigator.userAgent)) {
        admobid = { // for Android
            banner: 'ca-app-pub-1683858134373419/2524889484',
            interstitial:'ca-app-pub-1683858134373419/6232537882'
           //banner: 'ca-app-pub-3886850395157773/3411786244'
            //interstitial: 'ca-app-pub-9249695405712287/3301233156'
        };
    }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        // display the banner at startup
        loadInterstitial();
        //createSelectedBanner();
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
        /* deprecated
        document.addEventListener('onBannerFailedToReceive', function(data){ alert('error: ' + data.error + ', reason: ' + data.reason); });
        document.addEventListener('onBannerReceive', function(){});
        document.addEventListener('onBannerPresent', function(){});
        document.addEventListener('onBannerLeaveApp', function(){});
        document.addEventListener('onBannerDismiss', function(){});

        document.addEventListener('onInterstitialFailedToReceive', function(data){ alert('error: ' + data.error + ', reason: ' + data.reason); });
        document.addEventListener('onInterstitialReceive', function(){});
        document.addEventListener('onInterstitialPresent', function(){});
        document.addEventListener('onInterstitialLeaveApp', function(){});
        document.addEventListener('onInterstitialDismiss', function(){});
        */

        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById('main').style.visibility = 'visible';
            document.getElementById('screen').style.display = 'none';
        });
        document.addEventListener('onAdLoaded', function (data) { });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { });
        document.addEventListener('onAdDismiss', function (data) {
            document.getElementById('main').style.visibility = 'visible';
            document.getElementById('screen').style.display = 'none';
			});
    }

    // click button to call following functions
    //function getSelectedAdSize() {
    //    var i = document.getElementById("adSize").selectedIndex;
    //    var items = document.getElementById("adSize").options;
    //    return items[i].value;
    //}
    //function getSelectedPosition() {
    //    var i = document.getElementById("adPosition").selectedIndex;
    //    var items = document.getElementById("adPosition").options;
    //    return parseInt(items[i].value);
    //}
    function createSelectedBanner() {
        //var overlap = document.getElementById('overlap').checked;
        //var offsetTopBar = document.getElementById('offsetTopBar').checked;
        //AdMob.createBanner( {adId:admobid.banner, overlap:overlap, offsetTopBar:offsetTopBar, adSize: getSelectedAdSize(), position:getSelectedPosition()} );
        AdMob.createBanner({adId:admobid.banner});
    }
    //function createBannerOfGivenSize() {
    //    var w = document.getElementById('w').value;
    //    var h = document.getElementById('h').value;

    //    AdMob.createBanner({ adId: admobid.banner,
    //        adSize: 'CUSTOM', width: w, height: h,
    //        position: getSelectedPosition()
    //    });
    //}
    //function showBannerAtSelectedPosition() {
    //    AdMob.showBanner(getSelectedPosition());
    //}
    //function showBannerAtGivenXY() {
    //    var x = document.getElementById('x').value;
    //    var y = document.getElementById('y').value;
    //    AdMob.showBannerAtXY(x, y);
    //}
    //function prepareInterstitial() {
    //    var autoshow = document.getElementById('autoshow').checked;
    //    AdMob.prepareInterstitial({ adId: admobid.interstitial, autoShow: autoshow });
    //}

    function successFunction()
    {
    }
 
    function errorFunction(error)
    {
    }

   function loadInterstitial() {
        AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: true });
    }


   function checkFirstUse()
    {

           askRating();
           initApp();
		   //onDeviceReady();
    }

function askRating()
{
  AppRate.preferences = {
  openStoreInApp: true,
  useLanguage:  'es',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: false,
  storeAppURL: {
                android: 'market://details?id=com.tranvias.withads'
               }
};
 
AppRate.promptForRating(false);
}

function openWindow(url)
{
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
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