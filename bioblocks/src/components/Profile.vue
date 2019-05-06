<template>
  <v-app class="appContainer">
    <div>
      <v-container fluid>
        <v-layout column style="margin-top:10%;">
          <v-flex xs12>
            <div class="resultContainer">
              <div
                style="margin: 0 auto; border-bottom: 1px solid #193157; height: 20px; text-align: center"
              >
                <span
                  style="font-size: 25px; color: #193157; padding: 0 10px; background-color: white;"
                >My recent projects</span>
              </div>
              <v-layout align-center justify-center row style="margin: 0 auto;">
                <div
                  class="homeItem elevation-5"
                  v-for="project in projects"
                  :key="project.id_project"
                  style="margin: 3%; border-radius: 5px;"
                >
                  <div class="layoutContainer"></div>
                  <div class="layoutInfo">
                    <h3 style="padding-bottom: 4%;">
                      <a
                        style="color:#373b44; text-decoration: none;"
                        :href="'/project/' + project.id_project"
                      >{{ project.name }}</a>
                    </h3>
                    <p style="font-size:12px; color: #8c919b;">by <span style="color: rgb(103, 194, 58);">{{ project.owner }}</span></p>
                  </div>
                </div>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid>
        <v-layout column>
          <v-flex xs12>
            <div class="resultContainer">
              <div
                style="margin: 0 auto; border-bottom: 1px solid #193157; height: 20px; text-align: center"
              >
                <span
                  style="font-size: 25px; color: #193157; padding: 0 10px; background-color: white;"
                >My recent groups</span>
              </div>
              <v-layout align-center justify-center row style="margin: 0 auto;">
                <div
                  class="homeItem elevation-5"
                  v-for="group in groups"
                  :key="group.id_group"
                  style="margin: 3%; border-radius: 5px;"
                >
                <div class="layoutContainer"></div>
                  <div class="layoutInfo">
                    <h3 style="padding-bottom: 4%;">
                      <a
                        style="color:#373b44; text-decoration: none;"
                        :href="'/group/' + group.id_group"
                      >{{ group.name }}</a>
                    </h3>
                  </div>
                </div>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { APIService } from "../APIService";
const apiService = new APIService();

export default {
  name: "login",
  data() {
    return {
      projects: [],
      groups: []
    };
  },
  mounted() {
    apiService.MyHomeProjects().then(result => {
      this.projects = result.data;
    });
    apiService.MyHomeGroups().then(result => {
      this.groups = result.data;
    });
  },
  methods: {}
};
</script>
