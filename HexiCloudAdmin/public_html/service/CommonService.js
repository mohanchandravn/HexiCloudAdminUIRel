"use strict";
define(['ojs/ojcore',
        'jquery',
        'knockout',
        'config/serviceConfig',
        'promise'], function (oj, $, ko, service){
        
        function CommonViewModel(params)
        {
            var self = this;
            self.customerList = ko.observableArray([]);
            
           self.getCustomerList = function ()
           {
               return new Promise(function (resolve, reject){
                   if(self.customerList().length === 0)
                   {
                        service.getCustomers().then(function (data,xhrStatus){
                         if (data)
                        {
                            data.forEach(function (item) {
                                self.customerList().push({
                                    label: item.customerRegistry,
                                    value: item.registryId
                                });
                            });
                            
                            resolve(self.customerList());

                        }
                    },function (reason){
                        reject(reason);
                    });
                   }else
                   {
                       resolve(self.customerList());
                   }
                      
                    
               });
              
           };
        }
        return new CommonViewModel();
    
});

