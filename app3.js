$(document).ready( function () {
	
	$("#buscar").click(busqueda);
	
	function busqueda(){
		$("#imagenes img").remove();
		$("#imagen img").remove();
		$("#titulo p").remove();
		$("#imagen").hide();
		$("#listaFotos").hide();
		$("#pools img"). remove();
		$("#pools").hide();
		$("#sets img"). remove();
		$("#sets").hide();
		$("#titulo").hide();
		//$("#atras2").hide();
		//$("#listaFotos").hide();
		//$("#imagenes").hide();
		//$("#pools").hide();
		
		
		//$("#imagen img").remove();
		$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' 
		+ api_key + '&format=json&nojsoncallback=1',
		{
			text: $("#query1text").val(),
			format: "json",
		},
		buscar_fotos
		
		)
		function buscar_fotos(info){
			
			$("#imagenes").show();
			var i;
				for (i=0;i<info.photos.photo.length;i++) {
					var item = info.photos.photo[i];
					var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
					+'/'+item.id+'_'+item.secret+'_m.jpg';
					console.debug(url);
					$("#imagenes").append($("<img/>").attr("src",url).attr("id",i));//.attr("onclick",mostrar_foto));//.attr("id","query2"));//.attr("width","500").attr("height","500"));
					$("#"+i).data("info_foto", {myurl: url, foto: item, ident:i});
					$("#"+i).click(ampliar);
			
				}
		}
	}
	function ampliar(){	
		//$("#imagen img").remove();
		//$("#titulo").empty();
		var reg_foto = $(this).data("info_foto");
		//console.debug(reg_foto.foto.id);
		$("#imagenes").hide();
		$("#pools").hide();
		$("#sets").hide();
		//$("#listaFotos").hide();
		$("#imagen").append($(this).attr("width",350).attr("height",350));
		$("#imagen").show();
		$("#titulo").show();
		$('#añadir').data('foto_ampliada', reg_foto);
		$("#añadir").click(guardar);
		
		$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.getAllContexts&api_key=' 
			+ api_key + '&photo_id='+reg_foto.foto.id +'&format=json&nojsoncallback=1',
		verSets_Pools
		)
		function verSets_Pools(info){
			var i,j;
			console.debug(reg_foto.foto.id);
			if (info.set != null){
				for (i=0; i<info.set.length;i++) {
					var titulo_alb = info.set[i].title;
					$("#titulo").append($("</p>").text("Este es el título del álbum: "+titulo_alb).attr("id","s"+j));
					$("#s"+j).data("info_set", {set: info.set[i]})
					$("#s"+j).click(obtener_fotos_set);
					console.debug(info.set[i].id);
					//console.debug(titulo_alb);
				}
			}
			if (info.pool!= null){
				for (j=0;j<info.pool.length;j++) {
					var titulo_pool = info.pool[j].title;
					$("#titulo").append($("</p>").text("Este es el título del grupo: "+titulo_pool).attr("id","p"+j));
					$("#p"+j).data("info_pool", {pool: info.pool[j]})
					$("#p"+j).click(obtener_fotos_pool);
					console.debug(info.pool[j].id);
				}
			}
		}
		$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.galleries.getListForPhoto&api_key=' 
			+ api_key + '&photo_id='+reg_foto.foto.id +'&format=json&nojsoncallback=1',
		verGalerias)
		
		function verGalerias(info){
			var j;
			if (info.galleries.gallery != null){
				for (j=0;j<info.galleries.gallery.length;j++) {
						var titulo_galeria = info.galleries.gallery[j].title;
						$("#titulo").append($("</p>").text("Este el titulo de la galería: "+titulo_galeria));
							//console.debug(titulo_galeria._content);
				}	
			}
		}
		
		$.getJSON ('https://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' 
			+ api_key + '&photo_id='+reg_foto.foto.id +'&format=json&nojsoncallback=1',
		verDescripcion)
			
		function verDescripcion(info){
			var descripcion = info.photo.description;
			$("#titulo").append($("</p>").text("Esta es la descripcion: " +descripcion._content));
			console.debug(descripcion._content);
		}
		
		
	}
	function guardar(){
			//console.debug(reg_foto.foto.id);
			var reg_foto = $(this).data('foto_ampliada');
			$("<img/>").attr("src",reg_foto.myurl).attr("id", reg_foto.ident).appendTo($("#listaFotos"));
			console.debug(reg_foto.foto.id);
	}
	function obtener_fotos_pool(){
		var reg_pool = $(this).data("info_pool");
		$("#imagen img").remove();
		$("#titulo").empty();
		$("#imagen").hide();
		$("#titulo").hide();
		//$("#pools").show();
		$.getJSON ('https://api.flickr.com/services/rest/?&method=flickr.groups.pools.getPhotos&api_key=' 
			+ api_key + '&group_id='+reg_pool.pool.id +'&format=json&nojsoncallback=1',
		mostrar_fotos_pool);
		
		function mostrar_fotos_pool(info){
			$("#pools").show();
			
			var i;
			if(info.photos != null){
					
				for (i=0;i<info.photos.photo.length;i++) {
					var item = info.photos.photo[i];
					var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
					+'/'+item.id+'_'+item.secret+'_m.jpg';
					$("#pools").append($("<img/>").attr("src",url).attr("id","f"+i));
					var ref = "#f"+i;
					$("#f"+i).data("info_foto", {myurl: url, foto: item, ident:ref});
					$("#f"+i).click(ampliar);
				}
			}
		}
	}	
	
	function obtener_fotos_set(){
		var reg_set = $(this).data("info_set");
		$("#imagen img").remove();
		$("#titulo").empty();
		$("#imagen").hide();
		$("#titulo").hide();
		//$("#pools").show();
		$.getJSON ('https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=' 
			+ api_key + '&photoset_id='+reg_set.set.id +'&format=json&nojsoncallback=1',
		mostrar_fotos_set);
		function mostrar_fotos_set(info){
			$("#sets").show();
			
			var i;
			if(info.photoset != null){
					
				for (i=0;i<info.photoset.photo.length;i++) {
					var item = info.photoset.photo[i];
					var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
					+'/'+item.id+'_'+item.secret+'_m.jpg';
					$("#sets").append($("<img/>").attr("src",url).attr("id","fo"+i));
					var ref = "#fo"+i;
					$("#fo"+i).data("info_foto", {myurl: url, foto: item, ident:ref});
					$("#fo"+i).click(ampliar);
				}
			}
			else{
				alert("Sin fotos");
			}
			//$("#atras2").show();
		}
	}
		
		
		
	
		
	$("#atras").click(function(){
			
		//$("#titulo").empty();
		$("#imagenes img").remove();
		busqueda();
	})
	
	$("#listapersonalizada").click(function(){
		$("#imagen").hide();
		$("#imagenes").hide();
		$("#titulo").hide();
		$("#pools").hide();
		$("#sets").hide();
		$("#listaFotos").show();
	})
	$("#atras1").click(function(){
			
		//$("#titulo").empty();
		$("#imagenes img").remove();
		busqueda();
	})
	/*$("#atras2").click(function(){
		$("#titulo").hide();
		$("#imagen img").remove();
		$("#imagen").hide();
		$("#sets").show();
	})*/
		
})