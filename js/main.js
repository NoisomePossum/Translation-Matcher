// Begin function for entering data
// TODO Normalize variable names and HTML elements: either all French or all English
var loki = require('../node_modules/lokijs.min.js', { env: 'NODEJS'}),
    fs = require('fs'),
    app = angular.module('translationMatcher', []);

app.controller('MatchController', ['$scope', '$sce', function ($scope, $sce) {
    var DB_FILE = 'oe_database.json';
    $scope.citations;
    $scope.newCitation = {};
    $scope.newCitation.verbs = [];
    $scope.latinCitations;
    $scope.newLatinCitation = {}; 
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
        $scope.citations.insert($scope.newCitation);
        for (i=0; i<$scope.latinExtracts.length; i++) {
            $scope.newLatinCitation.latinText = $scope.latinExtracts[i].latinText;
            $scope.newLatinCitation.oeuvre = $scope.latinExtracts[i].oeuvre;
            $scope.newLatinCitation.edition = $scope.latinExtracts[i].edition;
            $scope.newLatinCitation.ref = $scope.latinExtracts[i].ref;
            $scope.newLatinCitation.tradDe = $scope.citations.data[$scope.citations.data.length - 1].$loki;
            $scope.latinCitations.insert($scope.newLatinCitation);
            $scope.newLatinCitation = {};
        }
        $scope.newCitation = {};
        $scope.newCitation.verbs = [];
    };
    $scope.delete = function (i) {
        $scope.citations.remove(i);
    };
    $scope.editItem = function (item) {
        item.editing = true;
    };
    $scope.doneEditing = function (item, bool) {
        item.editing = false;
        var saveChanges = bool;
        if (saveChanges) {
            // var newEdit = $scope.citations.findOne({$loki:item.$loki});
            // $scope.citations.update(newEdit);
            $scope.citations.update(item);
        }
    };
    $scope.db = new loki(DB_FILE, { 
        env: 'NODEJS', 
        autoload: true,
        autoloadCallback: function() {
            $scope.citations = $scope.db.getCollection('citations');
            $scope.latinCitations = $scope.db.getCollection('latinCitations');

            // initialize empty database if one does not already exist
            if ($scope.citations === null) {
                $scope.citations = $scope.db.addCollection('citations');
                $scope.citations.insert({OEtext: 'Ne mæg eow nan þing wiðstandan eallum dagum þines lifes.', oeuvre: 'OEH-Joshua', edition: 'Marsden', ref:'1:5', verbs: [{verb: 'mæg', tense: 'futur', OEexpression: 'present form', commentaire: '', transtype: '', discourse: ''}], versionOf: null});
            }
            if ($scope.latinCitations === null) {
                $scope.latinCitations = $scope.db.addCollection('latinCitations');
                $scope.latinCitations.insert({latinText: 'Nullus poterit uobis resistere cunctis diebus uitæ tuæ', temps: 'futur indicatif actif, 3 sg (inf. posse)', oeuvre: 'Joshua', edition: 'Crawford', ref: '1:5', tradDe: '1'}, );
                $scope.latinCitations.insert({latinText: 'nullus vobis poterit resistere cunctis diebus vitae tuae', temps: 'futur indicatif actif, 3 sg (inf. posse)', oeuvre: 'Joshua', edition: 'Douay-Rheims', ref: '1:5', tradDe: '1'});
            }

            console.log($scope);
            $scope.$apply();
        },
        autosave : true,
        autosaveInterval : 5000
    }
    );
    // TODO Below solution for reseting db on clicking cancel doesn't work. Try to fix later.
    // $scope.originalData = angular.copy($scope.citations);
    // $scope.reset = function () {
    //     $scope.db = angular.copy($scope.originalData);
    // };
    $scope.verbCounter = 0;
    $scope.verbElements = [{id:$scope.verbCounter}];
    $scope.newVerbItem = function($event){
        $scope.verbCounter++;
        $scope.verbElements.push({id:$scope.verbCounter});
        $event.preventDefault();
    }
    $scope.latinCounter = 0;
    $scope.latinExtracts = [{id:$scope.latinCounter}];
    $scope.newLatinItem = function($event){
        $scope.latinCounter++;
        $scope.latinExtracts.push({id:$scope.latinCounter});
        $event.preventDefault();
    }
    $scope.highlightVerb = function(object, text) {
        var displayText = document.createElement('p');
        var newText = text;
        for (i=0; i<object.length; i++) {
            newText = newText.replace(object[i].verb, "<span style='background-color:yellow;color:black;'>" + object[i].verb + "</span>");
        }
        return $sce.trustAsHtml(newText);
    }
    // $scope.search = function () {
    //     var results = $scope.latinCitations.find($loki:);
    // }
}]);
// End controller function

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
