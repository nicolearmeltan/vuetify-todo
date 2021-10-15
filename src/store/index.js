import Vue from "vue";
import Vuex from "vuex";
import localbase from "localbase";

let db = new localbase("db");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    search: null,
    tasks: [
      // {
      //   id: 1,
      //   title: "Wake up",
      //   done: false,
      //   dueDate: "2020-10-16",
      // },
      // {
      //   id: 2,
      //   title: "Get bananas",
      //   done: false,
      //   dueDate: "2020-10-17",
      // },
      // {
      //   id: 3,
      //   title: "Eat bananas",
      //   done: false,
      //   dueDate: null,
      // },
    ],
    snackbar: {
      show: false,
      text: "",
    },
    sorting: false,
  },
  mutations: {
    setSearch(state, value) {
      state.search = value;
    },
    addTask(state, newTask) {
      state.tasks.push(newTask);
    },
    doneTask(state, id) {
      state.tasks.map((task) => {
        if (task.id === id) {
          task.done = !task.done;
        }
      });
    },
    deleteTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
    updateTaskTitle(state, payload) {
      state.tasks.map((task) => {
        if (task.id === payload.id) {
          task.title = payload.title;
        }
      });
    },
    updateTaskDueDate(state, payload) {
      state.tasks.map((task) => {
        if (task.id === payload.id) {
          task.dueDate = payload.dueDate;
        }
      });
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    showSnackbar(state, text) {
      let timeout = 0;
      if (state.snackbar.show) {
        state.snackbar.show = false;
        timeout = 300;
      }
      setTimeout(() => {
        state.snackbar.show = true;
        state.snackbar.text = text;
      }, timeout);
    },
    hideSnackbar(state) {
      state.snackbar.show = false;
    },
    toggleSorting(state) {
      state.sorting = !state.sorting;
    },
  },
  actions: {
    addTask({ commit }, newTaskTitle) {
      let newTask = {
        id: Date.now(),
        title: newTaskTitle,
        done: false,
        dueDate: null,
      };
      db.collection("tasks")
        .add(newTask)
        .then(() => {
          commit("addTask", newTask);
          commit("showSnackbar", "Task Added!");
        });
    },
    doneTask({ state, commit }, id) {
      let task = state.tasks.filter((task) => task.id === id)[0];
      db.collection("tasks")
        .doc({ id })
        .update({
          done: !task.done,
        })
        .then(() => commit("doneTask", id));
    },
    deleteTask({ commit }, id) {
      db.collection("tasks")
        .doc({ id })
        .delete()
        .then(() => {
          commit("deleteTask", id);
          commit("showSnackbar", "Task Deleted!");
        });
    },
    updateTaskTitle({ commit }, payload) {
      db.collection("tasks")
        .doc({ id: payload.id })
        .update({
          title: payload.title,
        })
        .then(() => {
          commit("updateTaskTitle", payload);
          commit("showSnackbar", "Task Updated!");
        });
    },
    updateTaskDueDate({ commit }, payload) {
      db.collection("tasks")
        .doc({ id: payload.id })
        .update({
          dueDate: payload.dueDate,
        })
        .then(() => {
          commit("updateTaskDueDate", payload);
          commit("showSnackbar", "Due Date Updated!");
        });
    },
    getTasks({ commit }) {
      db.collection("tasks")
        .get()
        .then((tasks) => commit("setTasks", tasks));
    },
    setTasks({ commit }, tasks) {
      db.collection("tasks").set(tasks);
      commit("setTasks", tasks);
    },
  },
  getters: {
    tasksFiltered(state) {
      if (!state.search) {
        return state.tasks;
      }
      return state.tasks.filter((task) =>
        task.title.toLowerCase().includes(state.search.toLowerCase())
      );
    },
  },
  modules: {},
});
