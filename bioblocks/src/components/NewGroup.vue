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
          placeholder="Name of the group"
          @keyup.enter.native="create('ruleForm1')"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="successB" @click="create('ruleForm1')">Create group</el-button>
      </el-form-item>
    </el-form>
  </v-app>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "newgroup",
  checkbox: false,
  data() {
    return {
      valid: true,
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
      }
    };
  },
  methods: {
    create(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            group_name: this.ruleForm1.group_name
          };
          apiService.newGroup(info).then(result => {
            if (result.data.success) {
              this.$router.push({
                name: "group",
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
