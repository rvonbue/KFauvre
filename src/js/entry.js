var view;

import $ from 'jquery';
window.$ = $;
window.jQuery = $;

import _ from "underscore";
window._ = _;

import Backbone from "backbone";
Backbone.$ = $;
window.Backbone = Backbone;
import Radio from "backbone.radio";
Backbone.Radio = Radio;

import eventController from "./controllers/eventController";
import commandController from "./controllers/commandController";
import AppView from "./views/AppView";
import stylesheet from "../styles/index.less";

$(function () {
  view = new AppView({});
  $("body").append(view.render().el);

  window.eventController = eventController;
  window.commandController = commandController;

});
