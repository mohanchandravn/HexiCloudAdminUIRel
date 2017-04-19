"use strict";
define(['ojs/ojcore',
    'jquery',
    'knockout',
    'config/serviceConfig',
    'util/commonhelper',
    'config/sessionInfo',
    'promise',
    'ojs/ojinputtext',
    'ojs/ojbutton',
    'ojs/ojknockout',
    'ojs/ojpagingcontrol',
    'ojs/ojarraytabledatasource',
    'ojs/ojpagingtabledatasource',
    'ojs/ojcollectiontabledatasource',
    'ojs/ojknockout-validation',
    'ojs/ojdialog'
], function (oj, $, ko, service, commonHelper, session) {

    function searchUsersViewModel(params)
    {
        var self = this;
        self.searchUserId = ko.observable();
        self.searchEmailId = ko.observable();
        self.searchCustomerId = ko.observable();
        self.customerListArr = ko.observableArray([]);
        self.columnMetaData = ko.observableArray([]);
        self.dataSource = null;
        self.pagingDatasource = ko.observable();
        self.pagingAuditDatasource = ko.observable();
        self.selectedRecord = null;
        
        self.tracker = ko.observable();

        self.newPassword = ko.observable('');
        self.newPasswordRepeat = ko.observable('');
        
        self.selectedUser = ko.observable('');
        self.selectedUserId = ko.observable('');
        self.selectedEmail = ko.observable('');
        self.isAdmin = ko.observable(session.getFromSession(session.portalRole) === 'admin' ? true : false);

        self.searchUsersMap = {};
        
        if (params)
        {
            self.parentViewModel = params.parent;
            self.commonService = params.commonService;
        }
        
        var buildColumnHeaderProperties = function ()
        {
            return [
                {"name": "userId", "label": "User ID"},
                {"name": "email", label: "Email"},
                {"name": "phone", label: "Phone"},
                {"name": "firstName", label: "First Name"},
                {"name": "lastName", label: "Last Name"},
                {"name": "customer", label: "Customer Registry ID"}
            ];
        };
        
        var columnProperties = buildColumnHeaderProperties() || [];
        if (columnProperties.length > 0)
        {
            columnProperties.forEach(function (columnProperty) {
                self.columnMetaData.push({
                    headerText: columnProperty.label//this has to be done for translation
                });
            });
        }
          
        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid()) {
                return false;
            }
            return true;
        };

        self.shouldDisableSubmit = function () {
            var trackerObj = ko.utils.unwrapObservable(self.tracker),
                    hasInvalidComponents = trackerObj ? trackerObj["invalidShown"] : false;
            return hasInvalidComponents;
        };
        
        self.minLength = {
            validate: function (value) {
                if (value.length < 8) {
                    throw new Error('Password length should not be less than 8.');
                }
                return true;
            }
        };
        
        self.equalToPassword = {
            validate: function (value) {
                var compareTo = self.newPassword.peek();
                if (!value && !compareTo) {
                    return true;
                } else if (value !== compareTo) {
                    throw new Error('The passwords must match.');
                }
                return true;
            }
        };
                
        self.onCreateUserClick = function ()
        {
            if (self.parentViewModel)
            {
                self.parentViewModel.goToCreateUser();
            }
        };

        self.onUpdateUserClick = function ()
        {
            if (self.parentViewModel)
            {
                self.parentViewModel.goToUpdateUser(self.selectedRecord);
            }
        };
        
        self.onUpdatePasswordClick = function ()
        {
            self.resetUpdatePasswordForm();
            
            if (self.parentViewModel)
            {
                $("#modalDialogUpdatePassword").ojDialog("open");
                
                self.handleSubmit = $("#submitButton").click(function () {
                                      
                    // Validations
                    var trackerObj = ko.utils.unwrapObservable(self.tracker);
                    if (!self._showComponentValidationErrors(trackerObj)) {
                        return;
                    }
                    
                    showPreloader();
                    $("#modalDialogUpdatePassword").ojDialog("close");
                    
                    var updatePasswordSuccessCbFn = function (data, status) {
                        hidePreloader();
                        // openModalDialogCreateUserStatus('User data updated successfully.');
                    };

                    var updatePasswordFailCbFn = function (xhr) {
                        hidePreloader();
                        // openModalDialogCreateUserStatus('Failed to create user.');
                    };

                    var payload = {
                        "userId" : self.selectedRecord.userId,
                        "password" : self.newPassword()
                    };

                    service.updatePassword(JSON.stringify(payload)).then(updatePasswordSuccessCbFn, updatePasswordFailCbFn);
                });
                
                self.handleCancel = $("#cancelButton").click(function () {
                    $("#modalDialogUpdatePassword").ojDialog("close");
                });
            }
        };
        
        self.onAuditClick = function() {
            if (self.selectedUser() !== '') {
                if (self.parentViewModel) {
                    showPreloader();
                    
                    var getUserNavAuditSuccessCbFn = function(data, status) {
                        if (status !== 'nocontent') {
                            self.pagingAuditDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data)));
                            $("#modalDialogUserAudit").ojDialog("open");
                        } else {
                            self.pagingAuditDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                            $("#modalDialogUserAudit").ojDialog("open");
                        }
                        hidePreloader();
                    };
                    
                    var getUserNavAuditFailCbFn = function(xhr) {
                        console.log(xhr);
                        hidePreloader();
                    };
                    
                    service.getUserNavAudit(self.selectedUser().userId).then(getUserNavAuditSuccessCbFn, getUserNavAuditFailCbFn);

                    self.handleCloseUserAudit = $("#closeUserAudit").click(function () {
                        $("#modalDialogUserAudit").ojDialog("close");
                    });
                }
            }
        };
        
        self.exportAllUsersDataToXLS = function() {
            var exportAuditSuccessCbFn = function(data, status) {
                console.log(status);
                console.log(data);
                commonHelper.JSONToXLSConverter(data, "All User's Audit Data");
            };
            
            var exportAuditFailCbFn = function(xhr) {
                console.log(xhr);
            };
            
            service.exportAudit().then(exportAuditSuccessCbFn, exportAuditFailCbFn);
        };
        
        self.resetUpdatePasswordForm = function() {
            self.newPassword('');
            self.newPasswordRepeat('');
        };

