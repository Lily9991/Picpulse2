angular.module('app.controllers', [])
	.factory('settings', ['$rootScope', function($rootScope){
		// supported languages
		
		var settings = {
			languages: [
				{
					language: 'English',
					translation: 'English',
					langCode: 'en',
					flagCode: 'us'
				},
				{
					language: 'Espanish',
					translation: 'Espanish',
					langCode: 'es',
					flagCode: 'es'
				},
				{
					language: 'German',
					translation: 'Deutsch',
					langCode: 'de',
					flagCode: 'de'
				},
				{
					language: 'Korean',
					translation: '한국의',
					langCode: 'ko',
					flagCode: 'kr'
				},
				{
					language: 'French',
					translation: 'français',
					langCode: 'fr',
					flagCode: 'fr'
				},
				{
					language: 'Portuguese',
					translation: 'português',
					langCode: 'pt',
					flagCode: 'br'
				},
				{
					language: 'Russian',
					translation: 'русский',
					langCode: 'ru',
					flagCode: 'ru'
				},
				{
					language: 'Chinese',
					translation: '中國的',
					langCode: 'zh',
					flagCode: 'cn'
				}
			],
			
		};

		return settings;
		
	}])
	
	.controller('PageViewController', ['$scope', '$route', '$animate', function($scope, $route, $animate) {
		// controler of the dynamically loaded views, for DEMO purposes only.
		/*$scope.$on('$viewContentLoaded', function() {
			
		});*/
	}])

	.controller('SmartAppController', ['$scope', function($scope) {
		// your main controller 
		$scope.currentPage;
		$scope.setCurrentPage = function(page){
			console.log('new current page');
			$scope.currentPage = page;
			console.log($scope.currentPage);
		}

		
	}])

	.controller('LangController', ['$scope', 'settings', 'localize', function($scope, settings, localize) {
		$scope.languages = settings.languages;
		$scope.currentLang = settings.currentLang;
		$scope.setLang = function(lang) {
			settings.currentLang = lang;
			$scope.currentLang = lang;
			localize.setLang(lang);
		}

		// set the default language
		$scope.setLang($scope.currentLang);

	}])

	.controller('GraphCtrl', function ($scope, $http) {
		$scope.counter = 0;
		$scope.selectedIds = [];
    	$scope.datapoints=[];	    
        $scope.datacolumns=[];
		$scope.datax={"id":"x"};
		$scope.series = 0;

		$scope.getdata = function(){

			$scope.series += 1;
			$scope.selectedIds.push(0);

    		$http({
    			url: '/trendtracer/v1/tags', 
    			method: "GET",
    			params: {id:$scope.selectedIds,
    				series:$scope.series,
    				range:30}
    		}).success(function(data,status,headers,config){

            for (i = 0; i < data.length; i++) {
            	var date = new Date(data[i]['x']);
            	data[i]['x'] = new Date(date);
            }
            
            var series_id = "Series " + $scope.series.toString();
            var refreshed_data = [];
            if ($scope.datapoints.length != 0) {
            	for(i = 0; i < data.length; i++){
            		var dict = {};
            		for (key in $scope.datapoints[i]) {
            			dict[key] = $scope.datapoints[i][key];
            		}
            		dict[series_id] = data[i][series_id];
            		refreshed_data.push(dict);
            	}
            	$scope.datapoints = refreshed_data;
            }
            else {
            	$scope.datapoints = data;
            }

    		$scope.datacolumns.push({"id":series_id,"type":"line"});
    		$scope.selectedIds.length = 0;

    		})
    		.error(function(data,status,headers,config){}
    		);
    	}

	})
	

	.controller('SearchBrowseCtrl', function ($scope) {
		$scope.tagShow = false;
		$scope.tags = [];
		$scope.selectedIds = $scope.$parent.selectedIds;

		var icons1 = [
				"img/searchbarIcon/Bmerchadise.png",
				"img/searchbarIcon/Bbrand1.jpg",			
				"img/searchbarIcon/Bcelebrity.jpg",
				"img/searchbarIcon/Bcolor1.png",
				"img/searchbarIcon/Bpattern2.jpg",	
				"img/searchbarIcon/Bmaterial.jpg",	
				"img/searchbarIcon/Boccassion.jpg",
				"img/searchbarIcon/Bdesigner.jpg",			
			];
		var icons2 = [
				"img/searchbarIcon/Bjacket.jpg",
				"img/searchbarIcon/Bcoat.jpg",
				"img/searchbarIcon/Bfootwear.jpg",
				"img/searchbarIcon/Bjeans.jpg",
				"img/searchbarIcon/Bshorts.jpg",
				"img/searchbarIcon/Btoppings.jpg",
				 "img/searchbarIcon/Bpajamas.jpg"						
			];
		var dict ={ "img/searchbarIcon/Bjacket.jpg":22,
					"img/searchbarIcon/Bcoat.jpg":28,
					"img/searchbarIcon/Bfootwear.jpg":89,
					"img/searchbarIcon/Bjeans.jpg":90,
					"img/searchbarIcon/Bshorts.jpg":222,
					"img/searchbarIcon/Btoppings.jpg":226,
					 "img/searchbarIcon/Bpajamas.jpg":18
		};

		var tagNames ={"22":"Jacket",
					"28":"Coat",
					"89":"Footwear",
					"90":"Jeans",
					"222":"Shorts",
					"226":"Tops",
					"18":"Pajamas"};

		$scope.currentIcons = icons1;
		$scope.nextLayer = function(){
			switch($scope.currentIcons){
				case icons1:
					$scope.currentIcons = icons2;
					break;
				case icons2:	
					$scope.currentIcons = icons2;
					var tagId = $scope.selectedIds[$scope.selectedIds.length-1];
					$scope.tags.push({text:tagNames[tagId.toString()]});
					$scope.tagShow2 =true;
					break;
			}

		}
		$scope.getTagId = function(icon1){
			if ($scope.selectedIds == undefined) {
				$scope.selectedIds == [];
			};
			if(dict[icon1] != undefined) {
				$scope.selectedIds.push(dict[icon1]);
			}
			//console.log(dict[icon1]);
		}
		
		$scope.doneSelecting = function(){
			$scope.$parent.doneSelecting();
			if($scope.tags.length !=0){
				$scope.hideText =true;
				$scope.tagShow = true;	
			}			
		}
		})



	.controller('ShowChartCtrl', function($scope){
		$scope.newSeriesShow = false;
		$scope.newSeriesShow2 = false;
		$scope.newSeriesShow3 = false;
		$scope.newSeriesShow4 = false;
		$scope.counter = 0;
		$scope.doneSelecting = function(){
			$scope.chartReady = true;
			if($scope.counter==3){
				$scope.newSeriesShow4 = true;
				$scope.counter +=1;

			}
			if($scope.counter==2){
				$scope.newSeriesShow3 = true;
				$scope.counter +=1;

			}
			if($scope.counter==1){
				$scope.newSeriesShow2 = true;
				$scope.counter +=1;

			}
			if($scope.counter==0){
				$scope.newSeriesShow = true;
				$scope.counter +=1;
			}
			
			
		}
		
	})

	.controller('ShowGalleryCtrl', function($scope){
		var dress = [
				"img/gallery/yellow/Escada-Spring-2014-Collection-yellow-dress.jpg",
				"img/gallery/yellow/Neon-Yellow-Dress.jpg",		
				"img/gallery/yellow/NMT5L9V_mx-240x300.jpg",
				"img/gallery/yellow/victorias-secret-yellow-short-strapless-dress.jpg",
				"img/gallery/yellow/windowslivewriterstyleitlesswishlistspringdressesfromneim-9e92donna-morgan-eyelet-yellow-dress-thumb.jpg",	
				"img/gallery/yellow/yellow-dress-3.jpg",	
				"img/gallery/yellow/yellow-stripe-dress-sunglasses.jpg",
				"img/gallery/yellow/zara-vestidos-2~look-main-single.jpg"			
			];
		$scope.currentDresses = dress;
		$scope.newSeriesShow = false;
		$scope.doneSelecting = function(){
			$scope.chartReady = true;
			$scope.newSeriesShow = true;
		}
		
	})


	.controller('TagCtrl', function($scope, $http) {
		$scope.tags = $scope.$parent.tags;
		})

	
	.controller('DropdownCtrl', function ($scope) {
  	
  		$scope.status = {
    		isopen: false
 		 };

  		$scope.toggled = function(open) {
    		console.log('Dropdown is now: ', open);
  		};

  		$scope.toggleDropdown = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();
    	$scope.status.isopen = !$scope.status.isopen;
  		};
	});


