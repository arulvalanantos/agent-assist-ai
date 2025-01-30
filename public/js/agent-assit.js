window.addEventListener('load', function () {
  const proxyServerEndPoint = window.proxyServerEndPoint;
  const conversationProfile = window.conversationProfile;
  const features = window.features;
  const genesysCloudRegion = window.genesysCloudRegion;
  const clientId = window.clientId;
  const channel = window.channel;
  const knowledgeAssistFeatures = window.knowledgeAssistFeatures;

  // const urlParams = new URLSearchParams(window.location.search);
  // const currentConversationId = urlParams.get('conversationid');
  // const gcHostOrigin = urlParams.get('gcHostOrigin');
  // const gcTargetEnv = urlParams.get('gcTargetEnv');

  const UI_MODULES_EL_SELECTOR = 'agent-assist-ui-modules';
  const SUMMARY_EL_SELECTOR = 'agent-assist-summarization';
  const KNOWLEDGE_ASSIST_EL_SELECTOR = 'agent-assist-knowledge-assist-v2';
  const FAQ_EL_SELECTOR = 'agent-assist-knowledge-assist';
  const SMART_REPLY_EL_SELECTOR = 'agent-assist-smart-reply';

  let accessToken = '';
  let firstTimeLoad = false;
  let existingUiModulesEl = document.querySelector(UI_MODULES_EL_SELECTOR);

  let applicationServer = window.applicationServer;
  applicationServer = applicationServer.replace(/\/$/, '');
  const redirectUri = `${applicationServer}?conversationProfile=${conversationProfile}&features=${features}`;

  const uiModulesContainer = document.querySelector('.ui-modules-container');
  const transcriptContainer = document.querySelector('.transcript-content');

  const summaryContainer = document.querySelector('.summary-content');
  const smartReplyContainer = document.querySelector('.smart-reply-content');
  const knowledgeAssistContainer = document.querySelector(
    '.knowledge-assist-content'
  );
  const faqContainer = document.querySelector('.faq-content');

  function createTranscriptUIElement() {
    const TRANSCRIPT_EL_SELECTOR = 'agent-assist-transcript';
    const transcriptEl = document.createElement(TRANSCRIPT_EL_SELECTOR);
    const transcriptContainer = document.querySelector('.transcript-content');

    transcriptEl.style.maxHeight = '100%';
    transcriptContainer.appendChild(transcriptEl);
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

      const summaryEl = document.createElement(SUMMARY_EL_SELECTOR);
      summaryContainer.appendChild(summaryEl);

      const smartReplyEl = document.createElement(SMART_REPLY_EL_SELECTOR);
      smartReplyContainer.appendChild(smartReplyEl);

      const knowledgeAssistEl = document.createElement(
        KNOWLEDGE_ASSIST_EL_SELECTOR
      );
      knowledgeAssistEl.config = getKnowledgeAssistConfig();
      knowledgeAssistContainer.appendChild(knowledgeAssistEl);

      const faqEl = document.createElement(FAQ_EL_SELECTOR);
      faqEl.config = getKnowledgeAssistConfig();
      faqEl.setAttribute('features', knowledgeAssistFeatures);
      faqContainer.appendChild(faqEl);
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
      showCopyAnswer: true,
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

  function authenticateGenesysCloud(accessToken) {
    return fetch(proxyServerEndPoint + '/register', {
      method: 'POST',
      headers: [['Authorization', accessToken]],
    });
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

  function addAgentAssistListener(event) {
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

  // /** After the genesys OAuth, get the access token */
  addAgentAssistEventListener(
    'genesys-cloud-connector-access-token-received',
    addAgentAssistListener
  );
});