//        var DataCollectionModel = oj.Collection.extend({
//            parse: function (data, options)
//            {
//                alert('ist here');
//            },
//            sync: function (method, collection, options)
//            {
//                var payload = {
//                };
//                //read the data from service
//                service.searchUsers(payload).then(searchUsersSuccessFn, searchUserFailureFn);
//            }
//        });
//        self.modelCollection = ko.observable();
//        self.modelCollection(new DataCollectionModel());
//        self.dataSource = new oj.CollectionTableDataSource(self.modelCollection());
//        self.pagingDatasource = new oj.PagingTableDataSource(self.dataSource);

        self.getCustomers = function () {
            if (self.commonService)
            {
                self.commonService.getCustomerList().then(function (data) {
                    if (data)
                    {
                        data.forEach(function (item) {
                            self.customerListArr().push({
                                label: item.label,
                                value: item.value
                            });
                        });

                    }

                }, function (reason) {
                    console.log("getCustomerList failed:" + reason);
                });
            }


        };


        var getSearchResults = function () {
            showPreloader();
            var searchUsersSuccessFn = function (data, xhrStatus)
            {
                if (data)
                {
                    var userArr = [];
                    data.forEach(function (item) {

                        userArr.push({
                            'userId': item.userId,
                            'email': item.email,
                            'phone': item.phone,
                            'firstName': item.firstName,
                            'lastName': item.lastName,
                            'customer': item.registryId

                        });
                        self.searchUsersMap[item.userId] = {
                            'userId': item.userId,
                            'email': item.email,
                            'phone': item.phone,
                            'firstName': item.firstName,
                            'lastName': item.lastName,
                            'customer': item.registryId,
                            'userRole': item.userRole
                        };
                    });
                    self.pagingDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(userArr, {idAttribute: 'userId'})));
                    hidePreloader();
//self.pagingDatasource(new oj.ArrayTableDataSource(userArr,{idAttribute: 'userId'}));
                }
            };
            var searchUserFailureFn = function (xhr)
            {
                hidePreloader();
            };
            var payload;
            if (self.searchUserId() && self.searchUserId !== '')
            {
                payload = "userId=" + self.searchUserId();
                if (self.searchEmailId() && self.searchEmailId !== '')
                {
                    payload += "&emailId=" + self.searchEmailId();
                }
                if (self.searchCustomerId() && self.searchCustomerId !== '')
                {
                    payload += "&customerId=" + self.searchCustomerId();
                }
            } else if (self.searchEmailId() && self.searchEmailId !== '')
            {
                payload = "emailId=" + self.searchEmailId();
                if (self.searchCustomerId() && self.searchCustomerId !== '')
                {
                    payload += "&customerId=" + self.searchCustomerId();
                }
            } else if (self.searchCustomerId() && self.searchCustomerId !== '')
            {
                payload = "customerId=" + self.searchCustomerId();
            }

            service.searchUsers(payload).then(searchUsersSuccessFn, searchUserFailureFn);
        };

        getSearchResults();


        self.onClickSearch = function ()
        {
            getSearchResults();
        };






//        var read = function ()
//        {
//
//            var DataCollectionModel = oj.Collection.extend({
//                sync: function (method, collection, options)
//                {
//                    var payload = {
//                    };
//                    //read the data from service
//                    service.searchUsers(payload).then(searchUsersSuccessFn, searchUserFailureFn);
//                }
//            });
//
//            self.modelCollection = new DataCollectionModel();
//            return new Promise(function (resolve) {
//                resolve();
//            });
//        };

//        self.loadData = function ()
//        {
//            read().then(function () {
//                self.dataSource = new oj.CollectionTableDataSource(self.modelCollection);
//                self.pagingDatasource = new oj.PagingTableDataSource(self.dataSource);
//            });
//        };
//
//        self.loadData();
        self.userSelection = function (event, data)
        {
            if (data['option'] === 'currentRow')
            {
                var selectionObj = data['value'];
                if (selectionObj)
                {
                    $( "#updateUser" ).removeProp('disabled');
                    $( "#updatePassword" ).removeProp('disabled');
                    $( "#userAudit" ).removeProp('disabled');
                    $( "#updateUser" ).ojButton( "option", "disabled", false );
                    $( "#updatePassword" ).ojButton( "option", "disabled", false );
                    $( "#userAudit" ).ojButton( "option", "disabled", false );
                    
                    self.selectedRecord = self.searchUsersMap[selectionObj.rowKey];
                    self.selectedUser(self.selectedRecord);
                    self.selectedUserId(self.selectedRecord.userId);
                    self.selectedEmail(self.selectedRecord.email);
                }
            }
        };        
    }

    return searchUsersViewModel;

});

