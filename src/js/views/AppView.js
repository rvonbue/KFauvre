import BaseView from "./BaseView";
import EnneagramTypeTest from "./components/EnneagramTypeTest";

let headerHTML = require("./html/header.html");
let navListHTML = require("./html/navlist.html");

import utils from "../util/utils";

var AppView = BaseView.extend({
  className: "body-container",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  toggleSidebar: function () {
    this.$el.toggleClass("sidebar-hide");
  },
  render: function () {
    // this.$el.append(headerHTML);
    this.$el.append(new EnneagramTypeTest().render().el);
    return this;
  }
});

module.exports = AppView;
