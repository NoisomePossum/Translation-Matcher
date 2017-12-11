// Begin function for entering data
var loki = require('../node_modules/lokijs.min.js', { env: 'NODEJS'}),
    fs = require('fs'),
    app = angular.module('translationMatcher', []);

app.controller('MatchController', ['$scope', '$sce', function ($scope, $sce) {
    var DB_FILE = 'oe_database.json';
    $scope.newCitation = {};
    $scope.newVerb = {};
    $scope.citations;
    $scope.newCitation.verbs = [];
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

    // Called when the Insert button is pressed on the HTML page
    $scope.insert = function () {
        for (i=0; i<$scope.verbElements.length; i++) {
            $scope.newCitation.verbs.push({
                verb: $scope.verbElements[i].verb, 
                OEexpression: $scope.verbElements[i].OEexpression,
                commentaire: $scope.verbElements[i].commentaire,
                transtype: $scope.verbElements[i].transtype,
                discourse: $scope.verbElements[i].discourse
            });
        }
        // $scope.newCitation.verbs.push($scope.newVerb);
        $scope.citations.insert($scope.newCitation);
        $scope.newCitation = {};
        $scope.newVerb = {};
        $scope.newCitation.verbs = [];
        // counter = 0;
    };
    $scope.delete = function (i) {
        $scope.citations.remove(i);
    };
    // TODO $scope.citations; also appears on line 10; can delete later?
    $scope.db = new loki(DB_FILE, { 
        env: 'NODEJS', 
        autoload: true,
        autoloadCallback: function() {
            $scope.citations = $scope.db.getCollection('citations');
            $scope.verbs = $scope.db.getCollection('verbs');

            // if the database did not exist we will initialize empty database here
            if ($scope.citations === null) {
                $scope.citations = $scope.db.addCollection('citations');
                $scope.citations.insert({OEtext: 'Ne mæg eow nan þing wiðstandan eallum dagum þines lifes.', oeuvre: 'OEH-Joshua', edition: 'Marsden', ref:'1:5', verbs: [{verb: 'mæg', tense: 'futur', OEexpression: 'present form', commentaire: '', transtype: '', discourse: ''}], versionOf: null});
            }

            console.log($scope);
            $scope.$apply();
        },
        autosave : true,
        autosaveInterval : 5000
    }
    );
    $scope.counter = 0;
    $scope.verbElements = [{id:$scope.counter}];
    $scope.newItem = function($event){
        $scope.counter++;
        $scope.verbElements.push({id:$scope.counter});
        $event.preventDefault();
    }
    $scope.highlightVerb = function(object, text) {
        var displayText = document.createElement('p');
        // displayText.innerHTML = text;
        var newText = text;
        for (i=0; i<object.length; i++) {
            // var highlightSpan = document.createElement('span');
            // highlightSpan.style.backgroundColor = "yellow";
            // highlightSpan.innerHTML = object[i].verb
            newText = newText.replace(object[i].verb, "<span style='background-color:yellow;color:black;'>" + object[i].verb + "</span>");
            // text = text.replace(/mæg/g, "dog");
            // text += " yippie!";
        }
        // text = object;
        // var newSpan = document.createElement("span");
        // newSpan.innerHTML = newText;
        return $sce.trustAsHtml(newText);
    }
}]);
// End function for entering data

// app.directive("parseText", function(object) {
//     return {
//         template : object
//     };
// });

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
};
// End tab functionality
