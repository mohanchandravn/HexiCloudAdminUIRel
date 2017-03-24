"use strict";
define(['knockout',
    'config/serviceConfig',
    'ojs/ojcore',
    'jquery',], function (ko, service, oj, $) {
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
        self.recordDetailTableArray = ko.observableArray([]);
        self.allResolvedStatusList = ko.observableArray([
            {value: 'Y', label: 'Yes'},
            {value: 'N', label: 'No'}
        ]);
        self.selectedRecordResolvedStatus = ko.observable('');
        self.isSelectedRecordResolved = ko.observable(false);
        self.selectedRecordSubject = ko.observable('');
        self.selectedRecordDescription = ko.observable('');
        
         self.clearRecord = function() {
                    self.selectedRecordSrId('');
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
                service.findUserEmails(payload).then(searchSuccessFn, FailCallBackFn);
                return;
            }
            if (self.resolvedStatus().length > 0 && self.resolvedStatus()[0] !== 'any') {
                payload = 'isResolved=' + self.resolvedStatus();
                if (self.requestId() !== '') {
                    payload += '&requestId=' + self.requestId();
                }
                console.log(payload);
                service.findUserEmails(payload).then(searchSuccessFn, FailCallBackFn);
                return;
            }
            if (self.requestId() !== '') {
                payload = 'requestId=' + self.requestId();
            }
            if (payload !== undefined) {
                console.log(payload);
                service.findUserEmails(payload).then(searchSuccessFn, FailCallBackFn);
            } else {
                service.findUserEmails(null).then(searchSuccessFn, FailCallBackFn);
            }
        };
         self.FailCallBackFn = function (xhr) {
                    console.log(xhr);
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
                        self.recordDetailTableArray([]);
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
                        self.recordDetailTableArray(array);
                        self.recordsDatasource(new oj.ArrayTableDataSource(self.recordDetailTableArray));
                    } else {
                        console.log('Content not available for the selected step');
                        self.recordDetailTableArray([]);
                        self.recordsDatasource(new oj.ArrayTableDataSource(self.recordDetailTableArray));
                    }
                };
                self.getRecord = function(data, event) {
                    console.log(data);
                    self.selectedRecordSrId(data.srId);
                    var status = data.isResolved ? 'Y' : 'N';
                    self.selectedRecordResolvedStatus(status);
                    self.isSelectedRecordResolved(data.isResolved);
                    self.selectedRecordSubject(data.subject);
                    self.selectedRecordDescription(data.resolutionComments);
                };
    };
    return manageEmailViewModel;

});

