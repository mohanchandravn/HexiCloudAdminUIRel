/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout', 'jquery', 'ojs/ojrouter'
], function (ko, $) {
    /**
     * The view model for the managing service calls
     */
    function serviceConfig() {
        var self = this;
        self.router = router;
        
        self.testFunc = function(payload) {
            var defer = $.Deferred();
            console.log(payload);
            console.log(JSON.stringify(payload));
            var serverURL = "https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/api/1.1/files/data";
            $.ajax({
                type: 'POST',
                data: payload,
                crossDomain: true,
                mimeType: "multipart/form-data",
                contentType:  "multipart/form-data",
                cache: false,
                processData: false,
                xhrFields: {
                withCredentials: true
                },
//                dataType: 'json',
                beforeSend: function (xhr){
                xhr.setRequestHeader('Authorization', 'Basic Y2xvdWQuYWRtaW46d09SdGh5QDVQaXBl');
                },

                success: function (data, status) {
                    console.log('Successfully retrieved details at: ' + serverURL);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        self.getApplicationSteps = function() {
            var defer = $.Deferred();
            var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/getApplicationSteps";
//            var serverURL = "jsonData/stepsData.json";
            $.ajax({
                type: "GET",
                url: serverURL,
                success: function (data) {
                    console.log('Successfully retrieved details at: ' + serverURL);
                    defer.resolve(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        self.findStepDocsByStepId = function(stepId) {
            var defer = $.Deferred();
            var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/findStepDocsByStepId/" + stepId;
//            var serverURL = "jsonData/stepsData.json";
            $.ajax({
                type: "GET",
                url: serverURL,
                success: function (data, status) {
                    console.log('Successfully retrieved details at: ' + serverURL);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        self.getFileDetails = function(stepId) {
            var defer = $.Deferred();
            var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/findStepDocsByStepId/" + stepId;
            $.ajax({
                type: "GET",
                url: serverURL,
                success: function (data, status) {
                    console.log('Successfully retrieved details at: ' + serverURL);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        self.getLinkId = function(fileId, docType) {
            var defer = $.Deferred();
            var serverURL = "https://documents-gse00002841.documents.us2.oraclecloud.com/documents/api/1.1/publiclinks/file/" + fileId;
            $.ajax({
                type: "GET",
                url: serverURL,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Basic YmFsYS5ndXB0YTpvTHltcGljQDVDbGlw');
                },
                success: function (data) {
                    console.log('Successfully retrieved details at: ' + serverURL);
                    if (data.id === fileId) {
                        defer.resolve(data.items[0].linkID, fileId, docType);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at:" + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
    };
   
   return new serviceConfig();
});
