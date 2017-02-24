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
        
        // for uploading a file to DOCS Cloud
        self.uploadFile = function(payload) {
            var defer = $.Deferred();
            var serverURL = "https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/api/1.1/files/data";
//            var serverURL = "https://140.86.1.93/hexiCloudUpload/services/rest/uploadStepDocument";
            $.ajax({
                type: "POST",
                url: serverURL,
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: payload,
                dataType: "json",
                beforeSend: function (xhr){
                    xhr.setRequestHeader("Authorization", "Basic Y2xvdWQuYWRtaW46d09SdGh5QDVQaXBl");
                    xhr.setRequestHeader("cache-control", "no-cache");
                },

                success: function (data, status) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        // for fetching all stepCodes
        self.getApplicationSteps = function() {
            var defer = $.Deferred();
            var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/getApplicationSteps";
//            var serverURL = "jsonData/stepsData.json";
            $.ajax({
                type: "GET",
                url: serverURL,
                success: function (data) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        // for fetching file details by stepId/stepCode
        self.getFileDetails = function(stepDetail, subStepCode) {
            var defer = $.Deferred();
            if (typeof stepDetail === 'number' && subStepCode == null) {
                var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/findStepDocsByStepId/" + stepDetail;
            } else if (subStepCode == null) {
                var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/findStepDocsByCode/" + stepDetail;
            } else {
                var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/findStepDocsByCode/" + stepDetail + "/" + subStepCode;
            }
            $.ajax({
                type: "GET",
                url: serverURL,
                success: function (data, status) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        // for creating public link
        self.createPublicLink = function(fileId, fileName) {
            var defer = $.Deferred();
            var serverURL = "https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/api/1.1/publiclinks/file/" + fileId;
            console.log("creating public link..");
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                data : "{\r\n\t\"assignedUsers\": \"@everybody\",\r\n\t\"role\": \"contributor\"\r\n}",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic Y2xvdWQuYWRtaW46d09SdGh5QDVQaXBl");
                    xhr.setRequestHeader("cache-control", "no-cache");
                },
                success: function (data) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    console.log(data);
                    if (data.id === fileId) {
                        defer.resolve(data.linkID, fileId, fileName);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at:" + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
                
        // for adding step documents
        self.addStepDocument = function(payload) {
            var defer = $.Deferred();
            console.log(payload);
            var serverURL = "https://140.86.1.93/hexiCloudRest/services/rest/addStepDocument/";
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                data: payload,
                success: function (data, status) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data, status);
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
