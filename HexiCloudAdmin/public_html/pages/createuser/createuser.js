/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery',
    'knockout',
    'config/serviceConfig',
    'js/util/commonhelper',
    'ojs/ojcore',
    'service/CommonService',
    'ojs/ojknockout',
    'ojs/ojknockout-validation',
    'ojs/ojinputtext',
    'ojs/ojselectcombobox',
    'ojs/ojbutton',
    'ojs/ojdialog'],
        function ($, ko, service, commonHelper) {

            function createuserViewModel(params) {

                var self = this;

                self.tracker = ko.observable();
                self.isCreateMode = ko.observable(true);

                self.pageTitle = ko.observable('Create User');

                // Create user form fields
                self.userName = ko.observable('');
                self.password = ko.observable('');
                self.passwordRepeat = ko.observable('');
                self.userRole = ko.observableArray([]);
                self.firstName = ko.observable('');
                self.lastName = ko.observable('');
                self.email = ko.observable('');
                self.countryCode = ko.observable('');
                self.phone = ko.observable('');
                self.customerList = ko.observableArray([]);
                self.customerId = ko.observable();

                if (params)
                {
                    self.parentViewModel = params.parent;
                    self.commonService = params.commonService;
                    self.action = params.action;
                    self.selectedRecord = params.selectedRecord;
                    if (self.action === 'update')
                    {
                        self.pageTitle('Update User');

                        self.isCreateMode(false);
                        if (self.selectedRecord)
                        {

                            self.userName(self.selectedRecord.userId);
                            $("#userName").ojInputText({"disabled": true});
                            self.firstName(self.selectedRecord.firstName);
                            self.lastName(self.selectedRecord.lastName);
                            self.email(self.selectedRecord.email);
                            var fullPhoneNum = self.selectedRecord.phone;
                            if (fullPhoneNum) {
                                self.countryCode(fullPhoneNum.substr(0, fullPhoneNum.indexOf('-')));
                                self.phone(fullPhoneNum.substr(fullPhoneNum.indexOf('-') + 1));
                            }

                            //self.userRole("DBA");
                            // var roleComp = $("#role");
//                            $("#role").ojSelect({
//                              "value": ["DBA"]
//                            });

//                            self.userRole([{
//                                    value: self.selectedRecord.userRole,
//                                    label: self.selectedRecord.userRole
//                            }]);
                        }
                    }

                }

                self.userRoles = ko.observableArray([
                    {value: 'IT Manager', label: 'IT Manager'},
                    {value: 'DBA', label: 'DBA'},
                    {value: 'IT Operations', label: 'IT Operations'},
                    {value: 'Developer', label: 'Developer'},
                    {value: 'Business User', label: 'Business User'}
                ]);


                self.emailPattern = commonHelper.emailRegExpPattern;
                self.phonePattern = commonHelper.phoneRegExpPattern;

                self.createUserStatus = ko.observable('');

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

                var openModalDialogCreateUserStatus = function (message) {
                    $("#modalDialogCreateUserStatus").ojDialog("open");
                    self.createUserStatus(message);
                    self.handleOKClose = $("#okButton").click(function () {
                        $("#modalDialogCreateUserStatus").ojDialog("close");
                    });
                };

                var checkIsUserIdAvailable = function () {
                    var isUserIdAvailableSuccessCbFn = function (data, status) {
                        if (data === true) {
                            createUser();
                        } else {
                            hidePreloader();
                            openModalDialogCreateUserStatus('Failed to create user. User name already exists.');
                        }
                    };

                    var isUserIdAvailableFailCbFn = function (xhr) {
                        hidePreloader();
                        openModalDialogCreateUserStatus('Failed to create user.');
                    };

                    service.isUserIdAvailable(self.userName()).then(isUserIdAvailableSuccessCbFn, isUserIdAvailableFailCbFn);
                };

                var updateUser = function () {
                    var updateUserSuccessCbFn = function (data, status) {
                        hidePreloader();
                        openModalDialogCreateUserStatus('User data updated successfully.');
                    };

                    var updateUserFailCbFn = function (xhr) {
                        hidePreloader();
                        openModalDialogCreateUserStatus('Failed to create user.');
                    };

                    var payload = {
                        "userId": self.userName(),
                        "email": self.email(),
                        "phone": self.countryCode() + '-' + self.phone(),
                        "userRole": self.userRole()[0],
                        "firstName": self.firstName(),
                        "lastName": self.lastName(),
                        "registryId": self.customerId()[0]
                    };

                    service.updateUser(JSON.stringify(payload)).then(updateUserSuccessCbFn, updateUserFailCbFn);
                };

                var createUser = function () {
                    var createUserSuccessCbFn = function (data, status) {
                        hidePreloader();
                        resetCreateUserForm();
                        openModalDialogCreateUserStatus('User created successfully.');
                    };

                    var createUserFailCbFn = function (xhr) {
                        hidePreloader();
                        openModalDialogCreateUserStatus('Failed to create user.');
                    };

                    var payload = {
                        "userId": self.userName(),
                        "password": self.password(),
                        "email": self.email(),
                        "phone": (self.countryCode() && self.phone()) ? self.countryCode() + '-' + self.phone() : "",
                        "userRole": self.userRole()[0],
                        "firstName": self.firstName(),
                        "lastName": self.lastName(),
                        "registryId": self.customerId()[0]
                    };

                    service.createUser(JSON.stringify(payload)).then(createUserSuccessCbFn, createUserFailCbFn);
                };

                self.onCreateUserButtonClick = function (event, data) {
                    // Validations
                    var trackerObj = ko.utils.unwrapObservable(self.tracker);
                    if (!this._showComponentValidationErrors(trackerObj)) {
                        return;
                    }

                    showPreloader();
                    if (self.action)
                    {
                        if (self.action === 'update')
                        {
                            updateUser();
                        }
                    } else
                    {
                        checkIsUserIdAvailable();
                    }
                };

                self.onResetButtonClick = function (event, data) {
                    resetCreateUserForm();
                };

                var resetCreateUserForm = function () {
                    self.userName('');
                    self.password('');
                    self.passwordRepeat('');
                    self.userRole([]);
                    self.firstName('');
                    self.lastName('');
                    self.countryCode('');
                    self.phone('');
                    self.email('');
                    self.customerId([]);
//                    $("#customer").ojSelect("option", "value", [""]);
//                var copy = self.customerList();
//                self.customerList([]);
//                self.customerList(copy);
                };


                self.getCustomers = function () {
                    if (self.commonService)
                    {
                        self.commonService.getCustomerList().then(function (data) {
                            if (data)
                            {
                                data.forEach(function (item) {
                                    self.customerList().push({
                                        label: item.label,
                                        value: item.value
                                    });
                                });

                                if (self.selectedRecord) {
                                    $("#customer").ojSelect("option", "value", [self.selectedRecord.customer]);
                                    self.customerId([self.selectedRecord.customer]);
                                }

                            }

                        }, function (reason) {
                            console.log("getCustomerList failed:" + reason);
                        });
                    }


                };

                self.onBackButtonClick = function ()
                {
                    if (self.parentViewModel)
                    {
                        self.parentViewModel.backToSearchUser();
                    }
                };

                self.afterRender = function ()
                {
                    if (self.action)
                    {
                        if (self.action === 'update')
                        {
                            $("#userName").ojInputText({"disabled": true});
                            if (self.selectedRecord)
                            {
                                $("#role").ojSelect("option", "value", [self.selectedRecord.userRole]);
                                self.userRole([self.selectedRecord.userRole]);
                            }
                        }
                    }
                };


            }
            ;

            return createuserViewModel;
        });
