var Favoritos = function(){
		

	this.favoritos = {
		favorito 	: new Array(),
		version 	: 3
	}


	this.changeFavoritos = function(){
		favorito_obj = this;


		storageFav = JSON.parse(localStorage.getItem('favorito')); 



		$.each(storageFav,function(key,value){


			if (storageFav[key][0] == 1){
				if(storageFav[key][8] == undefined ){


					try{

							paradas.getParadas();
							var paradaFavorita = paradas.getParada(parseInt(storageFav[key][1]))

					}catch(e){
						storageFav[key][8] = "Parada "+storageFav[key][1];
						console.log('No se puede recuperar el nombre de la parada')

					}
				}
				favorito_obj.favoritos.favorito.push({
					'tipo'				: 0,
					'codigo'			: storageFav[key][1],
					'nombre'			: storageFav[key][8]


				})

			}else{
				if(storageFav[key][8] == undefined ){
					storageFav[key][8] = "Línea "+storageFav[key][1];
										console.log('Linea Undefined')

				}
				favorito_obj.favoritos.favorito.push({
					'tipo'				: 1,
					'codigo'			: storageFav[key][2],
					'nombre'			: storageFav[key][1]

				})
			}
		})

		localStorage.setItem('favoritos',JSON.stringify(favorito_obj.favoritos))
		localStorage.removeItem('favorito')

	}




	this.writeHtml = function(addToDiv, template){

		$(addToDiv).empty();
		
		if(template === null || template === undefined){
			template = new Object();
			template.parada = '#template-tarjeta-favorito-parada';
			template.linea 	= '#template-tarjeta-favorito-linea'
		}


		if (favorito_obj.favoritos != null){
			paradas.getParadas();

			lineas.getLineas();
			if(favorito_obj.favoritos.favorito.length == 0){
          		showMessage(traducir("lng-txt-nofav","No dispone de favoritos"),'ion-document','#favoritos-container')
	          	$('#favoritos-container').find('span.texto').addClass('lng-txt-nofav');
	
			}			
			$.each(favorito_obj.favoritos.favorito, function(key,value){
				if(value.codigo != undefined){
					switch(value.tipo){
						case 0: //Parada
							parada = paradas.getParada(value.codigo)
							var lista_paradas = paradas.crearTarjetaParada(parada, null, template.parada);
							lista_paradas.find('.nombre-parada').html(value.nombre);
							lista_paradas.unbind();
							lista_paradas.click(function(){
								hideHeader();
								event.preventDefault();
								$('#search').val(value.codigo);
								$('#codpar').submit();
		  			
								if($(this).hasClass('tarjeta-favorito-parada')){
									trackerEventAnalytics('Click','Parada favorita')

								}
							})

							
							lista_paradas.appendTo(addToDiv);
							lista_paradas.css('display','block');		
							lista_paradas.addClass('mix');		

							break;

						case 1: //Linea
							var linea_fav = lineas.getLinea(value.codigo);
							tarjeta_fav = lineas.crearTarjetaLinea(template.linea,linea_fav);

							tarjeta_fav.click(function(){
								hideHeader();	
								if($(this).hasClass('tarjeta-favorito-linea')){
									trackerEventAnalytics('Click','Línea favorita')

								}
							})
							tarjeta_fav.appendTo(addToDiv);
							tarjeta_fav.addClass('mix');

							break;
					}
				}

			})

		}else{
          	showMessage(traducir("lng-txt-nofav","No dispone de favoritos"),'ion-document','#favoritos-container')
          	$('#favoritos-container').find('span.texto').addClass('lng-txt-nofav');
  
			return;
		}		

	}    

	this.getFavoritos = function(){
		favorito_obj.favoritos = JSON.parse(localStorage.getItem('favoritos'));

	}


	this.setFavorito = function(tipo, datos){
		switch(tipo){
			case 0: //Parada
				codigoFav 	= datos.idParada;
				nombre 			= datos.nombre;
				break;
			case 1: //Linea
				codigoFav 	= datos.idlinea;
				nombre 			= datos.nombre_orig +' - '+datos.nombre_dest;
				
				break;
		}
		
		existe = favorito_obj.existeFavorito(tipo, codigoFav);

		if (existe == false){
			favorito_obj.favoritos.favorito.push({
				tipo: tipo,
				codigo: codigoFav,
				nombre: nombre 
			})

			localStorage.setItem('favoritos',JSON.stringify(favorito_obj.favoritos))

			favorito_obj.writeHtml('#favoritos-container');
			Materialize.toast(traducir("lng-toast-fav-agregado","Favorito agregado correctamente"), 4000)



		}else{
			Materialize.toast(traducir("lng-toast-fav-no-agregado","Este favorito ya existe"), 4000)
			
		} 

	}
	
	this.existeFavorito = function(tipo, id){
		console.log('Existe Favorito')
		favorito_obj = this;
		var favorito_encontrado = false;
		z = favorito_obj.favoritos;
		try{
			$.each(z.favorito,function(key, fav){
				if (tipo == fav.tipo){
					if(id == fav.codigo){
						favorito_encontrado = fav;
					}
				}
			})		
		}catch(e){
			alert(e)
			//TODO 
			//Mostrar Toast con aviso de que no se han podido recargar los favoritos
		}
		return favorito_encontrado;

	}

	this.searchFavortio = function(tipo, id){
		favorito_obj = this;
		var posicion = undefined;
		$.each(favorito_obj.favoritos.favorito,function(key,fav){

			if (tipo == fav.tipo){
				if(id == fav.codigo){
					posicion = key
					return true;
				}
			}
		})	
		return posicion;
	}

	this.borrarFavorito = function(tipo, id){
		favorito_obj = this;
		posicionFavorito = favorito_obj.searchFavortio(tipo,id);
		favorito_obj.favoritos.favorito.splice(posicionFavorito, 1)	
		localStorage.setItem('favoritos',JSON.stringify(favorito_obj.favoritos))

		try{
			if (tipo == 1){
				$('#linea-'+id).remove();
			}
			if (tipo == 0){
				//$('#parada-'+id).remove();
				$('#favoritos-container #parada-'+id).remove();
			}

		}catch(e){
			console.log('Imposible eliminar elemento en el div de favoritos')			
		}


	}

	this.editarFavorito = function(tipo, id, nombre){
		favorito_obj = this;
		posicionFavorito = favorito_obj.searchFavortio(tipo,id);
		favorito_obj.favoritos.favorito[posicionFavorito].nombre = nombre;
		localStorage.setItem('favoritos',JSON.stringify(favorito_obj.favoritos))

	}

}
