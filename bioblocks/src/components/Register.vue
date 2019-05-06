<template>
  <div class="login-form" style="margin-top: 5%;">
    <div class="login-border">
      <h2>Register</h2>
      <div class="login-width">
        <el-form
          :model="ruleForm1"
          status-icon
          :rules="rules1"
          ref="ruleForm1"
          label-width="120px"
          class="demo-ruleForm1"
          :label-position="labelPosition"
        >
          <el-form-item label="Full name" prop="fullName">
            <el-input v-model="ruleForm1.fullName"></el-input>
          </el-form-item>
          <el-form-item label="Username" prop="username">
            <el-input v-model="ruleForm1.username" placeholder="username"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="ruleForm1.email" placeholder="you@example.com"></el-input>
          </el-form-item>
          <el-form-item label="User type" prop="userType">
            <el-select v-model="ruleForm1.userType">
              <el-option label="Student" value="student"></el-option>
              <el-option label="Professor" value="professor"></el-option>
              <el-option label="Standard" value="standard"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Password" prop="pass">
            <el-input type="password" v-model="ruleForm1.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Confirm" prop="checkPass">
            <el-input type="password" v-model="ruleForm1.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="signUp('ruleForm1')">Sing Up</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <v-snackbar v-model="alert" :timeout="timeout">
      {{ text }}
      <v-btn dark flat @click="alert = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "register",
  props: {
    dataSuccessMessage: {
      type: String
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.ruleForm1.checkPass !== "") {
          callback();
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.ruleForm1.pass) {
        callback(new Error("The inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      alert: false,
      timeout: 0,
      text: "Credentials already existing",
      labelPosition: "top",
      ruleForm1: {
        fullName: "",
        username: "",
        email: "",
        userType: "",
        pass: "",
        checkPass: ""
      },
      rules1: {
        fullName: [
          { required: true, message: "Please input Full name", trigger: "blur" }
        ],
        username: [
          { required: true, message: "Please input Username", trigger: "blur" }
        ],
        userType: [
          { required: true, message: "Please input User type", trigger: "blur" }
        ],
        email: [
          { required: true, message: "Please input Email", trigger: "blur" },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"]
          }
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    signUp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            fullName: this.ruleForm1.fullName,
            username: this.ruleForm1.username,
            password: this.ruleForm1.pass,
            email: this.ruleForm1.email,
            userType: this.ruleForm1.userType
          };
          apiService.signUp(info).then(result => {
            if (result.data.success) {
              this.$router.push("login");
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
