'use strict';

angular.module('ToDoList.outputTasks', ['ngRoute', 'ui.bootstrap', 'ToDoList.common'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/outputTasks', {
            templateUrl: 'views/outputTasks/outputTasks.html',
            controller: 'OutputTasksController'
        });
    }])
    .controller('OutputTasksController', function ($scope, $modal, tasksStorage) {
        $scope.getTasks = function () {
            return tasksStorage.getTasks();
        };

        var _sortingModel = {
            sortingFiled: 'name',
            reverse: true
        };

        $scope.order = function (fieldName) {
            _sortingModel.reverse = (_sortingModel.sortingFiled === fieldName) ? !_sortingModel.reverse : false;
            _sortingModel.sortingFiled = fieldName;
        };

        $scope.isOrderBy = function (fieldName) {
            return _sortingModel.sortingFiled === fieldName;
        };

        $scope.getSortingFiled = function () {
            return _sortingModel.sortingFiled;
        };

        $scope.isReverseSorting = function () {
            return _sortingModel.reverse;
        };

        var _filterModel = {
            active: true,
            completed: false,
        };

        $scope.activeTaskFilter = function (newValue) {
            if (newValue === undefined) {
                return _filterModel.active;
            }
            if (!_filterModel.completed && !newValue) {
                return _filterModel.active;
            }
            _filterModel.active = newValue;
            return _filterModel.active;
        };

        $scope.completedTaskFilter = function (newValue) {
            if (newValue === undefined) {
                return _filterModel.completed;
            }
            if (!_filterModel.active && !newValue) {
                return _filterModel.completed;
            }
            _filterModel.completed = newValue;
            return _filterModel.completed;
        };

        $scope.getTasksFilterArguments = function () {
            if (_filterModel.active && _filterModel.completed) {
                return {};
            } else if (_filterModel.active) {
                return {
                    isCompleted: false
                }
            } else if (_filterModel.completed) {
                return {
                    isCompleted: true
                }
            }
            else {
                return {};
            }
        };

        var _selectedTask = null;

        $scope.selectTask = function (task) {
            _selectedTask = task;
        };

        $scope.isTaskSelected = function (task) {
            return task === _selectedTask;
        };

        $scope.openTaskDetailsModalDialog = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/outputTasks/taskDetailsPopup.html',
                controller: 'TaskDetailsPopupInstanceController',
                resolve: {
                    task: function () {
                        return Object.create(_selectedTask);
                    }
                }
            });

            modalInstance.result.then(function (task) {
                tasksStorage.updateTask(_selectedTask, task)
                _selectedTask = task;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
    })
    .controller('TaskDetailsPopupInstanceController', function ($scope, $modalInstance, tasksFactory, tasksValidator, task) {
        $scope.task = task;

        $scope.priorities = tasksFactory.getTasksPriorities;
        $scope.isTaskNameValid = tasksValidator.isTaskNameValid
        $scope.isTaskValid = tasksValidator.isTaskValid;

        $scope.save = function () {
            $modalInstance.close($scope.task);
        };
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });