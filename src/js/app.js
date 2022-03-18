import MessagesWidget from './messages-widget';

window.onload = async () => {
  const container = document.getElementById('container');
  const messagesWidget = new MessagesWidget();
  messagesWidget.bindToDOM(container);
  messagesWidget.startPolling();
};
