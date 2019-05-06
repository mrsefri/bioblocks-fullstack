<template>
  <v-app>
    <div class="login-form" style="padding-top: 2%">
      <div class="login-border" style="display: block; margin-left: auto; margin-right: auto;">
        <h2>Login</h2>
        <div class="login-width">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules3"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
            :label-position="labelPosition"
          >
            <el-form-item label="Username or Email" prop="name">
              <el-input v-model="ruleForm.name" @keyup.enter.native="signIn('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off" @keyup.enter.native="signIn('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="signIn('ruleForm')">Sing In</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-log-reg" style="padding-left: 0px">
        <a>
          <router-link :to="{ name: 'register' }">Create an account</router-link>
        </a>
      </div>
      <v-snackbar v-model="alert" :timeout="timeout">
        {{ text }}
        <v-btn dark flat @click="alert = false">Close</v-btn>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "login",
  props: {
    dataSuccessMessage: {
      type: String
    }
  },
  data() {
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        callback();
      }
    };
    return {
      alert: false,
      timeout: 0,
      text: "Incorrect username/password",
      labelPosition: "top",
      ruleForm: {
        name: "",
        pass: ""
      },
      rules3: {
        name: [
          {
            required: true,
            message: "Please input Username or Email",
            trigger: "blur"
          }
        ],
        pass: [{ validator: validatePass3, trigger: "blur" }]
      }
    };
  },
  methods: {
    signIn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            username: this.ruleForm.name,
            password: this.ruleForm.pass
          }
          apiService.signIn(info).then(result => {
            if (result.data.success) {
              this.$router.go("/profile");
            } else if (!this.alert) {
              this.alert = !this.alert;
            }
          });
        }
      });
    }
  }
};
</script>
