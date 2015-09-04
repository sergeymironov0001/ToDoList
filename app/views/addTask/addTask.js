'use strict';

angular.module('ToDoList.addTask', ['ngRoute', 'ui.bootstrap', 'ToDoList.common'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/addTask', {
            templateUrl: 'views/addTask/addTask.html',
            controller: 'AddTaskController'
        });
    }])
    .controller('AddTaskController', function ($scope, tasksFactory, tasksStorage, tasksValidator) {
        $scope.newTask = tasksFactory.createNewTask();

        $scope.addTask = function () {
            tasksStorage.addTask($scope.newTask);
            $scope.newTask = tasksFactory.createNewTask();
        };

        $scope.isNewTaskCorrect = function () {
            return tasksValidator.isTaskValid($scope.newTask);
        };

        $scope.priorities = tasksFactory.getTasksPriorities;
        $scope.defaultPriority = tasksFactory.getTasksDefaultPriority;
    });