/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout', 'jquery', 'config/sessionInfo', 'ojs/ojrouter'
], function (ko, $, sessionInfo) {
    /**
     * The view model for the managing service calls
     */
    function serviceConfig() {
        var self = this;
        // Context root for prod and test
//        var ctx = '/hexiCloudRestSecured';
        // Context root for dev
           var ctx = '/hexiCloudRestSecuredDev';
        if (location.origin.indexOf('localhost') > 0) {
            if (location.protocol === 'http:') {
                self.portalRestHost = ko.observable("http://129.152.128.105:8080".concat(ctx));
            } else {
                self.portalRestHost = ko.observable("https://129.152.128.105".concat(ctx));
            }
        } else {
            //For context root to be relative on PROD
            self.portalRestHost = ko.observable(location.origin.concat(ctx));
        }
        // for uploading a file to DOCS Cloud
        self.uploadFile = function (payload) {
            var defer = $.Deferred();
            var serverURL = "https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/api/1.1/files/data";
//            var serverURL = "https://129.152.128.105/hexiCloudUpload/services/rest/uploadStepDocument";
            $.ajax({
                type: "POST",
                url: serverURL,
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: payload,
                dataType: "json",
                beforeSend: function (xhr) {
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
        self.getApplicationSteps = function () {
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/services/rest/getApplicationSteps";
//            var serverURL = "jsonData/stepsData.json";
            $.ajax({
                type: "GET",
                url: serverURL,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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
        self.getFileDetails = function (stepDetail, subStepCode) {
            var defer = $.Deferred();
            if (typeof stepDetail === 'number' && subStepCode == null) {
                var serverURL = self.portalRestHost() + "/services/rest/findStepDocsByStepId/" + stepDetail;
            } else if (subStepCode == null) {
                var serverURL = self.portalRestHost() + "/services/rest/findStepDocsByCode/" + stepDetail;
            } else {
                var serverURL = self.portalRestHost() + "/services/rest/findStepDocsByCode/" + stepDetail + "/" + subStepCode;
            }
            $.ajax({
                type: "GET",
                url: serverURL,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
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

        // for creating public link
        self.createPublicLink = function (fileId, fileName) {
            var defer = $.Deferred();
            var serverURL = "https://documents-usoracleam82569.documents.us2.oraclecloud.com/documents/api/1.1/publiclinks/file/" + fileId;
            console.log("creating public link..");
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                data: "{\r\n\t\"assignedUsers\": \"@everybody\",\r\n\t\"role\": \"contributor\"\r\n}",
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
        self.addStepDocument = function (payload) {
            var defer = $.Deferred();
            console.log(payload);
            var serverURL = self.portalRestHost() + "/services/rest/addStepDocument/";
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                data: payload,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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

        self.findUserEmails = function (payload) {
            var defer = $.Deferred();
            console.log(payload);
            if (payload === null) {
                var serverURL = self.portalRestHost() + "/services/rest/findUserEmails?";
            } else {
                var serverURL = self.portalRestHost() + "/services/rest/findUserEmails?" + payload;
            }
            $.ajax({
                type: "GET",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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

        self.submitRecord = function (payload) {
            var defer = $.Deferred();
            console.log(payload);
            var serverURL = self.portalRestHost() + "/services/rest/updateEmailResolution/";
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                data: payload,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
                success: function (data, status) {
                    console.log("Successfully created record at: " + serverURL);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error created record at:" + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };

        // To create a portal user
        self.createUser = function (payload) {
            console.log('payload: ' + payload);
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/services/rest/createPortalUser/";
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                data: payload,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
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

        // Check whether a given user id is available or not
        self.isUserIdAvailable = function (payload) {
            console.log('payload: ' + payload);
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/services/rest/checkUserIdAvailable/" + payload + '/';
            $.ajax({
                type: "GET",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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

        self.authenticate = function (payload) {
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/login";
            $.ajax({
                type: "POST",
                url: serverURL,
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("Portal-Type", "admin");
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                contentType: "application/x-www-form-urlencoded",
                data: payload,
                success: function (data, textStatus, xhr) {
                    console.log('Successfully posted data at: ' + serverURL);
                    console.log('textStatus : ' + textStatus);
                    console.log('Response status code : ' + xhr.status);
                    defer.resolve(data, {status: xhr.status});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error posting data to the service : " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };

        self.getCustomers = function ()
        {
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/services/rest/getCustRegistries/";
            $.ajax({
                type: "GET",
                url: serverURL,
                contentType: "application/json",
                processData: false,
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
                success: function (data, xhr) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data, {status: xhr.status});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };

        self.searchUsers = function (payload) {
            var defer = $.Deferred();
            console.log("searchUsers:" + payload);
            var serverURL = self.portalRestHost() + "/services/rest/searchUsers/?" + payload;
            $.ajax({
                type: "GET",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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

        self.updateUser = function (payload) {
            var defer = $.Deferred();
            console.log("updateUser:" + payload);
            var serverURL = self.portalRestHost() + "/services/rest/updateUser/";
            $.ajax({
                type: "PUT",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
                data: payload,
                success: function (data, xhr) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data, {status: xhr.status});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at:" + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };

        self.updatePassword = function (payload) {
            var defer = $.Deferred();
            console.log("updatePassword:" + payload);
            var serverURL = self.portalRestHost() + "/services/rest/updateUserPassword/";
            $.ajax({
                type: "POST",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request)
                {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
                data: payload,
                success: function (data, xhr) {
                    console.log("Successfully retrieved details at: " + serverURL);
                    defer.resolve(data, {status: xhr.status});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at:" + serverURL);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };

        self.getUserNavAudit = function (userId) {
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/services/rest/getUserNavAudit/?userId=" + userId;
            $.ajax({
                type: "GET",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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

        self.exportAudit = function () {
            var defer = $.Deferred();
            var serverURL = self.portalRestHost() + "/services/rest/exportAudit";
            $.ajax({
                type: "GET",
                url: serverURL,
                contentType: "application/json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + sessionInfo.getFromSession(sessionInfo.accessToken));
                },
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
    }
    ;

    return new serviceConfig();
});
