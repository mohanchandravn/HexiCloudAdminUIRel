/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['ojs/ojcore',
    'jquery',
    'knockout',    
    'config/serviceConfig',    
    'js/util/commonHelper',
    'ojs/ojknockout',
    'ojs/ojknockout-validation',
    'ojs/ojinputtext',
    'ojs/ojselectcombobox',
    'ojs/ojbutton'],

    function (oj, $, ko, service, commonHelper) {

        function createuserViewModel() {
            
            var self = this;
            
            self.tracker = ko.observable();
        
            // Create user form fields
            self.userName = ko.observable('');
            self.password = ko.observable('');
            self.passwordRepeat = ko.observable('');
            self.userRole = ko.observable('');
            self.firstName = ko.observable('');
            self.lastName = ko.observable('');
            self.email = ko.observable('');
            
            self.userRoles = ko.observableArray([
                {value: 'Identity Domain Administrator', label: 'Identity Domain Administrator'},
                {value: 'Services', label: 'Services'},
                {value: 'Entitlement Administrator', label: 'Entitlement Administrator'},
                {value: 'Bucket Entitlement Administrator', label: 'Bucket Entitlement Administrator'},
                {value: 'Service Instance Administrator', label: 'Service Instance Administrator'}
            ]);
            
            self.emailPattern = commonHelper.emailRegExpPattern;
                        
            self._showComponentValidationErrors = function (trackerObj) {
                trackerObj.showMessages();
                if (trackerObj.focusOnFirstInvalid()) {
                    return false;
                }
                return true;
            };
            
            self.shouldDisableCreate = function () {
                var trackerObj = ko.utils.unwrapObservable(self.tracker),
                hasInvalidComponents = trackerObj ? trackerObj["invalidShown"] : false;
                return hasInvalidComponents;
            };
            
            self.equalToPassword = {
                validate: function (value) {
                    var compareTo = self.password.peek();
                    if (!value && !compareTo) {
                        return true;
                    } else if (value !== compareTo) {
                        throw new Error('The passwords must match.');
                    }
                    return true;
                }
            };
            
            self.minLength = {
                validate: function (value) {
                    if (value.length < 8) {
                        throw new Error('Password length should not be less than 8.');
                    }
                    return true;
                }
            };
            
            self.onCreateUserClick = function (event, data) {
                // Validations
                var trackerObj = ko.utils.unwrapObservable(self.tracker);
                if (!this._showComponentValidationErrors(trackerObj)) {
                    return;
                }
                
                // Service call
                var payload = {
                    "userId" : self.userName(),
                    "password" : self.password(),
                    "email" : self.email(),
                    "userRole" : self.userRole()[0],
                    "firstName" : self.firstName(),
                    "lastName" : self.lastName()
                };
                console.log('payload: ' + JSON.stringify(payload));
            };
        };

        return createuserViewModel;
    });
