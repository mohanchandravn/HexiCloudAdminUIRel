/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton'], 

function (oj, ko, $) {
/**
 * The view model for the main content view template
 */
function landingContentViewModel(params) {
        var self = this;
        //var router = params.ojRouter.parentRouter;
       
        self.clickedButton = ko.observable("(None clicked yet)");
        self.schButtonClick = function(data, event){
        //self.clickedButton(event.currentTarget.id);
        router.go('scheduler/');
    }
}
        self.docButtonClick = function(data, event){
        //self.clickedButton(event.currentTarget.id);
        router.go('csmadmin/');
    }

        return landingContentViewModel;
        });


