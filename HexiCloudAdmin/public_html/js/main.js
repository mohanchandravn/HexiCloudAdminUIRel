/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
requirejs.config({
    baseUrl: 'js',
    // Path mappings for the logical module names
    paths:
            //injector:mainReleasePaths
                    {
                        'knockout': 'libs/knockout/knockout-3.4.0',
                        'jquery': 'libs/jquery/jquery-3.1.1.min',
                        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0.min',
                        'promise': 'libs/es6-promise/es6-promise.min',
                        'hammerjs': 'libs/hammer/hammer-2.0.8.min',
                        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
                        'ojs': 'libs/oj/v3.0.0/min',
                        'ojL10n': 'libs/oj/v3.0.0/ojL10n',
                        'ojtranslations': 'libs/oj/v3.0.0/resources',
                        'text': 'libs/require/text',
                        'signals': 'libs/js-signals/signals.min',
                        'customElements': 'libs/webcomponents/CustomElements.min'
//                        ,
//                        'proj4': 'libs/proj4js/dist/proj4-src',
//                        'css': 'libs/require-css/css.min'
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
    'config/sessionInfo',
    'ojs/ojknockout',
    'ojs/ojrouter',
    'ojs/ojmodule'],
        function (oj, ko, $, sessionInfo)
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
            }
            ;

            router.configure({
                'home': {label: 'Home', value: getPath('home'), isDefault: true},
                'login': {label: 'Login', value: getPath('login')},
                'csmadmin': {label: 'CSM Admin', value: getPath('csmadmin')},
                'scheduler': {label: 'Scheduler', value: getPath('scheduler')},
                'landing': {label: 'Landing', value: getPath('landing')},
                'createuser': {label: 'Create User', value: getPath('createuser')}
            });

            var adminRouter = router.createChildRouter('csmAdminDetails');
            adminRouter.configure({
                'manageEmails': {label: 'Manage Emails', value: getPath('manageemails'), isDefault: true},
                'manageUsers': {label: 'Manager Users', value: getPath('manageusers')},
                'manageOtherUseCases': {label: 'Manager Other Use Cases', value: getPath('manageotherusecases')},
                'createUser': {label: 'Create User', value: getPath('createuser')}
//                ,
//                'scheduler': {label: 'Scheduler', value: 'pages/scheduler/scheduler'}
            });
            self.csmAdminRouter = adminRouter;

            var moduleConfig = $.extend(true, {}, adminRouter.moduleConfig, {params: {
                    'rootData': {}}});
            self.childModuleConfig = moduleConfig;

            function viewModel() {
                self.router = router;
                var moduleConfig = $.extend(true, {}, router.moduleConfig, {params: {
                        'rootData': {}}});
                self.moduleConfig = moduleConfig;

                self.isDomainDetailsGiven = ko.observable(false);

                //screenrange observable for responsive alignment
                self.screenRange = oj.ResponsiveKnockoutUtils.createScreenRangeObservable();
                self.viewportSize = ko.computed(function () {
                    console.log(self.screenRange().toUpperCase());
                    return self.screenRange().toUpperCase();
                });
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

                self.showPreloader = function () {
                    $("#preloader").removeClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "none");
                    $("#routingContainer").css("opacity", "0.5");
                };

                self.hidePreloader = function () {
                    $("#preloader").addClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "");
                    $("#routingContainer").css("opacity", "");
                };

                //restricting direct access without login
                if (router)
                {
                    if (router.stateId() !== 'home')
                    {
                        if (!sessionInfo.getFromSession('accessToken'))
                        {
                            router.go('home/');
                        }
                    } else if (sessionInfo.getFromSession('accessToken'))
                    {
                        router.go('csmadmin/');
                    }
                }



            }
            ;

            $(document).ready(function () {
                oj.Router.sync().then(function () {
                    ko.applyBindings(viewModel(), document.getElementById('routing-container'));
                });
            });
        });

