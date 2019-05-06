<template>
  <div style="height: 100%;">
    <div style="height: 100%;">
      <div class="landing-page">
        <div style="position: relative; top:15%;">
          <h1>A new way to program, easy, simple and intuitive</h1>
          <span
            class="landing-text-big"
            style="position: relative; top:25%;"
          >With Bioblocks you will program with visual blocks, without needing to know code</span>
          <span class="landing-text-big" style="position: relative; margin-top:2%;">
            <el-button class="successB" @click="showCard = !showCard">Try Out!</el-button>
          </span>
        </div>
      </div>
      <v-layout align-center justify-center row style="margin: 0 auto;">
        <div class="homeItem" v-for="i in headers" :key="i" style="margin-top: 2%; margin: 3%;">
          <img :src="i.src" width="50%" height="50%">
          <h1 class="landing-text-headers">{{ i.header }}</h1>
          <span>{{ i.text }}</span>
        </div>
      </v-layout>
    </div>

    <v-dialog v-model="showCard" width="300px">
      <v-card v-if="isLogin" style="background: white;">
        <div class="login-border" style="display: block; margin-left: auto; margin-right: auto;">
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
              <el-form-item label="Username or Email " prop="name">
                <el-input
                  v-model="ruleForm.name"
                  placeholder
                  @keyup.enter.native="signIn('ruleForm')"
                ></el-input>
              </el-form-item>
              <el-form-item label="Password" prop="pass">
                <el-input
                  type="password"
                  v-model="ruleForm.pass"
                  autocomplete="off"
                  @keyup.enter.native="signIn('ruleForm')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="successB" @click="signIn('ruleForm')">Sing In</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-log-reg" style="padding-left: 0px">
          <a @click="isLogin = !isLogin">Create an account</a>
        </div>
      </v-card>

      <v-card v-if="!isLogin" style="background: white;">
        <div class="login-border">
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
                <el-button class="successB" @click="signUp('ruleForm1')">Sing Up</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-log-reg" style="padding-left: 0px">
          <a @click="isLogin = !isLogin">Sign in</a>
        </div>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="alert" :timeout="timeout">{{ text }}</v-snackbar>
    <v-snackbar color="#00d994" v-model="alertCreate" :timeout="timeout">{{ textCreate }}</v-snackbar>
  </div>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "home",
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
    var validatePass3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        callback();
      }
    };
    return {
      headers: [
        {
          src: "/img/man.svg",
          header: "For learners",
          text:
            "Either you are a student or a technology enthusiast, Bioblocks allows you to create experiments with minimal knowledge"
        },
        {
          src: "/img/team.svg",
          header: "Cooperative Work",
          text: "Start working in a project with other people simultaneously"
        },
        {
          src: "/img/presentation.svg",
          header: "Experiment in class",
          text:
            "Create projects for your class. Bioblocks allows students to work on challenges with the teacher supervision"
        }
      ],
      showCard: false,
      isLogin: true,
      alert: false,
      alertCreate: false,
      timeout: 4000,
      text: "Incorrect username/password",
      textCreate: "Account created",
      labelPosition: "top",
      ruleForm: {
        name: "",
        pass: ""
      },
      ruleForm1: {
        fullName: "",
        username: "",
        email: "",
        userType: "",
        pass: "",
        checkPass: ""
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
    signIn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var info = {
            username: this.ruleForm.name,
            password: this.ruleForm.pass
          };
          apiService.signIn(info).then(result => {
            if (result.data.success) {
              this.$router.go("/profile");
            } else if (!this.alert) {
              this.alert = !this.alert;
            }
          });
        }
      });
    },
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
              this.isLogin = !this.isLogin;
            } else if (!this.alert) {
              this.alertCreate = !this.alertCreate;
            }
          });
        }
      });
    }
  }
};
</script>
<style>
.el-button.successB {
  background: #00d994;
  border-color: #00d994;
  border-radius: 20px;
  color: #192440;
  font-weight: bold;
}
.el-button:hover.successB {
  background: #00d994;
  border-color: #00d994;
  color: white;
  font-weight: bold;
}
.el-button.danger {
  background: #f44336;
  border-color: #f44336;
  border-radius: 20px;
  color: #192440;
  font-weight: bold;
}
.el-button:hover.danger {
  background: #f44336;
  border-color: #f44336;
  color: white;
  font-weight: bold;
}
</style>
