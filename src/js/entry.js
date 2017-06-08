var view;

// import $ from 'jquery';
// window.$ = $;
// window.jQuery = $;

import _ from "underscore";
window._ = _;

import Backbone from "backbone";
// Backbone.$ = $;
window.Backbone = Backbone;
require("jquery-ui");

import AppView from "./views/AppView";
import stylesheet from "../styles/index.less";
// import jQueryUi from "jquery-ui";
import touchPunch from  "jquery-ui-touch-punch";

$(function () {
  view = new AppView({});
  $("#enneagram-type-test").append(view.render().el);
  console.log("Can find El on Page", $("#enneagram-type-test").length);
});
