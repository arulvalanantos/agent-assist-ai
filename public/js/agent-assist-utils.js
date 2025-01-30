export function createTranscriptUIElement() {
  const TRANSCRIPT_EL_SELECTOR = 'agent-assist-transcript';
  const transcriptEl = document.createElement(TRANSCRIPT_EL_SELECTOR);
  const transcriptContainer = document.querySelector('.transcript-content');

  transcriptEl.style.maxHeight = '100%';
  transcriptContainer.appendChild(transcriptEl);
}

export function getKnowledgeAssistConfig() {
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

export function getAttributes(accessToken) {
  const proxyServerEndPoint = window.proxyServerEndPoint;
  const conversationProfile = window.conversationProfile;
  const features = window.features;
  const genesysCloudRegion = window.genesysCloudRegion;
  const clientId = window.clientId;
  const channel = window.channel;

  let applicationServer = window.applicationServer;
  applicationServer = applicationServer.replace(/\/$/, '');
  const redirectUri = `${applicationServer}?conversationProfile=${conversationProfile}&features=${features}`;

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

export function authenticateGenesysCloud(accessToken) {
  const proxyServerEndPoint = window.proxyServerEndPoint;

  return fetch(proxyServerEndPoint + '/register', {
    method: 'POST',
    headers: [['Authorization', accessToken]],
  });
}

export function renderUIModules() {
  const knowledgeAssistFeatures = window.knowledgeAssistFeatures;

  const SUMMARY_EL_SELECTOR = 'agent-assist-summarization';
  const KNOWLEDGE_ASSIST_EL_SELECTOR = 'agent-assist-knowledge-assist-v2';
  const FAQ_EL_SELECTOR = 'agent-assist-knowledge-assist';
  const SMART_REPLY_EL_SELECTOR = 'agent-assist-smart-reply';

  const summaryContainer = document.querySelector('.summary-content');
  const smartReplyContainer = document.querySelector('.smart-reply-content');
  const knowledgeAssistContainer = document.querySelector(
    '.knowledge-assist-content'
  );
  const faqContainer = document.querySelector('.faq-content');

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
