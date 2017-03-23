"use strict";
define(['ojs/ojcore',
    'jquery',
    'knockout',
    'ojs/ojmodule'], function (oj, $, ko) {

    function manageUsersViewModel(params)
    {
        var self = this;
        self.managerUserCurrentValue = ko.observable();
        self.managerUserCurrentValue({
            name: 'pages/searchusers/searchusers',
            params: {
                parent: self
            }
        });

        self.goToCreateUser = function ()
        {
            self.managerUserCurrentValue({
                name: 'pages/createuser/createuser',
                params: {
                    parent: self
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

        self.backToSearchUser = function ()
        {
            self.managerUserCurrentValue({
                name: 'pages/searchusers/searchusers',
                params: {
                    parent: self
                }
            });
        };
    }
    return manageUsersViewModel;

});

