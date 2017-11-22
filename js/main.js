var loki = require('../node_modules/lokijs.min.js', { env: 'NODEJS'}),
    fs = require('fs'),
    app = angular.module('lokidemo', []);
app.controller('DemoController', ['$scope', function ($scope) {
    var DB_FILE = 'oe_database.json';
    $scope.newContact = {};
    $scope.contacts;
    $scope.db;
    $scope.quit = function () {
        $scope.db.close();
        window.close();
    };
    // call on window close?  since fs adapter is synchronous this should work
    $scope.$on("$destroy", function() {
        $scope.db.close();
        window.onbeforeunload = undefined;
    });
    // scope on destroy does not seem to work well with node webkit so this is workaround from :
    // http://captainkuro.com/javascript/accessing-file-system-with-node-webkit/
    var gui = require('nw.gui'); 
    gui.Window.get().on('close', function() { 
        $scope.db.close();
        this.close(true); // don't forget this line, else you can't close window
    }); 
    $scope.insert = function () {
        $scope.contacts.insert($scope.newContact);
        $scope.newContact = {};
    };
    $scope.delete = function (i) {
        $scope.contacts.remove(i);
    };
    $scope.contacts;
    $scope.db = new loki(DB_FILE, { 
        env: 'NODEJS', 
        autoload: true,
        autoloadCallback: function() {
            $scope.contacts = $scope.db.getCollection('contacts');

            // if the database did not exist we will initialize empty database here
            if ($scope.contacts === null) {
                $scope.contacts = $scope.db.addCollection('contacts');
                $scope.contacts.insert({name: 'joe', age: 39, firstLanguage: 'italian'});
                $scope.contacts.insert({name: 'dave', age: 30, firstLanguage: 'english'});
                $scope.contacts.insert({name: 'tim', age: 30, firstLanguage: 'english'});
                $scope.contacts.insert({name: 'jonas', age: 30, firstLanguage: 'swedish'});
                $scope.contacts.insert({name: 'pedro', age: 30, firstLanguage: 'spanish'});
            }

            console.log($scope);
            $scope.$apply();
        },
        autosave : true,
        autosaveInterval : 5000
    }
    );
}]);

// Begin tab functionality
document.getElementById("defaultOpen").click();
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
} 
