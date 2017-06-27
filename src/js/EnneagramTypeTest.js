import directionsHTML from "../html/enneagramTypeTest.html";
import groupStatements from "./data/groupStatements";
import extNavList from "./data/externalNavList";
import Backbone from "Backbone";

let questionnaireHTML = require("../html/questionnaire.html");
let buttonContainerHTML = require('../html/buttonContainer.html');
let resultsHTML = require('../html/resultsTable.html');
// let formHTML = require('../html/form.html');
let mobile = navigator.userAgent.match(/mobile/i);

let EnneagramTypeTest = Backbone.View.extend({
  className: "enneagram-type-test",
  titleTemplate: _.template("<h3 class='group-title'><strong><%= title %>:</strong> <%= text %></h3>"),
  statementTemplate: _.template("<li data-tritype='<%= tritype %>' class='statement'><div class='number'><span><%= indexNum %></span></div><div class='li-body'><%= text %></div></li>"),
  events:
    {
      "click .next-quiz": "clickNextStatement",
      "click .start-quiz": "startQuiz",
      "click .reset-quiz": "resetQuiz",
      "click .show-results": "clickShowResults",
      "click .statement.final": "selectFinalType"
  },
  initialize: function () {
    this.groupStatementEl = $("<div class='group-statement'></div>");
    this.groupStatementListEl = $("<ol id='sortable-list' class='group-statements'></ol>");
    this.bottomContainerEl = $("<div class='bottom-container start'></div>");
  },

  clickNextStatement: function (evt) {
    let index = $(evt.currentTarget).index(".statement") + 1;
    let val = (this.groupStatementIndex * 3) + index;

    this.collectTestResults(this.testResults);
    this.groupStatementEl.addClass("hide").empty();
    this.groupStatementListEl.empty();

    if ( this.groupStatementIndex < groupStatements.length - 1 ) {
      this.groupStatementIndex++;
      this.loadNewGroup();
    } else {
      this.loadLastGroup();
    }

    this.groupStatementEl.removeClass("hide");
  },
  collectTestResults: function (testResults) {
    let groupResults = [];
    let self = this;

    this.groupStatementListEl.children("li").each(function (i, el) {
      var el = $(el);
      if ( i === 0 ) self.selectedTritypes.push(el);
      groupResults.push({ tritype: el.data("tritype"),  rank: i + 1 });
    });
    testResults.push(groupResults);
  },
  startQuiz: function () {
    this.$el.find("#questionnaire").hide();
    this.resetQuizVariables();
    this.bottomContainerEl.removeClass("start").addClass("next");
    this.loadNewGroup();
    this.$el.find(".instructions-container").addClass("hide");
  },
  resetQuizVariables: function () {
    this.groupStatementIndex = 0;
    this.testResults = [];
    this.selectedTritypes = [];
  },
  resetQuiz: function () {
    this.groupStatementEl.empty();
    this.$el.find(".instructions-container").removeClass("hide");
    this.bottomContainerEl.attr("class", "bottom-container start");
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
    extNavList.unshift(window.location.origin);

    let a = [this.testResults[0][0].tritype, this.calcGroupResults(this.testResults[0])];
    let b = [this.testResults[1][0].tritype, this.calcGroupResults(this.testResults[1])];
    let c = [this.testResults[2][0].tritype, this.calcGroupResults(this.testResults[2])];
    return { a: a, b: b, c: c , leadType: this.testResults[3], extNavList: extNavList };
  },
  clickShowResults: function () {
    this.groupStatementEl.empty();
    this.groupStatementListEl.empty();
    this.showResults();
  },
  showResults: function () {
    let table = this.getTableResults();
    let self = this;
    this.bottomContainerEl.attr("class",  "bottom-container reset");

    _.each(this.selectedTritypes, function (i, el) {
      self.groupStatementListEl.append(el);
    }, this);
    this.groupStatementEl.append(table);
    this.onSubmitForm();
  },
  selectFinalType: function (evt) {
    let selectedEl = this.groupStatementListEl.find("li.selected");
    let selectedType = $(evt.currentTarget).data("tritype");

    if (selectedEl) selectedEl.removeClass("selected");
    $(evt.currentTarget).addClass("selected");
    this.bottomContainerEl.addClass("results");
    this.testResults.push(selectedType);
  },
  loadNewGroup: function () {
    let index = this.groupStatementIndex;
    this.loadNewGroupIntro(index);
    this.loadGroupStatements(index);
  },
  loadLastGroup: function () {
    this.groupStatementEl.append(this.titleTemplate({ title:"Final", text: "Now select the ONE statement that represents you best" }));
    this.groupStatementListEl.append(this.selectedTritypes);
    _.each(this.selectedTritypes, function (el) {
      el.addClass("final");
    });
    this.groupStatementEl.append(this.groupStatementListEl);
    this.bottomContainerEl.attr("class", "bottom-container");
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
    this.groupStatementEl.append(this.titleTemplate({ title: groupStatements[index].title, text: "Rank these three statements below by dragging and dropping."}));
  },
  loadGroupStatements: function (index) {
    var self = this;

    _.each(groupStatements[index].statements, function (text, i) {
      self.groupStatementListEl.append(self.statementTemplate({ text: text, indexNum: i + 1, tritype: (index * 3) + i + 1 }));
    });

    this.groupStatementEl.append(self.groupStatementListEl);
    this.groupStatementListEl.sortable({
      stop: _.bind(this.updateStatementNumbers, this)
    }, this);
  },
  getFormBodyMessage: function () {
    var testResults = this.getTestResults(); // { a: a, b: b, c: c , leadType: this.testResults[3] };
    return "\n Group A: " + testResults.a + "\n Group B: " + testResults.b + "\n Group C: " + testResults.c + "\n Lead Type: "  + testResults.leadType;
  },
  onSubmitForm: function () {
    this.$el.find(".form-header").val("Enneagram--Type--Test: Results");
    this.$el.find(".form-body").val(this.getFormBodyMessage());
    this.$el.find(':submit').click();
  },
  render: function () {
    this.bottomContainerEl.append(buttonContainerHTML);

    let bodyContainerEl = $("<div class='enneagram-body-container'</div>");
        // bodyContainerEl.append(directionsHTML);
        bodyContainerEl.append(questionnaireHTML);
        bodyContainerEl.append(this.groupStatementEl);
        bodyContainerEl.append(this.bottomContainerEl);

    this.$el.append(bodyContainerEl);
    // this.$el.append(formHTML);
    return this;
  }
});
module.exports = EnneagramTypeTest;
