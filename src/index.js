require("expose-loader?$!jquery");

import _ from 'lodash';
import stylesheet from "./styles/index.less";
import EnneagramTypeTest from "./js/EnneagramTypeTest";
import touchPunch from  "jquery-ui-touch-punch";
require("jquery-ui");  //jquery add-on

let headerHTML = require("./html/header.html");
let navListHTML = require("./html/navlist.html");

$(function () {
  let typeTest = new EnneagramTypeTest({});
  $("#enneagram-type-test").empty().append(typeTest.render().el);
//   console.log("Can find El on Page", $("#enneagram-type-test").length);
});
