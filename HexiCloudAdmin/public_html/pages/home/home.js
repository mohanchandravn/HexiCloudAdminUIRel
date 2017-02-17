/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * home module
 */
define(['jquery', 'config/serviceConfig', 'form-data'
], function ($, service, form-data) {
    /**
     * The view model for the main content view template
     */
    function homeContentViewModel(params) {
        var self = this;
        var router = params.ojRouter.parentRouter;
        
        console.log('home page');
        
        self.isLoggedinTrue = function() {
            router.go('csmadmin/');
        };
        
        var successCbFn = function(data, status) {
            console.log(status);
            console.log(data);
        };
        
        var failCbFn = function(xhr) {
            console.log(xhr);
        };
        
        self.handleAttached = function() {
            $("#multiform").submit(function(e) {
                var formData = $("#fileuploadfield");
                var file = formData[0].files[0];
                console.log(file);
                
                var form = new FormData();
                form.append('my_field', 'my value');
                form.append('my_buffer', new Buffer(10));
                form.append('my_file', fs.createReadStream('/foo/bar.jpg'));
                
                console.log("File name: " + file.fileName);
                console.log("File size: " + file.fileSize);
                console.log(e);
                e.preventDefault();
                var payload = {
                    jsonInputParameters: "{'parentID':'FAC27B99B3DBA6A190E7A98BDB81338485D611EEEC77'}", primartFile: file 
                };
                service.testFunc(payload).then(successCbFn, failCbFn);
            });
        };
    }
    
    return homeContentViewModel;
});
