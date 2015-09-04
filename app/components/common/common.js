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
        //$localStorage.$reset();

        function initStorage() {
            $localStorage.tasks = [];
            $localStorage.$apply();
        }

        function isStorageInitialized() {
            return $localStorage.tasks;
        }

        function getTasks() {
            if (!isStorageInitialized()) {
                initStorage();
            }
            return $localStorage.tasks;
        }

        function saveTasks(tasks) {
            $localStorage.tasks = tasks;
            $localStorage.$apply();
        }

        function addTask(task) {
            if (!isStorageInitialized($localStorage)) {
                initStorage($localStorage);
            }
            if (tasksValidator.isTaskValid(task)) {
                var tasks = getTasks();
                tasks.push(task);
                saveTasks(tasks);
            } else {
                $log.error("Try to save invalid task!");
            }
        }

        function updateTask(originalTask, updatedTask) {
            if (!isStorageInitialized($localStorage)) {
                initStorage($localStorage);
            }
            var tasks = getTasks();
            var index = tasks.indexOf(originalTask);
            if (index >= 0) {
                // Because ngStore has a bug when after refresh page it's break data
                var task = tasks[index];
                task.name = updatedTask.name;
                task.priority = updatedTask.priority;
                task.endDate = updatedTask.endDate;
                task.isCompleted = updatedTask.isCompleted;
                task.description = updatedTask.description;
                saveTasks(tasks);
            }
        }

        return {
            getTasks: getTasks,
            addTask: addTask,
            updateTask: updateTask
        };
    });