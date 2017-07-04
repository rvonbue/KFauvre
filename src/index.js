require("expose-loader?$!jquery");

import stylesheet from "./styles/index.less";
import EnneagramTypeTest from "./js/EnneagramTypeTest";
require("jquery-ui");  //jquery add-on

$(function () {
  let enneagramTypeTestEl = $("#enneagram-type-test");
  let children = enneagramTypeTestEl.children();

  if ( children.length > 0 && !enneagramTypeTestEl.children(0).hasClass("enneagram-type-test") ) {
    let typeTest = new EnneagramTypeTest({});
    enneagramTypeTestEl.empty().append(typeTest.render().el);
  }
  console.log("All Inputs", $("input"));
});
