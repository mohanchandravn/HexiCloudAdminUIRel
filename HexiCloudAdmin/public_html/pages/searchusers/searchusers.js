"use strict";
define(['ojs/ojcore',
    'jquery',
    'knockout',
    'config/serviceConfig',
    'promise',
    'ojs/ojinputtext',
    'ojs/ojbutton',
    'ojs/ojknockout',
    'ojs/ojpagingcontrol',
    'ojs/ojarraytabledatasource',
    'ojs/ojpagingtabledatasource',
    'ojs/ojcollectiontabledatasource'
], function (oj, $, ko, service) {

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
        self.selectedRecord = null;

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
                {"name": "firstName", label: "First Name"},
                {"name": "lastName", label: "Last Name"},
                {"name": "customer", label: "Customer"}
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
        self.onCreateUserClick = function ()
        {
            if (self.parentViewModel)
            {
                self.parentViewModel.goToCreateUser();
            }
        };

        self.onUpdateUserClick = function ()
        {
            if (!self.selectedRecord)
            {

            }
            if (self.parentViewModel)
            {
                self.parentViewModel.goToUpdateUser(self.selectedRecord);
            }
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
                            'firstName': item.firstName,
                            'lastName': item.lastName,
                            'customer': item.registryId

                        });
                        self.searchUsersMap[item.userId] = {
                            'userId': item.userId,
                            'email': item.email,
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
                    self.selectedRecord = self.searchUsersMap[selectionObj.rowKey];
                }
            }
        };
    }


    return searchUsersViewModel;

});

