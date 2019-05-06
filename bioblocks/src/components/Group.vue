<template>
  <v-app class="appContainer">
    <el-form
      class="newform"
      :model="ruleForm1"
      :rules="namesRules"
      ref="ruleForm1"
      lazy-validation
      style="margin-top:10%;"
    >
      <el-form-item prop="group_name">
        <el-input
          v-model="ruleForm1.group_name"
          @keyup.enter.native="create('ruleForm1')"
          :disabled="!isEditing"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="!isEditing">
        <el-button class="successB" @click="isEditing = !isEditing" style="margin-right: 5%;">Edit</el-button>
        <el-button
          class="danger"
          @click="deleting = !deleting"
          style="margin-left: 5%;"
        >Delete group</el-button>
        <v-dialog v-model="deleting" width="350px">
          <v-card style="height:250px;">
            <h1 style="font-size: 16px; padding: 10%;">
              Are you sure?
              <br>Once deleted, the group can't be restored
            </h1>
            <div>
              <el-button class="danger" @click="deleteGroup()" style="margin-top: 5%;">Delete</el-button>
            </div>
          </v-card>
        </v-dialog>
      </el-form-item>
      <el-form-item v-if="isEditing">
        <el-button
          type="default"
          @click="isEditing = !isEditing; ruleForm1.group_name = dataGroup.dataname"
          style="margin-right: 5%;"
        >Cancel</el-button>
        <el-button class="successB" @click="editGroup('ruleForm1')" style="margin-left: 5%;">Save</el-button>
      </el-form-item>
    </el-form>

    <div>
      <div>
        <span
          style="font-size: 25px; color: #193157; padding: 0 10px; background-color: white;"
        >Projects of the group</span>
      </div>
      <v-container fluid>
        <v-layout column>
          <v-flex xs12>
            <div class="resultContainer">
              <v-layout
                v-for="threeProjects in projects"
                :key="threeProjects.length"
                align-center
                justify-center
                row
              >
                <div
                  class="homeItem elevation-5"
                  v-for="project in threeProjects"
                  :key="project.id_project"
                  style="margin: 3%;"
                >
                  <h1 style="margin-top:35%;">
                    <a
                      style="color:#193157; text-decoration: none;"
                      :href="'/project/' + project.id_project"
                    >{{ project.name }}</a>
                  </h1>
                </div>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>

    <v-snackbar color="green" v-model="alertEdit" :timeout="timeout">
      {{ textEdit }}
      <v-btn green flat></v-btn>
    </v-snackbar>
    <v-snackbar color="red" v-model="alertEditError" :timeout="timeout">
      {{ textEditError }}
      <v-btn red flat></v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "group",
  data() {
    return {
      deleting: false,
      isEditing: false,
      alertEdit: false,
      alertEditError: false,
      timeout: 4000,
      textEdit: "Group successfully saved",
      textEditError: "Error saving the group",
      labelPosition: "top",
      valid: true,
      read: true,
      ruleForm1: {
        group_name: ""
      },
      namesRules: {
        group_name: [
          {
            required: true,
            message: "Name is required",
            trigger: "blur"
          }
        ]
      },
      dataGroup: {
        dataid: "",
        dataname: ""
      },
      projects: []
    };
  },
  mounted() {
    apiService.getGroup(this.$route.params.id).then(result => {
      if (result.data != "") {
        this.dataGroup.dataid = this.$route.params.id;
        this.dataGroup.dataname = result.data.name;
        this.ruleForm1.group_name = result.data.name;
      } else this.$router.push("/newgroup");
    });
    apiService.AllMyProjects().then(result => {
      for (var i = 0; i < result.data.length; i += 3) {
        var threeItems = [];
        for (var n = 0; n < 3; n++)
          if (result.data[i + n] != null) threeItems.push(result.data[i + n]);
        this.projects.push(threeItems);
      }
    });
  },
  methods: {
    editGroup(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            id_group: this.dataGroup.dataid,
            name: this.ruleForm1.group_name
          };
          apiService.editGroup(info).then(result => {
            if (result.data.success) {
              this.alertEdit = !this.alertEdit;
              this.isEditing = !this.isEditing;
            }
          });
        }
      });
    },
    deleteGroup() {
      var info = {
        id_group: this.dataGroup.dataid
      };
      apiService.deleteGroup(info).then(result => {
        if (result.data.success) {
          this.$router.push("/newgroup");
        }
      });
    }
  }
};
</script>
