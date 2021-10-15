<template>
  <v-text-field
    v-model="newTaskTitle"
    class="pa-3 field-add-task"
    outlined
    placeholder="Add Task"
    hide-details
    clearable
    @keyup.enter="addTask"
  >
    <v-icon slot="append" :disabled="newTaskTitleInvalid" @click="addTask">
      mdi-plus
    </v-icon>
  </v-text-field>
</template>

<script>
export default {
  data() {
    return {
      newTaskTitle: "",
    };
  },
  computed: {
    newTaskTitleInvalid() {
      return !this.newTaskTitle;
    },
  },
  methods: {
    addTask() {
      console.log("clicked");
      if (!this.newTaskTitleInvalid) {
        this.$store.dispatch("addTask", this.newTaskTitle);
        this.newTaskTitle = "";
      }
    },
  },
};
</script>

<style lang="sass">
.field-add-task.v-input--is-focused
  .v-input__control
    background: rgba(31,94,129,0.5) !important
</style>
