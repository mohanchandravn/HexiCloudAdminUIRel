/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout',
    'config/serviceConfig',
    'ojs/ojcore',
    'jquery',
    'ojs/ojknockout',
    'ojs/ojknockout-validation',
    'ojs/ojradioset',
    'ojs/ojbutton',
    'ojs/ojselectcombobox',
    'ojs/ojtabs',
    'ojs/ojtable',
    'ojs/ojarraytabledatasource'],
    function(ko, service, oj) {
    
    function csmadminViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        // this is the invalidComponentTracker on ojRadioset
        self.tracker = ko.observable();
        
        //step codes to detect user in which step he's in
        self.stepsArray = ko.observableArray([]);
        self.selectedStepCode = ko.observable('');
        
        self.allStepsList = ko.computed( function() {
            var array = [];
            for (var idx = 0; idx < self.stepsArray().length; idx++) {
                array.push({value: self.stepsArray()[idx].stepId, label: self.stepsArray()[idx].stepLabel});
            }
            return array.sort(function(a, b) {
                if(a.label < b.label) return -1;
                if(a.label > b.label) return 1;
                return 0;
            });
        });
        
        self.deptObservableArray = ko.observableArray([]);
        self.datasource = ko.observable();
        
        self.selectedRole = ko.observable('itAdmin');
        self.selectedStepCodeMetaDataList = ko.observableArray([]);
        
        var getApplicationStepsSuccessCbFn = function(data) {
            console.log(data);
            initializeStepsArray(data);
        };
        
        var findStepDocsByStepIdSuccessCbFn = function(data, status) {
            if (status !== 'nocontent') {
                console.log(data);
                self.deptObservableArray([]);
                var array = [];
                for (var idx = 0; idx < data.length; idx++) {
                    array.push({stepId: data[idx].stepId, docType: data[idx].docType, docTypeExtn: data[idx].docTypeExtn, docFieldId: data[idx].docFieldId});
                }
                self.deptObservableArray(array);
                self.datasource(new oj.ArrayTableDataSource(self.deptObservableArray));
            } else {
                console.log('Content not available for the selected step');
                self.deptObservableArray([]);
                self.datasource(new oj.ArrayTableDataSource(self.deptObservableArray));
            }
        };
        
        var failCbFn = function(xhr) {
            console.log(xhr);
        };
        
        service.getApplicationSteps().then(getApplicationStepsSuccessCbFn, failCbFn);
        
        function initializeStepsArray(stepsData) {
            var temp = [];
            for (var step in stepsData) {
                temp.push({'stepId': stepsData[step].stepId, 'stepCode': stepsData[step].stepCode, 'stepLabel': stepsData[step].stepLabel});
            }
            self.stepsArray(temp);
        };
        
        function populateUI(metadata, stepId, stepCode) {
            var selectedStepMetaData = [];
            metadata = metadata.stepData;
            for (var key in metadata) {
                if (metadata[key].stepId === stepId) {
                    selectedStepMetaData.push(metadata[key]);
                }
            }
            
            self.selectedStepCodeMetaDataList(selectedStepMetaData);
        };
        
        self.updateStepCode = function (event, data) {
            if (data.value[0] !== undefined && data.option === "value") {
                self.displayContentByStepId(data.value[0]);
            } else {
                self.selectedStepCodeMetaDataList([]);
            }
        };
        
        self.updateRole = function (event, data) {
            if (typeof data.value === "string") {
                // code logic have to write
            }
        };
        
        self.displayContentByStepId = function(stepId) {
            service.findStepDocsByStepId(stepId).then(findStepDocsByStepIdSuccessCbFn, failCbFn);
        };
        
        self.downloadContent = function(stepId) {
            var fetchedLinkId = "";
            
            var linkIdSuccessFn = function(data, fileId, docType) {
                console.log('linkId success');
                console.log(data + fileId + docType);
                fetchedLinkId = data;
                if (docType === 'Video') {
                    self.videoSrc(service.serverURI() + fetchedLinkId + "/file/" + fileId);
                    self.isVideoFetched(true);
                } else if (docType === 'File') {
                    self.pdfSrc(service.serverURI() + fetchedLinkId + "/file/" + fileId);
                    self.isPdfFetched(true);
                }
            };

            var linkIdFailFn = function(xhr) {
                console.log('linkId failed');
                console.log(xhr);
            };

            var fileDetailsSuccessFn = function(data, status) {
                console.log('fileId success');
                console.log(data);
                console.log(status);
                if (status !== "nocontent") {
                    for(var idx = 0; idx < data.length; idx++) {
                        if (data[idx].docType === 'Link') {
                           self.urlForAddingUsersAndAssigningRoles(data[idx].docFieldId);
                       } else if (data[idx].docType === 'Video') {
                            service.getLinkId(data[idx].docFieldId, data[idx].docType).then(linkIdSuccessFn, linkIdFailFn);
                        } else if (data[idx].docType === 'File' & data[idx].docTypeExtn === 'pdf') {
                            service.getLinkId(data[idx].docFieldId, data[idx].docType).then(linkIdSuccessFn, linkIdFailFn);
                        }
                    }
                }
            };

            var fileDetailsFailFn = function(xhr) {
                console.log('fileId failed');
                console.log(xhr);
            };
            
            service.getFileDetails(stepId).then(fileDetailsSuccessFn, fileDetailsFailFn);
        };
        
        self.viewDocument= function(data, event) {
            console.log("----------------------------------------");
            console.log("we can view the document by this id");
            console.log(data);
            console.log("----------------------------------------");
        };
        
        self.deleteContentByStepId= function(data, event) {
            console.log("----------------------------------------");
            console.log("we can delete the metadata by this id: " + data.id);
            console.log("metadata details are: " + ko.toJSON(data));
            console.log("----------------------------------------");
        };
    };
    
    return csmadminViewModel;
});