angular.module('app.demoControllers', [])
	.controller('WidgetDemoCtrl', ['$scope', '$sce', function($scope, $sce) {
		$scope.title = 'SmartUI Widget';
		$scope.icon = 'fa fa-user';
		$scope.toolbars = [
			$sce.trustAsHtml('<div class="label label-success">\
				<i class="fa fa-arrow-up"></i> 2.35%\
			</div>'),
			$sce.trustAsHtml('<div class="btn-group" data-toggle="buttons">\
		        <label class="btn btn-default btn-xs active">\
		          <input type="radio" name="style-a1" id="style-a1"> <i class="fa fa-play"></i>\
		        </label>\
		        <label class="btn btn-default btn-xs">\
		          <input type="radio" name="style-a2" id="style-a2"> <i class="fa fa-pause"></i>\
		        </label>\
		        <label class="btn btn-default btn-xs">\
		          <input type="radio" name="style-a2" id="style-a3"> <i class="fa fa-stop"></i>\
		        </label>\
		    </div>')
		];

		$scope.content = $sce.trustAsHtml('\
						Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\
						tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
						quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\
						cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\
						proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
	}])


	.controller('ActivityDemoCtrl', ['$scope', function($scope) {
		var ctrl = this;
		ctrl.getDate = function() {
			return new Date().toUTCString();
		};

		$scope.refreshCallback = function(contentScope, done) {

			// use contentScope to get access with activityContent directive's Control Scope
			console.log(contentScope);

			// for example getting your very long data ...........
			setTimeout(function() {
				done();
			}, 3000);

			$scope.footerContent = ctrl.getDate();
		};

		$scope.items = [
			{
				title: 'Msgs',
				count: 14, 
				src: 'ajax/notify/mail.html',
				onload: function(item) {
					console.log(item);
					alert('[Callback] Loading Messages ...');
				}
			},
			{
				title: 'Notify',
				count: 3,
				src: 'ajax/notify/notifications.html'
			},
			{
				title: 'Tasks',
				count: 4,
				src: 'ajax/notify/tasks.html',
				//active: true
			}
		];

		$scope.total = 0;
		angular.forEach($scope.items, function(item) {
			$scope.total += item.count;
		})

		$scope.footerContent = ctrl.getDate();
		
	}]);


