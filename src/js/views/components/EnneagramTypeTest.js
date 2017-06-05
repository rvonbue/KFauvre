import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
let mobile = navigator.userAgent.match(/mobile/i);
import directionsHTML from "../html/enneagramTypeTest.html";
import groupStatements from "../../data/groupStatements";
let resultsHTML = require('../html/results.html');
let buttonContainerHTML = require('../html/buttonContainer.html');

let EnneagramTypeTest = BaseView.extend({
  className: "enneagram-type-test",
  titleTemplate: _.template("<h3 class='group-title'><strong><%= title %>:</strong> From the three statements below choose the sentence with which you most identify.</h3>"),
  statementTemplate: _.template("<li data-tritype='<%= tritype %>' class='statement'><div class='number'><%= indexNum %></div><div class='li-body'><%= text %></div></li>"),
  events: function () {
    return mobile ?
    {
      "touchend .next-quiz": 'clickNextStatement',
      "touchend .start-quiz": "startQuiz"
    } :
    {
      "click .next-quiz": "clickNextStatement",
      "click .start-quiz": "startQuiz",
      "click .reset-quiz": "resetQuiz"
    }
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.groupStatementEl = $("<div class='group-statement'></div>");
    this.groupStatementListEl = $("<ol id='sortable-list' class='group-statements'></ol>");
    this.bottomContainerEl = $("<div class='bottom-container start'></div>");
  },

  clickNextStatement: function (evt) {
    // let self = this;
    let index = $(evt.currentTarget).index(".statement") + 1;
    let val = (this.groupStatementIndex * 3) + index;

    this.collectTestResults(this.testResults);
    if ( this.groupStatementIndex < groupStatements.length - 1 ) {
      this.groupStatementEl.addClass("hide").empty();
      this.groupStatementListEl.empty();
      this.groupStatementIndex++;
      this.loadNewGroup();
      this.groupStatementEl.removeClass("hide");
    } else {
       this.groupStatementEl.empty();
       this.groupStatementListEl.empty();
       this.showResults();
    }
  },
  collectTestResults: function (testResults) {
    // this.testResults[this.groupStatementIndex] = val;
    var groupResults = [];
    this.groupStatementListEl.children("li").each(function (i, el) {
      groupResults.push({ tritype:$(el).data("tritype"),  rank: i + 1 });
    });
    testResults.push(groupResults);
  },
  startQuiz: function () {
    this.resetQuizVariables();
    this.$el.find(".start-quiz").hide();
    this.bottomContainerEl.removeClass("start").addClass("next");
    this.loadNewGroup();
    this.$el.find(".instructions-container").addClass("hide");
  },
  resetQuizVariables: function () {
    this.groupStatementIndex = 0;
    this.testResults = [];
    // this.selectedStatementEls = [];
  },
  resetQuiz: function () {
    this.resetQuizVariables();
    this.groupStatementEl.empty();
    this.startQuiz();
  },
  addSelectedEl: function (el) {
    el.attr("class", "statement-results");
    this.selectedStatementEls.push(el);
  },
  getTableResults: function () {
    return resultsHTML({ a:this.testResults[0][0].tritype, b:this.testResults[1][0].tritype, c: this.testResults[2][0].tritype });
  },
  showResults: function () {
    let table = this.getTableResults();
    this.groupStatementEl.append(this.selectedStatementEls);
    this.groupStatementEl.append(table);
  },
  toggleSidebar: function () {
    eventController.trigger( eventController.TOGGLE_SIDEBAR_VISIBILITY);
  },
  loadNewGroup: function () {
    let index = this.groupStatementIndex;
    this.loadNewGroupIntro(index);
    this.loadGroupStatements(index);
  },
  updateStatementNumbers: function () {
    let num = 1;
    this.groupStatementListEl.children(":not(.ui-sortable-placeholder)").each(function (i, el) {
      let index =  $(el).index("li");
      let numberDiv = $(el).find(".number").text(num);
      num++;
      console.log("EL:", $(el).find(".li-body").text() );
      console.log("index:", index );
    });
  },
  loadNewGroupIntro: function (index) {
    this.groupStatementEl.append(this.titleTemplate(groupStatements[index]));
  },
  loadGroupStatements: function (index) {

    _.each(groupStatements[index].statements, function (text, i) {
      this.groupStatementListEl.append(this.statementTemplate({ text: text, indexNum: i + 1, tritype: (index * 3) + i + 1 }));
    }, this);

    this.groupStatementEl.append(this.groupStatementListEl);
    this.groupStatementListEl.sortable({
      stop: _.bind(this.updateStatementNumbers, this)
    }, this);
  },
  // addGroupStatements: function () {
  //   let html = "";
  //   _.each(groupStatements, function (obj, index) {
  //     html += this.addGroupStatement(index);
  //   }, this);
  //
  //   return html;
  // },
  render: function () {
    let bodyContainerEl = $("<div class='enneagram-body-container'</div>");
        bodyContainerEl.append(directionsHTML);
        bodyContainerEl.append(this.groupStatementEl);

    this.bottomContainerEl.append(buttonContainerHTML);
    bodyContainerEl.append(this.bottomContainerEl);

    this.$el.append(bodyContainerEl);
    return this;
  }
});
module.exports = EnneagramTypeTest;
