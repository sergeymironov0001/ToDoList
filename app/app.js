'use strict';

angular.module('ToDoList', [
    'ngRoute',
    'ui.router',
    'ui.bootstrap',
    'ToDoList.common',
    'ToDoList.addTask',
    'ToDoList.outputTasks'
])
    .config(function ($routeProvider, $stateProvider) {
        $routeProvider.otherwise({redirectTo: '/'});

        $stateProvider
            .state('index', {
                url: "",
                views: {
                    'addTaskView': {
                        templateUrl: 'views/addTask/addTask.html'
                    },
                    'outputTasksView': {
                        templateUrl: 'views/outputTasks/outputTasks.html'
                    }
                }
            });
    });



