import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
var mobile = navigator.userAgent.match(/mobile/i);
import directionsHTML from "../html/enneagramTypeTest.html";
import groupStatements from "../../data/groupStatements";

var EnneagramTypeTest = BaseView.extend({
  className: "enneagram-type-test",
  titleTemplate: _.template("<div class='group-title'><strong><%= title %>:</strong> From the three statements below choose the sentence with which you most identify.</div>"),
  statementTemplate: _.template("<div class='statement'><%= text %></div>"),
  events: function () {
    return mobile ?
    {
      "tap": 'touchstart'
    } :
    {
      "click .sidebar-click-catcher": "toggleSidebar"
    }
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.groupStatementIndex = 0;
    this.groupStatementEl = $("<div class='group-statement'></div>");
  },
  touchstart: function () {
    console.log("touchstart");
  },
  toggleSidebar: function () {
    eventController.trigger( eventController.TOGGLE_SIDEBAR_VISIBILITY);
  },
  addGroupStatement: function (i) {
    var index = i ? i : this.groupStatementIndex;
    var html = "";
        html += this.titleTemplate(groupStatements[index]);

    _.each(groupStatements[index].statements, function (text) {
      var textStatement = { text: text };
      html += this.statementTemplate(textStatement);
    }, this);

    return html;
  },
  addGroupStatements: function () {
    var html = "";
    _.each(groupStatements, function (obj, index) {
      html += this.addGroupStatement(index);
    }, this);

    return html;
  },
  render: function () {
    var bodyContainerEl = $("<div class='enneagram-body-container'</div>");
        bodyContainerEl.append(directionsHTML);
        bodyContainerEl.append(this.groupStatementEl);

    this.groupStatementEl.append(this.addGroupStatement());

    this.$el.append(bodyContainerEl);
    return this;
  }
});
module.exports = EnneagramTypeTest;
