angular.module('ToDoList.common', [
    'ngRoute',
    'ngStorage'
])
    .service('tasksFactory', function () {
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
    })
    .service('tasksValidator', function () {
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
    })
    .service('tasksStorage', function ($localStorage, tasksValidator, $log) {
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
                $log.error("Try to save invalid task!");
            }
        }

        function updateTask(originalTask, updatedTask) {
            var index = getTasks().indexOf(originalTask);
            getTasks()[index] = updatedTask;
        }

        return {
            getTasks: getTasks,
            addTask: addTask,
            updateTask: updateTask
        };
    });