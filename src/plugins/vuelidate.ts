import Vue from 'vue';
import Vuelidate from 'vuelidate';
import { Component } from 'vue-property-decorator';

Component.registerHooks(['validations']);

Vue.use(Vuelidate);
