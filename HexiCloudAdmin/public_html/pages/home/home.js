/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['config/serviceConfig'
], function (service) {
    /**
     * The view model for the main content view template
     */
    function homeContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('home page');
        
        self.isLoggedinTrue = function() {
            router.go('csmadmin/');
        };
    }
    
    return homeContentViewModel;
});
