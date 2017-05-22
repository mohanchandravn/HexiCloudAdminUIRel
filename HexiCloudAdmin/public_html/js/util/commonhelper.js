/**
 * Copyright © 2016, Oracle and/or its affiliates. All rights reserved.
 */

/**
 * Singleton with all common helper methods
 */
define(['knockout'
], function () {
    'use strict';

    function CommonHelper() {

        var self = this;

 
        self.emailRegExpPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$';
        self.phoneRegExpPattern = '^[0-9]+$';
        
        var testTypes = {};
        
        function emitXmlHeader(headerObj) {
            var headerRow =  '<ss:Row>\n';
            for (var colName in headerObj) {
                testTypes[colName] = typeof colName;
            }
            for (var colName in headerObj) {
                headerRow += '  <ss:Cell>\n';
                headerRow += '    <ss:Data ss:Type="String">';
                headerRow += colName + '</ss:Data>\n';
                headerRow += '  </ss:Cell>\n';        
            }
            headerRow += '</ss:Row>\n';
            return '<?xml version="1.0"?>\n' +
                   '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
                   '<ss:Worksheet ss:Name="Sheet1">\n' +
                   '<ss:Table>\n\n' + headerRow;
        };
        
        function emitXmlFooter() {
            return '\n</ss:Table>\n' +
                   '</ss:Worksheet>\n' +
                   '</ss:Workbook>\n';
        };
        
        function download(content, fileName, contentType) {
            if (contentType === undefined) {
                contentType = 'application/octet-stream';
            }
            console.log(contentType);
            // we have to generate a temp <a /> tag and remove it
            var link = document.createElement("a"); 
            var blob = new Blob([content], {
                'type': contentType
            });  
            link.href = window.URL.createObjectURL(blob);

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName;

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        
        self.JSONToXLSConverter = function(JSONData, FileTitle) {
            var row;
            var col;
            var xml;
            var data = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
            console.log(JSONData);
            console.log(JSONData[0]);
            xml = emitXmlHeader(JSONData[0]);

            for (row = 0; row < data.length; row++) {
                xml += '<ss:Row>\n';

                for (col in data[row]) {
                    xml += '  <ss:Cell>\n';
//                    xml += '    <ss:Data ss:Type="' + testTypes[col]  + '">';
                    xml += '    <ss:Data ss:Type="String">';
                    xml += data[row][col] + '</ss:Data>\n';
                    xml += '  </ss:Cell>\n';
                }

                xml += '</ss:Row>\n';
            }

            xml += emitXmlFooter();
            FileTitle = FileTitle.replace(/ /g,"_");
            download(xml, FileTitle + ".xls", 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            return true;
        };
    }

    return new CommonHelper();
});
