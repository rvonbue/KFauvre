import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
// import SidebarView from "./components/SidebarView";
// import PhotoSwipeView from "./components/PhotoSwipeView";
import headerHTML from "./html/header.html";
import navListHTML from "./html/navlist.html";
import EnneagramTypeTest from "./components/EnneagramTypeTest";

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
    // this.$el.append(navListHTML);
    this.$el.append(new EnneagramTypeTest().render().el);
    return this;
  }
});

module.exports = AppView;
