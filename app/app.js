'use strict';

// Declare app level module which depends on views, and components
angular.module('todoList', [
    'ngRoute',
    'ui.bootstrap',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'ngStorage'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]).
    factory('tasksFactory', function () {
        function Task(name, priority, endDate, isCompleted, description) {
            this.name = name;
            this.priority = priority;
            this.endDate = endDate;
            this.isCompleted = isCompleted;
            this.description = description;
            return this;
        }

        function createEmptyTask() {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return new Task('', 1, tomorrow, false, '');
        }

        function getTasksPriorities() {
            return [1, 2, 3];
        }

        function getTasksDefaultPriority() {
            return getTasksPriorities()[0];
        }

        return {
            createNewTask: createEmptyTask,
            getTasksPriorities: getTasksPriorities,
            getTasksDefaultPriority: getTasksDefaultPriority
        };
    }).
    service('tasksValidator', function () {
        function isTaskNameValid(task) {
            if (task.name) {
                return true;
            }
            return false;
        };

        function isTaskValid(task) {
            return isTaskNameValid(task);
        }

        return {
            isTaskNameValid: isTaskNameValid,
            isTaskValid: isTaskValid
        };
    }).
    service('tasksStorage', function ($localStorage, tasksValidator, $log) {
        function initStorage(storage) {
            storage.tasks = [];
        }

        function getTasks() {
            if (!$localStorage.tasks) {
                initStorage($localStorage);
            }
            return $localStorage.tasks;
        }

        function addTask(task) {
            if (!$localStorage.tasks) {
                initStorage($localStorage);
            }

            if (tasksValidator.isTaskValid(task)) {
                $localStorage.tasks.push(task);
            } else {
                log.error("Try to save invalid task!");
            }
        }

        function updateTask(originalTask, updatedTask) {
            var index = getTasks().indexOf(originalTask);
            console.log(index);
            getTasks()[index] = updatedTask;
        }

        return {
            getTasks: getTasks,
            addTask: addTask,
            updateTask: updateTask
        };
    }).

    controller('addTaskController', function ($scope, tasksFactory, tasksStorage, tasksValidator) {
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
    }).
    controller('outputTasksController', function ($scope, $modal, tasksStorage) {
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

        var selectedTask = null;

        $scope.selectTask = function (task) {
            selectedTask = task;
        };

        $scope.isTaskSelected = function (task) {
            return task === selectedTask;
        };

        $scope.openTaskDetailsModalDialog = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'view1/taskDetailsModalDialogForm.html',
                controller: 'taskDetailsModalDialogInstanceController',
                resolve: {
                    task: function () {
                        return Object.create(selectedTask);
                    }
                }
            });

            modalInstance.result.then(function (task) {
                tasksStorage.updateTask(selectedTask, task)
                selectedTask = task;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
    }).
    controller('taskDetailsModalDialogInstanceController', function ($scope, $modalInstance, tasksFactory, tasksValidator, task) {
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


