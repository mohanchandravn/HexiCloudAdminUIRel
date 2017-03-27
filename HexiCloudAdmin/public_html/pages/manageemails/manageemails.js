"use strict";
define(['knockout',
    'config/serviceConfig',
    'ojs/ojcore',
    'jquery',
    'ojs/ojpagingcontrol',
    'ojs/ojarraytabledatasource',
    'ojs/ojpagingtabledatasource',
    'ojs/ojcollectiontabledatasource'
], function (ko, service, oj) {
    function manageEmailViewModel ()
    {
        var self = this;
        self.userId = ko.observable('');
        self.allStatusList = ko.observableArray([
            {value: 'Y', label: 'Yes'},
            {value: 'N', label: 'No'},
            {value: 'any', label: 'Any'}
        ]);
        self.resolvedStatus = ko.observable('');
        self.requestId = ko.observable('');
        self.recordsDatasource = ko.observable();
        self.selectedRecordDescription = ko.observable('');
        self.isSelectedRecordResolved = ko.observable(false);
        self.selectedRecordSrId = ko.observable('');
        self.allResolvedStatusList = ko.observableArray([
            {value: 'Y', label: 'Yes'},
            {value: 'N', label: 'No'}
        ]);
        self.selectedRecordResolvedStatus = ko.observable('');
        self.isSelectedRecordResolved = ko.observable(false);
        self.selectedRecordMessage = ko.observable('');
        self.selectedRecordDescription = ko.observable('');
        
        self.clearRecord = function() {
            self.selectedRecordSrId('');
            self.selectedRecordMessage('');
            self.selectedRecordResolvedStatus([]);
            self.isSelectedRecordResolved(true);
            self.selectedRecordDescription('');
        };

        self.initSearch = function (data, event) {
            self.clearRecord();
            var payload;
            if (self.userId() !== '') {
                payload = 'userId=' + self.userId();
                if (self.resolvedStatus().length > 0 && self.resolvedStatus()[0] !== 'any') {
                    payload += '&isResolved=' + self.resolvedStatus();
                }
                if (self.requestId() !== '') {
                    payload += '&requestId=' + self.requestId();
                }
                console.log(payload);
                showPreloader();
                service.findUserEmails(payload).then(searchSuccessFn, FailCallBackFn);
                return;
            }
            if (self.resolvedStatus().length > 0 && self.resolvedStatus()[0] !== 'any') {
                payload = 'isResolved=' + self.resolvedStatus();
                if (self.requestId() !== '') {
                    payload += '&requestId=' + self.requestId();
                }
                console.log(payload);
                showPreloader();
                service.findUserEmails(payload).then(searchSuccessFn, FailCallBackFn);
                return;
            }
            if (self.requestId() !== '') {
                payload = 'requestId=' + self.requestId();
            }
            if (payload !== undefined) {
                console.log(payload);
                showPreloader();
                service.findUserEmails(payload).then(searchSuccessFn, FailCallBackFn);
            } else {
                showPreloader();
                service.findUserEmails(null).then(searchSuccessFn, FailCallBackFn);
            }
        };
        
        self.FailCallBackFn = function (xhr) {
            console.log(xhr);
            hidePreloader();
        };
        
        self.submitRecord = function (data, event) {
            console.log(self.selectedRecordResolvedStatus());
            if (self.selectedRecordResolvedStatus().length > 0) {
                var payload = {
                    "srId": self.selectedRecordSrId(),
                    "isResolved": true,
                    "resolutionComments": self.selectedRecordDescription()
                };
                console.log(payload);
                service.submitRecord(JSON.stringify(payload)).then(submitRecordSuccessFn, FailCallBackFn);
            } else {
                alert('Please select the Resolved option..');
            }
        };
        
        var submitRecordSuccessFn = function(data, status) {
            if (status === 'success') {
                console.log('Record updated');
                self.initSearch();
            }
        };
        
        var searchSuccessFn = function(data, status) {
            if (status !== 'nocontent') {
                console.log(data);
                var array = [];
                for (var idx = 0; idx < data.length; idx++) {
                    array.push({
                        srId: data[idx].srId,
                        userId: data[idx].userId,
                        subject: data[idx].subject,
                        message: data[idx].message,
                        sentTo: data[idx].sentTo,
                        sentCC: data[idx].sentCC,
                        sentBCC: data[idx].sentBCC,
                        isResolved: data[idx].isResolved,
                        csmEmailCount: data[idx].csmEmailCount,
                        resolutionComments: data[idx].resolutionComments,
                        createdDate: data[idx].createdDate});
                }
//                self.recordsDatasource(new oj.ArrayTableDataSource(self.recordDetailTableArray));
                self.recordsDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array)));
                hidePreloader();
            } else {
                console.log('Content not available for the selected step');
                self.recordsDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                hidePreloader();
            }
        };
        
        self.getRecord = function(data, event) {
            console.log(data);
            self.selectedRecordSrId(data.srId);
            var status = data.isResolved ? 'Y' : 'N';
            self.selectedRecordResolvedStatus(status);
            self.isSelectedRecordResolved(data.isResolved);
            self.selectedRecordMessage(data.message);
            self.selectedRecordDescription(data.resolutionComments);
        };
        
        self.handleBindingsApplied = function() {
            self.initSearch();  
        };
    };
    return manageEmailViewModel;

});

