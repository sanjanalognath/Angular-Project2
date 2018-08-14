var app = angular.module('myApp', ['ngRoute'])


app.config(function($routeProvider) {
	
	$routeProvider.when('/', {
        templateUrl:'ulogin.html',
        controller:'loginController'
     	})
	.when('/home_page', {
        templateUrl:'home_page.html',
        controller : 'homeController',
        resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }]
        
     	})
	.when('/users_page', {
        templateUrl:'users_page.html',
        controller:'usersController',
        resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }] 
     	})
	.when('/userslist', {
        templateUrl:'userslist.html',
        controller:'listController',
        resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }] 
     	})
	.when('/logout',{
		template: '',
		controller: 'logoutcntrl'
	})
	.otherwise({
		redirectTo:"/"
	});
});


app.controller('loginController', function($scope,$location,$window, $rootScope){
$scope.authform ={}
//authService.checkUserStatus();
$scope.login = function() {
	$window.localStorage.isLoggedIn = false;
		if($scope.authform.username == "admin" && $scope.authform.pwd == "admin")
		{
		$location.path("/home_page");
		$window.localStorage.isLoggedIn = true;
		$rootScope.$broadcast('login');
		}
	}
	
});


app.controller('homeController', function($scope){
	$scope.pageTitle = "Welcome Home"
})

app.controller('myController', ['$scope', '$rootScope', function($scope, $rootScope){
	$rootScope.$on('login', function() {
		console.log('asd');
		$scope.userStatus = true;
	})
	$rootScope.$on('logout', function() {
		console.log('asd');
		$scope.userStatus = false;
	})
}])

app.factory('authService', function($location,$window, $timeout,$q){
	return {
		//$rootScope.broadcast('authcheck','isLoggedIn');
		'checkUserStatus' : function() {
			//alert("hellllooo");
			var defer = $q.defer();
			$timeout(function() {
				if(!$window.localStorage.isLoggedIn)
				{
					$location.path('/')
					defer.resolve();
					return false;

				}
				return true;
			}, 500);
			return defer.promise;
		}

	}
});

			
app.controller('usersController', function($scope,$location){
	
	$scope.authform = {}
	$scope.create = function()
	{
		var users = [];
		
        if(localStorage.newuser)
		{
			
			users = JSON.parse(localStorage.newuser)
    		//console.log(users);
		}
		
		
	 users.push($scope.authform);
     localStorage.newuser = JSON.stringify(users);
     console.log(localStorage.newuser);
     $location.path('/userslist');
	//console.log(localStorage.getItem('newuser'));
	}
	
});

app.controller('listController', function($scope, $window)
{

$scope.userdetail = JSON.parse($window.localStorage.getItem('newuser'));


});

app.controller('logoutcntrl', function($location, $rootScope){
	// Session.clear();
	localStorage.clear();
		$rootScope.$broadcast('logout');
	$location.path('/');
})
