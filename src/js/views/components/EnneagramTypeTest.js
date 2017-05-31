import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
var mobile = navigator.userAgent.match(/mobile/i);
import directionsHTML from "../html/enneagramTypeTest.html";
import resultsHTML from "../html/enneagramTypeTestResults.html";
import groupStatements from "../../data/groupStatements";
var resultsHTML2 = require('../html/enneagramTypeTestResults.html');


var EnneagramTypeTest = BaseView.extend({
  className: "enneagram-type-test",
  titleTemplate: _.template("<h3 class='group-title'><strong><%= title %>:</strong> From the three statements below choose the sentence with which you most identify.</h3>"),
  statementTemplate: _.template("<div class='statement'><%= text %></div>"),
  events: function () {
    return mobile ?
    {
      "touchend .statement": 'clickStatement',
      "touchend .start-quiz": "startQuiz"
    } :
    {
      "click .statement": "clickStatement",
      "click .start-quiz": "startQuiz"
    }
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.groupStatementIndex = 0;
    this.groupStatementEl = $("<div class='group-statement'></div>");
    this.testResults = {};
  },
  clickStatement: function (evt) {
    var self = this;
    var index = $(evt.currentTarget).index(".statement") + 1;
    var val = (this.groupStatementIndex * 3) + index;
    this.testResults[this.groupStatementIndex] = val;
    this.groupStatementEl.addClass("hide");

    setTimeout(function () {
      self.groupStatementEl.empty().removeClass("hide");
      if ( self.groupStatementIndex > groupStatements.length - 2 ) {
        self.showResults();
      } else {
        self.groupStatementIndex++;
        self.groupStatementEl.append(self.addGroupStatement());
      }
    }, 500);
  },
  startQuiz: function () {
    this.$el.find(".start-quiz").hide();
    this.groupStatementEl.append(this.addGroupStatement());
  },
  getTableResults: function () {
    return resultsHTML2({ a:this.testResults[0], b:this.testResults[1], c: this.testResults[2] });
  },
  showResults: function () {
    var table = this.getTableResults();
    // console.log("TABLE", resultsHTML2);
    this.groupStatementEl.append(table);
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

    bodyContainerEl.append("<div class='start-quiz'>Start Quiz</div>");

    this.$el.append(bodyContainerEl);
    return this;
  }
});
module.exports = EnneagramTypeTest;
