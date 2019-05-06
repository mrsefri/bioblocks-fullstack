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
      <el-form-item prop="project_name">
        <el-input
          v-model="ruleForm1.project_name"
          placeholder="Name of the project"
          @keyup.enter.native="create('ruleForm1')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="ruleForm1.public" label="Public project" name="type"></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="successB" @click="create('ruleForm1')">Create project</el-button>
      </el-form-item>
    </el-form>
  </v-app>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "newproject",
  checkbox: false,
  data() {
    return {
      ruleForm1: {
        project_name: "",
        public: "",
        xml_file: ""
      },
      namesRules: {
        project_name: [
          {
            required: true,
            message: "Name is required",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    if (this.$route.params.xml_file != undefined) {
      this.ruleForm1.xml_file = this.$route.params.xml_file;
    }
  },
  methods: {
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            project_name: this.ruleForm1.project_name,
            public: this.ruleForm1.public,
            xml_file: this.ruleForm1.xml_file
          };
          apiService.newProject(info).then(result => {
            if (result.data.success) {
              this.$router.push({
                name: "project",
                params: { id: result.data.uri }
              });
            }
          });
        }
      });
    }
  }
};
</script>
