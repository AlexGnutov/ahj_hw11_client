import {
  catchError, filter, from, interval, map, of, switchMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { create } from './utils/utils';

export default class MessagesWidget {
  constructor(parent) {
    this.container = create('div', 'messages-widget-container');
    this.markup = `
      <h2>Incoming</h2>
      <div class="mw-messages-container"></div>
    `;
    this.container.innerHTML = this.markup;
    parent.appendChild(this.container);
    this.startPolling();
    this.latest = 0;
  }

  startPolling() {
    const ticker = interval(10000);

    const requester = ticker.pipe(
      switchMap(() => ajax.getJSON('https://ahjhw11server.herokuapp.com/messages/unread')
        .pipe(
          catchError(() => of({
            status: 'ok',
            timestamp: Date.now(),
            messages: [],
          })),
        )),
    ).pipe(
      map((json) => json.messages),
      switchMap((messages) => from(messages)),
      filter((message) => {
        if (message.received > this.latest) {
          this.latest = message.received;
          return true;
        }
        return false;
      }),
      map((filteredMessage) => {
        // eslint-disable-next-line no-shadow
        const { from, subject, received } = filteredMessage;
        this.addNewMessage(from, subject, received);
      }),
    );
    requester.subscribe();
  }

  addNewMessage(email, subject, date) {
    let subjectShort = subject;
    if (subject.length > 15) {
      subjectShort = `${subject.substring(0, 15)}...`;
    }
    const dateObj = new Date(date);
    const dateFormatted = dateObj.toLocaleString();

    const messageContainer = create('div', 'mw-message-container');
    this.markup = `
      <div class="mw-message">
        <div>${email}</div>
        <div>${subjectShort}</div>
        <div>${dateFormatted}</div>
      </div>
    `;
    messageContainer.innerHTML = this.markup;
    const parent = this.container.querySelector('.mw-messages-container');
    parent.insertBefore(messageContainer, parent.firstChild);
  }
}
