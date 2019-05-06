<template>
  <v-app id="app">
    <v-toolbar dark fixed color="#193157" v-if="LoggedIn" style="padding-left: 0;">
      <div style="position: relative; left: -24px; height: 64px; width: 64px; background: #67C23A">
        <v-dialog v-model="dialog" width="640">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" style="margin-top:13px;">
              <v-icon>apps</v-icon>
            </v-btn>
          </template>
          <v-card style="height:400px; background-image: url('/img/new.jpg');">
            <v-container fluid>
              <v-layout column>
                <v-flex xs12>
                  <div class="homeContainer">
                    <v-layout align-center justify-center row>
                      <v-tab :to="'/newproject'" @click="dialog = false">
                        <div class="homeItem elevation-5" style="margin: 1%;">
                          <h1 style="margin-top:30%; color:black;">Create project</h1>
                        </div>
                      </v-tab>
                      <v-tab v-if="!isStudent" :to="'/newgroup'" @click="dialog = false">
                        <div class="homeItem elevation-5" style="margin: 1%;">
                          <h1 style="margin-top:30%; color:black;">Create group</h1>
                        </div>
                      </v-tab>
                    </v-layout>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-dialog>
      </div>

      <v-toolbar-title>
        <v-list-tile :to="items[0].path">
          <div class="white--text" style="font-size: 22px;">Bioblocks</div>
        </v-list-tile>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <el-row style="width:30%;">
        <el-col :span="22">
          <v-text-field
            @keyup.enter.native="searchProject()"
            type="text"
            color="#000"
            placeholder="Search a project"
            clearable
            v-model="searchQuery"
          ></v-text-field>
        </el-col>
        <el-col :span="2">
          <v-btn
            @click="searchProject()"
            type="success"
            class="white--text"
            color="#193157"
            style="box-shadow: unset;"
          >
            <v-icon>search</v-icon>
          </v-btn>
        </el-col>
      </el-row>
      <v-spacer></v-spacer>

      <v-menu :nudge-width="100" offset-y>
        <template v-slot:activator="{ on }">
          <v-toolbar-title v-on="on">
            <v-btn icon>
              <v-icon>account_circle</v-icon>
            </v-btn>
          </v-toolbar-title>
        </template>
        <v-list>
          <v-list-tile>
            <v-list-tile-title v-text="name"></v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile v-for="item in items" :key="item.title" :to="item.path">
            <v-list-tile-title>
              <div class="menu-items">{{ item.title }}</div>
            </v-list-tile-title>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile :key="logout.title" @click="logOut()">
            <v-list-tile-title>
              <div class="menu-items">{{ logout.title }}</div>
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-content
      transition="slide-x-transition"
    >
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>

<script>
import { APIService } from "./APIService";
const apiService = new APIService();

export default {
  name: "app",
  data() {
    return {
      LoggedIn: "",
      isStudent: "",
      name: "",
      searchQuery: "",
      items: [
        { title: "Profile", path: "/profile" },
        { title: "Projects", path: "/projects" },
        { title: "Groups", path: "/groups" }
      ],
      logout: { title: "Logout" },
      dialog: false
    };
  },
  mounted() {
    apiService.isLoggedIn().then(result => {
      this.LoggedIn = result.data.success;
      this.isStudent = result.data.type == 'student';
      this.name = "@" + result.data.name;
    });
  },
  methods: {
    logOut() {
      apiService.logOut().then(result => {
        if (result.data.success) this.$router.go("/");
      });
    },
    searchProject() {
      if (this.searchQuery) {
        this.$router.push({
          name: "searchprojects",
          query: { q: this.searchQuery }
        });
      }
    }
  }
};
</script>

<style>
/*#app {
font-family: "Avenir", Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
}*/
#app {
  background-color: white;
}

.container {
  max-width: 300px;
  margin: 0 auto;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /*font-size: 24px;*/
  height: 100vh;
  text-align: center;
}
.flex-center {
  display: flex;
  justify-content: center;
}
.menu-items {
  font-weight: bold;
  color: #2c3e50;
}
.nav ul {
  display: flex;
  list-style: none;
  padding: 15px 0;
  margin: 0;
  background: #ffffff;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 24px;
}

.nav a {
  color: #636b6f;
  padding: 0 25px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-decoration: none;
  text-transform: uppercase;
}
.form-log-reg {
  padding-top: 20px;
  padding-left: 60px;
}
.form-log-reg a {
  margin: 0;
  padding: 0;
  border: 0;
  color: #606266;
  font-size: inherit;
  line-height: inherit;
  text-decoration: none;
}
.form-log-reg a:hover {
  text-decoration: underline;
}

/*logo*/
.nav-logo {
  display: inline-block;
  margin-left: -36rem;
  width: 70px;
}
.nav-logo img {
  display: block;
  width: 200%;
  height: auto;
  margin-left: -36rem;
}
/* Auth Pages*/
.login-border {
  margin: auto;
  background: transparent;
  position: relative;
  border-radius: 0.4em;
  width: 300px;
  padding-top: 3px;
}
.login-width {
  width: 230px;
  margin: 0 auto;
  display: block;
}
.form-margin {
  margin-bottom: 11px;
}
/*LandingPage.vue*/
.landing-page {
  height: 60%;
  background-image: url("/img/lab.png");
}
.landing-page h1 {
  color: white;
  font-size: 5rem;
  line-height: 1.1;
  max-width: 35%;
  font-weight: 700;
  margin-left: 25%;
  text-align: left;
  padding-top: 30px;
  padding-bottom: 20px;
}
.landing-text-big {
  max-width: 35%;
  margin-left: 25%;
  display: block;
  text-align: left;
  padding-bottom: 20px;
  color: white;
  font-size: 1.25rem;
}
.landing-text-headers {
  display: block;
  text-align: center;
  padding-bottom: 10px;
  color:#192440;
  font-size: 1.5rem;
}
/*Profile.vue*/
.resultContainer {
  height: 300px;
}
.item {
  min-height: 200px;
  min-width: 300px;
  margin: 10px;
}
.homeContainer {
  margin-top: 10%;
  height: 290px;
}
.homeItem {
  height: 230px;
  width: 250px;
  margin: 5%;
  padding-bottom: 15px;
  text-align: center;
  background-color: white;
}
/*New project/group*/
.newform {
  margin: auto;
  background-color: #ffffff;
  position: relative;
  border-radius: 0.1em;
  width: 35%;
  height: 350px;
  padding: 3%;
}
.appContainer {
  margin: 0 auto;
  width: 60%;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter, .fade-leave-to
/* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.layoutContainer {
  background: #dadada;
  height: 70%;

}
.layoutInfo {
  text-align: left;
  padding: 5%;
}
</style>
