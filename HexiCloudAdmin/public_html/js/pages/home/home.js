/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/serviceConfig', 'config/sessionInfo',
    'ojs/ojinputtext', 'ojs/ojknockout','ojs/ojknockout-validation'

], function (oj, $, ko, serviceConfig, sessionInfo) {
    /**
     * The view model for the main content view template
     */
    function homeContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        self.userName = ko.observable();
        self.password = ko.observable();
         self.tracker = ko.observable();
         self.loginFailureText = ko.observable();

        console.log('home page');

        self.isLoggedinTrue = function () {
             router.go('csmadmin/');
            //router.go('landing/');
        };
        
        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid())
                return false;

            return true;
        };

        self.login = function ()
        {
            var trackerObj = ko.utils.unwrapObservable(self.tracker);

            // Step 1
            if (!this._showComponentValidationErrors(trackerObj)) {
                return;
            }
            
            var payLoad = {
                "username": self.userName(),
                "password": self.password()
            };

            var successCallBackFn = function (data, xhrStatus) {
                console.log("what's the status:" + xhrStatus);
                if (xhrStatus.status === 200)
                {
                    self.loginFailureText("");
                    sessionInfo.setToSession(sessionInfo.accessToken, data.access_token);
                    sessionInfo.setToSession(sessionInfo.expiresIn, data.expires_in);
                    sessionInfo.setToSession(sessionInfo.isLoggedInUser, true);
                    sessionInfo.setToSession(sessionInfo.loggedInUser, data.userId);
                    sessionInfo.setToSession(sessionInfo.portalRole, data.portalRole);
                   self.isLoggedinTrue();
                }

            };
            var failCallBackFn = function (xhr) {
                console.log("what's the status:" + xhr.status);
                self.loginFailureText("Invalid Username or Password");
            };

            serviceConfig.authenticate(payLoad).then(successCallBackFn, failCallBackFn);
        };
    }

    return homeContentViewModel;
});
