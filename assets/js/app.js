var cronycle_collections = angular.module( "cronycle_collections", [ "swipe", "angular-md5" ] );

cronycle_collections.controller("collections",[ "$scope", "$http", "md5", function( $scope, $http, md5 ){
	$scope.init = function( collection, mode, instance, timestamp )
	{
		$scope.instance = instance;
		$scope.collection = collection;
		$scope.mode = mode;
		
		$scope.app = angular.element( document.getElementById( "cronycle-collections-" + $scope.instance ) );
		$scope.articles = $scope.app.find("section");
		
		$scope.currentTimestamp = timestamp;
		$scope.currentArticle = 0;
		$scope.currentOffset = "";
		$scope.loading = false;
		$scope.loadedAll = false;
		$scope.firstCall = true;

		$scope.load();
	}
	
	var article, header,
		reset_styles =  "text-transform: none !important;" +
						"text-indent: 0 !important;" +
						"text-decoration: none !important;" + 
						"border: none !important;" + 
						"background: none !important;" + 
						"margin: 0 !important;" + 
						"padding: 0 !important;", 
	
		style_caption = reset_styles + 
				"font-size: 18px !important;" +
				"line-height: 1.4 !important",
				
		style_header_container = reset_styles + 
				"line-height: 18px !important;" +
				"margin: .5em 0 !important;" +
				"hyphens: auto;" +
				"-ms-hyphens: auto;" +
				"-moz-hyphens: auto;" +
				"-webkit-hyphens: auto;" +
				"padding: 0 10px !important",
		
		style_header_text = reset_styles + 
				"font-size: 18px !important;" +
				"font-weight: 400 !important;" +
				"line-height: 1 !important",
				
		style_content = reset_styles + 
				"font-size: 14px !important;" +
				"line-height: 1.8 !important;" +
				"color: #999 !important;" +
				"margin: 0 0 1.5em 0 !important;" +
				"padding: 0 10px !important;" +
				"-webkit-box-flex: 3 0 auto !important;" +
				"-webkit-flex: 3 0 auto !important;" +
				"-ms-flex: 3 0 auto !important;" +
				"flex: 3 0 auto !important",
				
		style_tail = reset_styles + 
				"font-size: 12px !important;" +
				"line-height: 40px !important;" +
				"color: #777 !important;" +
				"border-top: 1px solid #ebebeb !important;" +
				"margin: 0 !important;" +
				"padding: 0 10px 0 30px !important;" +
				"position: relative !important";
	
	$scope.next = function(e){
		++$scope.currentArticle;
		$scope.slide();
		if ( ( $scope.articles.children().length - $scope.currentArticle < 6 ) && !$scope.loading && !$scope.loadedAll ) $scope.load();
	};
	
	$scope.prev = function(){
		--$scope.currentArticle;
		$scope.slide();
	};
	
	$scope.slide = function(){
		var currentArticle = $scope.articles.children().eq( $scope.currentArticle );
		$scope.currentOffset = ( $scope.mode == "h" ? "left: " + ( $scope.offsetLeft - currentArticle.prop("offsetLeft") ) : "top: " + ( $scope.offsetTop - currentArticle.prop("offsetTop") ) ) + "px";
		$scope.listedAll = $scope.articles.children().length - 1 == $scope.currentArticle;
	};
	
	var random = function( min, max ){
		return parseInt( Math.random() * (max - min) + min );
	};
	
	$scope.load = function(){
		$scope.loading = true;
		$http.get( 
			ajax.ajaxurl, 
			{ 
				params: 
				{ 
					action: "getArticles", 
					collection: $scope.collection, 
					timestamp: $scope.currentTimestamp
				}
			} 
		)
		.success(function(data, status, headers, config){
            var imageProxy = "https://morpheus.cronycle.com/resize?url=";
			if ( angular.isDefined( data.articles ) )
			{
                var sources = '';
                for ( var i = $scope.firstCall ? 0 : 1; i < data.articles.length; i++ )
				{
					article = data.articles[i];
					
					switch ( article.media_type )
					{
						case "image":
							header = "<a href='"+article.url+"' target='_blank' class='image' style='background-image: url("+imageProxy+encodeURIComponent(article.media_url)+"&h=100&p="+md5.createHash( article.media_url + "jpy" )+")'></a>";
						break;
						
						case "video":
							header = "<div>" + article.media_embed + "</div>";
						break;
						
						default:
							header = "<a href='"+article.url+"' target='_blank' class='gradient gradient-"+random( 1, 6 )+"'></a>";
					}

                    sources = "";
                    if ( article.sources )
                    {
                        var sourceImage = article.sources.image ? '<img src="'+imageProxy+encodeURIComponent(article.sources.image)+'&w=15&h=15&p='+md5.createHash( article.sources.image + "jpy" )+'" alt="'+article.sources.name+'"> ' : "",
                            sourceLink = article.sources.name ? "" : " <a href='"+article.sources.url+"' target='_blank'>"+article.sources.url+"</a>";

                        sources = "<div class='sources'>"+sourceImage+"<a href='"+article.sources.url+"' class='name' target='_blank'>"+article.sources.name+"</a>"+sourceLink+"</div>";
                    }

					$scope.articles.append("<article class='cronycle-article'>\
							"+header+"\
							<h2 style='"+style_header_container+"'><a href='"+article.url+"' style='"+style_header_text+"' target='_blank'>"+article.name+"</a></h2>\
							<p style='"+style_content+"'>"+article.description+"</p>\
							" + sources + "\
							<span style='"+style_tail+"'>"+article.date+"</span>\
						</article>");
				}
			}

			if ( $scope.firstCall )
			{
				var first_article = $scope.articles.children("article").eq(0);
				$scope.offsetLeft = first_article.prop("offsetLeft");
				$scope.offsetTop = first_article.prop("offsetTop");
			}
			
			$scope.currentTimestamp = data.timestamp;
			$scope.loadedAll = true;
            if ( angular.isDefined( data.articles ) )
            {
                $scope.loadedAll = data.articles.length < 10 ? true : false;
            }

            $scope.firstCall = false;
		})
		.finally(function(){
			$scope.loading = false;
		});
	};
}]);