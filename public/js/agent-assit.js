import {
  authenticateGenesysCloud,
  createTranscriptUIElement,
  getAttributes,
  getKnowledgeAssistConfig,
  renderUIModules,
} from './agent-assist-utils.js';

window.addEventListener('load', function () {
  const UI_MODULES_EL_SELECTOR = 'agent-assist-ui-modules';

  const mainContainer = document.getElementById('main');
  const loader = document.getElementById('loader');
  const translationContainer = this.document.getElementById(
    'translation-container'
  );
  const sentimentAnalysisContainer =
    this.document.getElementById('status-container');
  const toggleButtonContainer = this.document.getElementById(
    'toggle-btn-container'
  );
  const uiModulesContainer = document.querySelector('.ui-modules-container');

  let accessToken = '';
  let firstTimeLoad = false;
  let existingUiModulesEl = document.querySelector(UI_MODULES_EL_SELECTOR);

  function createUIElement(accessToken) {
    if (existingUiModulesEl) {
      existingUiModulesEl.setAttribute('auth-token', accessToken);
    } else {
      var uiModulesEl = document.createElement(UI_MODULES_EL_SELECTOR);
      var attributes = getAttributes(accessToken);
      for (var [attribute, value] of attributes) {
        uiModulesEl.setAttribute(attribute, value);
      }
      uiModulesEl.config = getKnowledgeAssistConfig();
      uiModulesContainer.appendChild(uiModulesEl);

      renderUIModules();
    }

    if (accessToken) {
      mainContainer.style.display = 'flex';
      loader.style.display = 'none';

      translationContainer.style.visibility = 'visible';
      sentimentAnalysisContainer.style.visibility = 'visible';
      toggleButtonContainer.style.visibility = 'visible';
    }
  }

  /** When the first time UI module load, parse an empty token */
  if (!existingUiModulesEl && !accessToken) {
    createUIElement(accessToken);
    createTranscriptUIElement();
  }

  // /** After the genesys OAuth, get the access token */
  addAgentAssistEventListener(
    'genesys-cloud-connector-access-token-received',
    function (event) {
      const genesysCloudAccessToken = event.detail.accessToken;

      authenticateGenesysCloud(genesysCloudAccessToken)
        .then(function (result) {
          if (result.status !== 200) {
            document.body.removeChild(existingUiModulesEl);
          }
          return result.json();
        })
        .then(function (response) {
          existingUiModulesEl = document.querySelector(UI_MODULES_EL_SELECTOR);
          // If there is unauthenticated existingUIModule,
          // the accessToken will be undefined
          // Set the accessToken to the existingUIModule
          firstTimeLoad = existingUiModulesEl && !accessToken;
          if (firstTimeLoad) {
            accessToken = response.token;
            createUIElement(accessToken);
          }
        });
    }
  );
});
