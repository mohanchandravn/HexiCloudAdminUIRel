"use strict";
define(['ojs/ojcore',
    'jquery',
    'knockout',
    'service/CommonService',
    'ojs/ojmodule'], function (oj, $, ko, commonService) {

    function manageUsersViewModel(params)
    {
        var self = this;
        self.managerUserCurrentValue = ko.observable();

        self.goToCreateUser = function ()
        {
            self.managerUserCurrentValue({
                name: 'pages/createuser/createuser',
                lifecycleListener: {
                    bindingsApplied: function (info)
                    {
                        info.viewModel.getCustomers();
                    }
                },
                params: {
                    parent: self,
                    commonService: commonService
                }
            });
        };
        self.goToUpdateUser = function (selectedRecord)
        {
            self.managerUserCurrentValue({
                name: 'pages/createuser/createuser',
                params: {
                    parent: self,
                    action: 'update',
                    selectedRecord: selectedRecord
                },
                lifecycleListener: {
                    transitionCompleted: function (info) {
                        info.viewModel.afterRender();
                    }
                }
            });
        };
        var goToSearchUsers = function (){
            self.managerUserCurrentValue({
                name: 'pages/searchusers/searchusers',
                lifecycleListener: {
                    bindingsApplied: function (info)
                    {
                        info.viewModel.getCustomers();
                    }
                },
                params: {
                    parent: self,
                    commonService: commonService
                }
            });
        };

        self.backToSearchUser = function ()
        {
            goToSearchUsers();
        };
        
        goToSearchUsers();
    }
    return manageUsersViewModel;

});

