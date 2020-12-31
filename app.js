(function(){
'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm="";

  menu.onclick = function () {
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    promise.then(function (response) {
      if(menu.searchTerm==""){
        menu.error="Nothing found!";
        menu.found=[];
      }else{
        menu.found = response;
        menu.error='';
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  menu.removeItem = function (itemIndex) {
    menu.found.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http,ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    var foundItems = [];
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (result) {
      for (const i in result.data.menu_items) {
        if (result.data.menu_items[i].description.toLowerCase().indexOf(searchTerm) !== -1) {
           foundItems.push(result.data.menu_items[i]);
         }
      }
        return foundItems;
      }).catch(function (error) {
        console.log(error);
      });
    }
}

})();
