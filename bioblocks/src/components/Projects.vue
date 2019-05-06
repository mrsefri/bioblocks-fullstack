<template>
  <v-app class="appContainer">
    <div>
      <div>
        <h1>Browse all your projects</h1>
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
      projects: []
    };
  },
  mounted() {
    apiService.AllMyProjects().then(result => {
      for (var i = 0; i < result.data.length; i += 3) {
        var threeItems = [];
        for (var n = 0; n < 3; n++)
          if (result.data[i + n] != null) threeItems.push(result.data[i + n]);
        this.projects.push(threeItems);
      }
    });
  },
  methods: {}
};
</script>