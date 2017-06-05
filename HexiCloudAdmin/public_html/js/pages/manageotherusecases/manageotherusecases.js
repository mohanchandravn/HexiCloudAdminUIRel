"use strict";
define(['knockout', 'config/serviceConfig', 'config/sessionInfo', 'ojs/ojcore', 'jquery', 'config/serviceConfig', 'ojs/ojknockout', 'ojs/ojmasonrylayout'
], function (ko, service, session) {
    function manageOtherUseCasesViewModel()
    {
        var self = this;
        self.areAllOtherUseCasesLoaded = ko.observable(false);
        self.allOtherUseCases = [];
        
        var getAllOtherUseCasesSuccessCbFn = function (data, status) {
            if (data.useCases) {
                var useCases = data.useCases;
                for (var idx = 0; idx < useCases.length; idx++) {
                    if (useCases[idx].title.length > 35) {
                        var trimTitle = useCases[idx].title.slice(0, 35);
                        useCases[idx].trimmedTitle = trimTitle + "...";
                    }
                }
            }
            self.allOtherUseCases = useCases;
            self.areAllOtherUseCasesLoaded(true);
            $("#otherUseCases").ojMasonryLayout("refresh");
            hidePreloader();
        };

        var getAllOtherUseCasesFailCbFn = function (xhr) {
            hidePreloader();
            console.log(xhr);
        };
        
        self.handleBindingsApplied = function () {
            if(session.getFromSession(session.accessToken)) {
                showPreloader();
                service.getAllOtherUseCases().then(getAllOtherUseCasesSuccessCbFn, getAllOtherUseCasesFailCbFn);
            }
        };
    };
    
    return manageOtherUseCasesViewModel;
});

