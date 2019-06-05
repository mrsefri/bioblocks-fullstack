<template>
  <v-app class="appContainer">
    <div>
      <div>
        <h1>Browse all your groups</h1>
      </div>
      <v-container fluid>
        <v-layout column>
          <v-flex xs12>
            <div class="resultContainer">
              <v-layout
                v-for="threeGroups in groups"
                :key="threeGroups.length"
                align-center
                justify-center
                row
              >
                <div
                  class="homeItem elevation-5"
                  v-for="group in threeGroups"
                  :key="group.id_group"
                  style="margin: 3%; border-radius: 5px;"
                >
                  <div class="layoutContainer"></div>
                  <div class="layoutInfo">
                    <h3 style="padding-bottom: 3%;">
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
      groups: []
    };
  },
  mounted() {
    apiService.AllMyGroups().then(result => {
      for (var i = 0; i < result.data.length; i += 3) {
        var threeItems = [];
        for (var n = 0; n < 3; n++)
          if (result.data[i + n] != null) threeItems.push(result.data[i + n]);
        this.groups.push(threeItems);
      }
    });
  },
  methods: {}
};
</script>
