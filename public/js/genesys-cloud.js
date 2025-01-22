import { authenticateGenesysCloud } from './utils.js';

window.addEventListener('load', function () {
  const UI_MODULES_EL_SELECTOR = 'agent-assist-ui-modules';
  const TRANSCRIPT_SELECTOR = 'agent-assist-transcript';

  const proxyServerEndPoint = document.body.getAttribute('data-proxy-server');
  const conversationProfile = document.body.getAttribute(
    'data-conversation-profile'
  );
  const features = document.body.getAttribute('data-features');
  const genesysCloudRegion = document.body.getAttribute(
    'data-genesys-cloud-region'
  );
  const clientId = document.body.getAttribute('data-client-id');
  const channel = document.body.getAttribute('data-channel');
  let applicationServer = document.body.getAttribute('data-application-server');
  applicationServer = applicationServer.replace(/\/$/, '');

  let accessToken = '';
  let firstTimeLoad = false;

  const urlParams = new URLSearchParams(window.location.search);
  const currentConversationId = urlParams.get('conversationid');
  const gcHostOrigin = urlParams.get('gcHostOrigin');
  const gcTargetEnv = urlParams.get('gcTargetEnv');
  const redirectUri = `${applicationServer}?conversationProfile=${conversationProfile}&features=${features}`;

  let existingUiModulesEl = document.querySelector(UI_MODULES_EL_SELECTOR);

  const appContainer = document.querySelector('.app-container');
  const uiModulesContainer = document.querySelector('.ui-modules-container');
  const transcriptContainer = document.querySelector('.transcript-container');

  function createTranscriptUIElement() {
    const uiModulesTranscriptEl = document.createElement(TRANSCRIPT_SELECTOR);
    uiModulesTranscriptEl.style.maxHeight = '100%';
    transcriptContainer.appendChild(uiModulesTranscriptEl);
  }

  function createUIElement(accessToken) {
    if (existingUiModulesEl) {
      existingUiModulesEl.setAttribute('auth-token', accessToken);
    } else {
      var uiModulesEl = document.createElement(UI_MODULES_EL_SELECTOR);
      var attributes = getAttributes(channel);
      for (var [attribute, value] of attributes) {
        uiModulesEl.setAttribute(attribute, value);
      }
      uiModulesEl.config = getKnowledgeAssistConfig();
      uiModulesContainer.appendChild(uiModulesEl);
    }
  }

  function getKnowledgeAssistConfig() {
    return {
      knowledgeAssistConfig: {
        articleLinkConfig: {
          target: 'popup',
          popupWindowOptions: 'height=800,width=600,left=600,top=100',
        },
      },
    };
  }

  function getAttributes(channel) {
    var attributes = [
      ['agent-desktop', 'GenesysCloud'],
      ['features', features],
      ['conversation-profile', conversationProfile],
      ['auth-token', accessToken],
      ['use-custom-conversation-id', 'true'],
      ['oauth-client-id', clientId],
      ['redirect-uri', redirectUri],
      ['custom-api-endpoint', proxyServerEndPoint],
      ['genesys-cloud-region', genesysCloudRegion],
      ['show-header', false],
    ];
    if (channel === 'voice') {
      attributes = [
        ...attributes,
        ['channel', 'voice'],
        ['notifier-server-endpoint', proxyServerEndPoint],
        ['event-based-library', 'SocketIo'],
      ];
    }
    return attributes;
  }

  if (channel !== 'voice') {
    transcriptContainer.style.display = 'none';
  }

  /** When the first time UI module load, parse an empty token */
  if (!existingUiModulesEl && !accessToken) {
    createUIElement(accessToken);
    if (channel === 'voice') {
      createTranscriptUIElement();
    }
  }

  /** After the genesys OAuth, get the access token */
  addAgentAssistEventListener(
    'genesys-cloud-connector-access-token-received',
    function (event) {
      const genesysCloudAccessToken = event.detail.accessToken;
      authenticateGenesysCloud(genesysCloudAccessToken)
        .then(function (res) {
          if (res.status !== 200) {
            document.body.removeChild(existingUiModulesEl);
          }
          return res.json();
        })
        .then(function (body) {
          existingUiModulesEl = document.querySelector(UI_MODULES_EL_SELECTOR);
          // If there is unauthenticated existingUIModule,
          // the accessToken will be undefined
          // Set the accessToken to the existingUIModule
          firstTimeLoad = existingUiModulesEl && !accessToken;
          if (firstTimeLoad) {
            accessToken = body.token;
            createUIElement(accessToken);
          }
        });
    }
  );
});
