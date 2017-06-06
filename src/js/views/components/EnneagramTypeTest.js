import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
let mobile = navigator.userAgent.match(/mobile/i);
import directionsHTML from "../html/enneagramTypeTest.html";
import groupStatements from "../../data/groupStatements";
let resultsHTML = require('../html/results.html');
let buttonContainerHTML = require('../html/buttonContainer.html');

let EnneagramTypeTest = BaseView.extend({
  className: "enneagram-type-test",
  titleTemplate: _.template("<h3 class='group-title'><strong><%= title %>:</strong> Rank the three statements below.</h3>"),
  statementTemplate: _.template("<li data-tritype='<%= tritype %>' class='statement'><div class='number'><%= indexNum %></div><div class='li-body'><%= text %></div></li>"),
  events: function () {
    return mobile ?
    {
      "touchend .next-quiz": 'clickNextStatement',
      "touchend .start-quiz": "startQuiz",
      "touchend .reset-quiz": "resetQuiz"
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
    let groupResults = [];
    this.groupStatementListEl.children("li").each(function (i, el) {
      groupResults.push({ tritype:$(el).data("tritype"),  rank: i + 1 });
    });
    testResults.push(groupResults);
  },
  startQuiz: function () {
    this.resetQuizVariables();
    this.bottomContainerEl.removeClass("start").addClass("next");
    this.loadNewGroup();
    this.$el.find(".instructions-container").addClass("hide");
  },
  resetQuizVariables: function () {
    this.groupStatementIndex = 0;
    this.testResults = [];
  },
  resetQuiz: function () {
    this.groupStatementEl.empty();
    this.$el.find(".instructions-container").removeClass("hide");
    this.bottomContainerEl.attr("class", "bottom-container start");
  },
  addSelectedEl: function (el) {
    el.attr("class", "statement-results");
    this.selectedStatementEls.push(el);
  },
  getTableResults: function () {
    return resultsHTML(this.getTestResults());
  },
  calcGroupResults: function (arr) {
    let text = "";
    _.each(arr, function (item) {
      text += item.tritype + ", ";
    });

    return text;
  },
  getTestResults: function () {
    let a = [this.testResults[0][0].tritype, this.calcGroupResults(this.testResults[0])];
    let b = [this.testResults[1][0].tritype, this.calcGroupResults(this.testResults[1])];
    let c = [this.testResults[2][0].tritype, this.calcGroupResults(this.testResults[2])];

    return { a: a, b: b, c: c };
  },
  showResults: function () {
    let table = this.getTableResults();
    this.bottomContainerEl.removeClass("start next").addClass("reset");
    this.groupStatementEl.append(this.selectedStatementEls);
    this.groupStatementEl.append(table);
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
