/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
requirejs.config({
    baseUrl: '.',
    // Path mappings for the logical module names
    paths:
    //injector:mainReleasePaths
    {
        'knockout': 'js/libs/knockout/knockout-3.4.0',
        'jquery': 'js/libs/jquery/jquery-3.1.0.min',
        'jqueryui-amd': 'js/libs/jquery/jqueryui-amd-1.12.0.min',
        'ojs': 'js/libs/oj/v2.2.0/debug',
        'ojL10n': 'js/libs/oj/v2.2.0/ojL10n',
        'ojtranslations': 'js/libs/oj/v2.2.0/resources',
        'signals': 'js/libs/js-signals/signals.min',
        'text': 'js/libs/require/text',
        'promise': 'js/libs/es6-promise/es6-promise.min',
        'hammerjs': 'js/libs/hammer/hammer-2.0.8.min',
        'ojdnd': 'js/libs/dnd-polyfill/dnd-polyfill-1.0.0.min'
    }
    //endinjector
    ,
    // Shim configurations for modules that do not expose AMD
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        }
    },
    // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
    // resources with a custom translation file.
    // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
    // a path that is relative to the location of this main.js file.
    config: {
        ojL10n: {
            merge: {
                //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
            }
        }
    }
});


/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */

require(['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojknockout',
    'ojs/ojrouter',
    'ojs/ojmodule'],
        function (oj, ko, $)
        {
            var self = this;
            
            //oj.Assert.forceDebug();
            //oj.Logger.option('level', oj.Logger.LEVEL_INFO);
            oj.ModuleBinding.defaults.modelPath = './';
            oj.ModuleBinding.defaults.viewPath = 'text!./';

            
            // Retrieve the router static instance and configure the states
            var router = oj.Router.rootInstance;
            
            // Set the router base URL to the href of this page. This is needed when
            // dealing with rewrited URL when the router uses the path URL adapter.
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            function getPath(path) {
                return "pages/" + path + "/" + path;
            };

            router.configure( {
                'home': {label: 'Home', value: getPath('home'), isDefault: true},
                'login': {label: 'Login', value: getPath('login')},
                'csmadmin': {label: 'CSM Admin', value: getPath('csmadmin')}
            });

            function viewModel() {
                self.router = router;
                var moduleConfig = $.extend(true, {}, router.moduleConfig, {params: {
                        'rootData': {}}});
                self.moduleConfig = moduleConfig;
                
                self.isDomainDetailsGiven = ko.observable(false);
                
                //screenrange observable for responsive alignment
                self.screenRange = oj.ResponsiveKnockoutUtils.createScreenRangeObservable();
                self.isLoggedInUser = ko.observable(false);
                self.wrapperRestEndPoint = ko.observable("https://140.86.1.93/HexiCloudRESTAPI/resources/rest/myservices");
                
                self.loggedInUser = ko.observable();
                self.loggedInUserRole = ko.observable();

                self.getStateId = function () {
                    return router.currentState().id;
                };

                self.FailCallBackFn = function (xhr) {
                    console.log(xhr);
                };
                
                self.showPreloader = function() {
                    $("#preloader").removeClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "none");
                    $("#routingContainer").css("opacity", "0.5");
                };
                
                self.hidePreloader = function() {
                    $("#preloader").addClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "");
                    $("#routingContainer").css("opacity", "");
                };

            };

            $(document).ready(function () {
                oj.Router.sync().then(function () {
                    ko.applyBindings(viewModel(), document.getElementById('routing-container'));
                });
            });
        });

