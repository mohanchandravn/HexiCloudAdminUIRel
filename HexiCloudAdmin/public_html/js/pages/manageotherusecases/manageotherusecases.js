"use strict";

define(['ojs/ojcore', 'knockout', 'jquery', 'config/serviceConfig', 'config/sessionInfo', 'config/serviceConfig', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojpagingcontrol', 'ojs/ojpagingtabledatasource', 'ojs/ojarraytabledatasource'
], function (oj, ko, $, service, session) {
    
    function manageOtherUseCasesViewModel() {
        
        var self = this;
        
        self.areAllOtherUseCasesLoaded = ko.observable(false);
        
        var getAllOtherUseCasesSuccessCbFn = function (data, status) {
            if (data.otherUseCases) {
                self.pagingDatasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(data.otherUseCases, {idAttribute: 'userId'}));
                self.areAllOtherUseCasesLoaded(true);                
            }
            hidePreloader();
        };

        var getAllOtherUseCasesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
        };
        
        self.handleAttached = function () {
            if (session.getFromSession(session.accessToken)) {
                showPreloader();
                service.getAllOtherUseCases().then(getAllOtherUseCasesSuccessCbFn, getAllOtherUseCasesFailCbFn);
            }
        };
    };
    
    return manageOtherUseCasesViewModel;
});

