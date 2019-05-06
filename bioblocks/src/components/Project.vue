<template>
  <v-app style="position: relative; top: 7%;">
    <v-btn icon v-if="editing" style="margin: 2%;" @click="editing = !editing">
      <v-icon>first_page</v-icon>
    </v-btn>
    <el-form
      v-if="editing"
      class="newform"
      :model="ruleForm1"
      :rules="namesRules"
      ref="ruleForm1"
      lazy-validation
      style="margin-top:10%;"
    >
      <el-form-item prop="project_name">
        <el-input
          v-model="ruleForm1.project_name"
          @keyup.enter.native="create('ruleForm1')"
          :disabled="!isEditing"
        ></el-input>
      </el-form-item>
      <el-form-item prop="project_group">
        <el-input
          v-model="ruleForm1.project_group"
          @keyup.enter.native="create('ruleForm1')"
          :disabled="!isEditing"
          placeholder="Id of the group related"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="ruleForm1.public"
          label="Public project"
          name="type"
          :disabled="!isEditing"
        ></el-checkbox>
      </el-form-item>
      <el-form-item v-if="!isEditing">
        <el-button class="successB" @click="isEditing = !isEditing" style="margin-right: 5%;">Edit</el-button>
        <el-button class="danger" @click="deleting = !deleting" style="margin-left: 5%;">Delete project</el-button>
        <v-dialog v-model="deleting" width="350px">
                    <v-card style="height:250px;">
                      <h1 style="font-size: 16px; padding: 10%;">Are you sure? <br/> Once deleted, the project can't be restored</h1>
                      <div>
                      <el-button class="danger" @click="deleteProject()" style="margin-top: 5%;">Delete</el-button>
                      </div>
                    </v-card>
                  </v-dialog>
      </el-form-item>
      <el-form-item v-if="isEditing">
        <el-button type="default" @click="isEditing = !isEditing; ruleForm1.project_name = dataProject.dataname; ruleForm1.public = dataProject.datapublic; ruleForm1.project_group = dataProject.dataproject_group;" style="margin-right: 5%;">Cancel</el-button>
        <el-button class="successB" @click="editProject('ruleForm1')" style="margin-left: 5%;">Save</el-button>
      </el-form-item>
    </el-form>

    <Bioblocks
      v-show="!editing"
      :methodSave="saveProject"
      :methodAdd="addUser"
      :methodEdit="switchEdit"
      :dataxml="this.dataProject.dataxml"
      :isOwner="this.dataProject.isOwner"
    />
    <v-snackbar color="green" v-model="alert" :timeout="timeout">
      {{ text }}
      <v-btn green flat></v-btn>
    </v-snackbar>
    <v-snackbar color="green" v-model="alertAdd" :timeout="timeout">
      {{ textAdd }}
      <v-btn green flat></v-btn>
    </v-snackbar>
    <v-snackbar color="red" v-model="alertAddError" :timeout="timeout">
      {{ textAddError }}
      <v-btn red flat></v-btn>
    </v-snackbar>
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
import Bioblocks from "./Bioblocks.vue";
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "project",
  components: {
    Bioblocks
  },
  data() {
    var validateGroup = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("Id must be a number"));
      } else {
        callback();
      }
    };
    return {
      deleting: false,
      editing: false,
      isEditing: false,
      alert: false,
      alertAdd: false,
      alertAddError: false,
      alertEdit: false,
      alertEditError: false,
      timeout: 4000,
      text: "Project successfully saved",
      textAdd: "User successfully added",
      textAddError: "User does not exist",
      textEdit: "Project successfully saved",
      textEditError: "Error saving the project",
      labelPosition: "top",
      valid: true,
      read: true,
      ruleForm1: {
        project_name: "",
        project_group: "",
        public: ""
      },
      namesRules: {
        project_name: [
          {
            required: true,
            message: "Name is required",
            trigger: "blur"
          }
        ],
        project_group: [
          {
            validator: validateGroup,
            trigger: "blur"
          }
        ]
      },
      dataProject: {
        dataid: "",
        dataxml: "",
        dataname: "",
        datapublic: "",
        dataproject_group: "",
        isOwner: ""
      }
    };
  },
  mounted() {
    apiService.getProject(this.$route.params.id).then(result => {
      if (result.data != "") {
        this.dataProject.dataid = this.$route.params.id;
        this.dataProject.dataxml = result.data.info.xml_file;
        this.dataProject.dataname = result.data.info.name;
        this.dataProject.datapublic = result.data.info.public == 1;
        this.dataProject.dataproject_group = result.data.info.project_group;
        this.dataProject.isOwner = result.data.isOwner;
        this.ruleForm1.project_name = result.data.info.name;
        this.ruleForm1.public = result.data.info.public == 1;
      } else this.$router.push("/newproject");
    });
  },
  methods: {
    saveProject(info) {
      info.id_project = this.dataProject.dataid;
      apiService.saveProject(info).then(result => {
        if (result.data.success) {
          this.alert = !this.alert;
        }
      });
    },
    deleteProject() {
      var info = {
            id_project: this.dataProject.dataid
          };
      apiService.deleteProject(info).then(result => {
        if (result.data.success) {
          this.$router.push("/newproject");
        }
      });
    },
    editProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            id_project: this.dataProject.dataid,
            name: this.ruleForm1.project_name,
            public: this.ruleForm1.public,
            project_group: this.ruleForm1.project_group
          };
          apiService.editProject(info).then(result => {
            if (result.data.success) {
              this.alertEdit = !this.alertEdit;
              this.isEditing = !this.isEditing;
            }
            else {
              this.alertEditError = !this.alertEditError;
            }
          });
        }
      });
    },
    addUser(info) {
      info.id_project = this.dataProject.dataid;
      apiService.addUser(info).then(result => {
        if (result.data.success) {
          this.alertAdd = !this.alertAdd;
        } else {
          this.alertAddError = !this.alertAddError;
        }
      });
    },
    switchEdit() {
      this.editing = !this.editing;
    }
  }
};
</script>
<style>
.view {
  border-color: transparent;
  background-color: initial;
  color: initial;
}
</style>
