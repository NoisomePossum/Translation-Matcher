// Begin function for entering data
var loki = require('../node_modules/lokijs.min.js', { env: 'NODEJS'}),
    fs = require('fs'),
    app = angular.module('translationMatcher', []);

app.controller('MatchController', ['$scope', function ($scope) {
    var DB_FILE = 'oe_database.json';
    $scope.newCitation = {};
    $scope.newVerb = {};
    $scope.citations;
    $scope.verbs = [];
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
        // $scope.newCitation.verbs = [{ verb: 'newverb', tense: 'present' }];
        $scope.newCitation.verbs = [$scope.newVerb];
        $scope.citations.insert($scope.newCitation);
        // $scope.newVerb.extSource = $scope.newCitation.$loki;
        // $scope.verbs.insert($scope.newVerb);
        $scope.newCitation = {};
        $scope.newVerb = {};
    };
    $scope.delete = function (i) {
        $scope.citations.remove(i);
    };
    $scope.citations;
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
                // $scope.verbs = $scope.db.addCollection('verbs');
                // $scope.verbs.insert({verb: 'mæg', tense: 'futur', OEexpression: 'present form', commentaire: '', transtype: '', discourse: '', extSource: '1'});
            }

            console.log($scope);
            $scope.$apply();
        },
        autosave : true,
        autosaveInterval : 5000
    }
    );
}]);
// End function for entering data


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
