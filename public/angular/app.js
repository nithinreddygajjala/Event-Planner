var module=angular.module('ng-app',['ngRoute','ngCookies']);



module.factory('getstatus', function($http) {
    return {
        getProduct: function() {
            return $http.get('/check').then(function(response) {
                return response.data;
            });
        }
    };
});





module.service('logoutuser',function($http,$q,$location){
  this.logout1=function(){
    $http({
               headers: {'Content-Type': 'application/json'},
            url: '/auth',
            method: "GET"
        })
        .then(function(response) {
                //window.location = "/";
                console.log(typeof(response.data));
                console.log(response.data);


        },
        function(response) { // optional

        });

  }

  this.check=function(){
var run=function(){
  var x;
  $http.get('/check').success(function(data){
    x=data;
  });
}




  }
});
module.service('savedata',function($cookieStore){
  this.myfunc=function(a,b,date,id){
    $cookieStore.put('name',a);
    $cookieStore.put('place',b);
      $cookieStore.put('date',date);
      $cookieStore.put('id',id);
  },
  this.getName=function(){
    return $cookieStore.get('name');

  },
  this.getPlace=function(){
    return $cookieStore.get('place');

  },
  this.getDate=function(){
    return $cookieStore.get('date');

  },
  this.delete=function(){
    $cookieStore.remove('name');
    $cookieStore.remove('place');
    $cookieStore.remove('date');
  },this.getId=function(){
    return $cookieStore.get('id');
  }
});
module.controller('control1',function($rootScope,$scope,$http,$cookies,$cookieStore,savedata,logoutuser,$location,$window){
$scope.logoff=function(){
  logoutuser.logout1();
console.log('user logged out');
};
$scope.name=savedata.getName();
$scope.place=savedata.getPlace();
$scope.date=savedata.getDate();
$scope.id=savedata.getId();
  $scope.details=function(param0,param1,param2,param3){
    savedata.delete();
    console.log(param3);
    savedata.myfunc(param0,param1,param2,param3);
    $scope.name=savedata.getName();
$scope.place=savedata.getPlace();
$scope.id=savedata.getId();

  }
$scope.test;
  $scope.message='hello world';
  $http.get("/getdata")
  .then(function(response){


     $scope.test=response.data;
     $scope.buffer=$scope.test;
   });

$scope.buffer=[];
  $scope.data=[{
    date:new Date('12/10/2016'),
    data:[{
      name:'meetup1',
      place: 'Fullerton'
    }]

  },{
    date:new Date('12/2/2016'),
    data:[{
      name:'meetup2',
      place: 'Santa Ana'
    },{
      name:'meetup2',
      place: 'Santa Ana cruz'
    }]

  },{
    date:new Date('12/9/2016'),
    data:[{
      name:'meetup3',
      place: 'Sanjose'
    }]

  },{
    date:new Date('12/7/2016'),
    data:[{
      name:'meetup1',
      place: 'Tustin'
    }]

  },
  {
    date:new Date('12/1/2016'),
    data:[{
      name:'sup6',
      place: 'beverly'
    }]

  }
  ];
$scope.created;
$scope.createdevent=function(){

}
$http.get('/test').success(function(data){
console.log(data);
$scope.created=data;
});

$scope.deleteevent=function(id){
console.log('event deleted');
$http({
           headers: {'Content-Type': 'application/json'},
        url: '/delete',
        method: "DELETE",
        data: { data:id}
    })
    .then(function(response) {

      $location.url('/dashboard');
      $window.location.reload();

    },
    function(response) { // optional
            alert(' you had done rsvp');
    });
}
$scope.update;
$http.get('/tester').success(function(data){
  $scope.update=data;
});
$scope.username;
$http.get('/loggedinuser').success(function(data){
  $scope.username=data;
  console.log($scope.username);

});







$scope.deletersvp=function(i){
  console.log(i);
  $http({
             headers: {'Content-Type': 'application/json'},
          url: '/removersvp',
          method: "DELETE",
          data: { data:i}
      })
      .then(function(response) {

      console.log('removed');
      $location.path('/dashboard');
      $window.location.reload();

      },
      function(response) { // optional
              alert(' you had done rsvp');
      });

};


$scope.change=function(temp){


$scope.buffer=[];


console.log(temp.split('-').reverse().join('-'));
    for(var i=0;i<$scope.test.length;i++){
      console.log($scope.test[i].startdate.substring(0,10));
      if(new Date(temp.split('-').reverse().join('-')).toISOString()<=$scope.test[i].startdate){

$scope.buffer.push($scope.test[i]);
console.log($scope.buffer);
      }
    }
//$scope.data=[];

  // $scope.data.push($scope.buffer);

console.log($scope.buffer);
}

$scope.postAttendance=function(){
  console.log($scope.id);

$http({
           headers: {'Content-Type': 'application/json'},
        url: '/attendance',
        method: "POST",
        data: { id:$scope.id}
    })
    .then(function(response) {

            $location.path('/index2');
            $window.location.reload();


    },
    function(response) { // optional
            alert(' you had done rsvp');
    });


}
});


module.config(function($routeProvider){
var checklog=function($location, $q, logoutuser,getstatus){
  var deferred = $q.defer();

  getstatus.getProduct().then(function(data){
    console.log(data);
          if (data) {
              deferred.resolve();

          } else {
              deferred.reject();


                $location.url('/');
                  alert('user must be logged in !');
          }

          return deferred.promise;
        });
};

  $routeProvider.when('/',{
    templateUrl:'./views/main.html'

  }).when('/signin',{
    templateUrl:'./views/login.html',

  }).when('/signup',{
    templateUrl:'./views/signup.html'
  }).when('/create',{
    templateUrl:'./views/meetupform.html',
    resolve:{loggedin:checklog}
  }).when('/rsvp',{
    templateUrl:'./views/rsvp.html',
    resolve:{loggedin:checklog}
  }).when('/detailed',{
    templateUrl:'./views/detailed.html',


  }).when('/dashboard',{
    templateUrl:'./views/dashboard.html',
resolve:{loggedin:checklog}

  }).when('/index2',{
    templateUrl:'./views/index2.html',
resolve:{loggedin:checklog}

  });
});

module.directive('datepicker',function(){
  function link(scope, element, attrs) {
            // CALL THE "datepicker()" METHOD USING THE "element" OBJECT.
            element.datepicker({
                dateFormat: "dd-mm-yy",

            });
        }
        return {
            require: 'ngModel',
            link: link
        };
});











// date picker
