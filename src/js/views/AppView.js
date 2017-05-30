import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
// import SidebarView from "./components/SidebarView";
import PhotoSwipeView from "./components/PhotoSwipeView";

import utils from "../util/utils";

var AppView = BaseView.extend({
  className: "appview-container",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  toggleSidebar: function () {
    this.$el.toggleClass("sidebar-hide");
  },
  render: function () {
    var photoSwipeView = new PhotoSwipeView({ parentEl: this.$el });
    // this.$el.append(new SidebarView().render().el);
    return this;
  }
});

module.exports = AppView;
