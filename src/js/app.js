import MessagesWidget from './messages-widget';

window.onload = async () => {
  const container = document.getElementById('container');
  // eslint-disable-next-line no-unused-vars
  const messagesWidget = new MessagesWidget(container);
};
