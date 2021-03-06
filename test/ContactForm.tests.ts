import { ContactForm } from "../src/ContactForm"
import { XrmFakedContext, Entity } from "fakexrmeasy";
import { XrmMockGenerator, XrmStaticMock, LookupAttributeMock, LookupValueMock } from "xrm-mock";

var WebApiClient = require('../src/new_WebApiClient.ts');
var fakeUrl: string = 'http://fakeUrl';
var Guid = require('guid');

describe("Contact", () => {
  let context: XrmFakedContext = null;
  let accountId = Guid.create();

  beforeEach(() => {
    XrmMockGenerator.initialise({});
    XrmMockGenerator.Attribute.createLookup("parentcustomerid", new LookupValueMock("{" + accountId.toString() + "}", "account"))
    XrmMockGenerator.Tab.createTab("tab_bigcompany", "Big Company Account Details", false);
    XrmMockGenerator.Tab.createTab("tab_smallcompany", "Small Company Account Details", false);

    Xrm.Page.context.getClientUrl = function() {
        return fakeUrl;
    };
    context = new XrmFakedContext("v9.0",fakeUrl, true);
  });

  it("should set Small company details tab to visible if contact belongs to a small company", done => {
    context.initialize([
      new Entity("account", accountId, {name: 'Dynamics Value SL', dv_isbigcompany: false})
    ]);

    var formContext = XrmMockGenerator.getFormContext();

    ContactForm.showHideTabsBasedOnCompany(formContext, function(success) {
      var tab = formContext.ui.tabs.get("tab_smallcompany");
      expect(tab.getVisible()).toBe(true); 
      done();
    });
  });

  it("should set Big company details tab to visible if contact belongs to a big company", done => {
    context.initialize([
      new Entity("account", accountId, {name: 'Microsoft', dv_isbigcompany: true})
    ]);

    var formContext = XrmMockGenerator.getFormContext();

    ContactForm.showHideTabsBasedOnCompany(formContext, function(success) {
      var tab = formContext.ui.tabs.get("tab_bigcompany");
      expect(tab.getVisible()).toBe(true); 
      done();
    });
  });
});