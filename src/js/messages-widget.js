import {
  catchError, interval, map, of, switchMap,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { create } from './utils/utils';

export default class MessagesWidget {
  constructor() {
    this.container = create('div', 'messages-widget-container');
    this.markup = `
      <h2>Incoming</h2>
      <div class="mw-messages-container"></div>
    `;
    this.container.innerHTML = this.markup;
  }

  bindToDOM(parent) {
    parent.appendChild(this.container);
  }

  startPolling() {
    const requester$ = interval(10000).pipe(
      switchMap(() => ajax.getJSON('https://ahjhw11server.herokuapp.com/messages/unread')
        .pipe(
          catchError(() => of({
            status: 'ok',
            timestamp: Date.now(),
            messages: [],
          })),
        )),
      map((json) => json.messages),
    );

    requester$.subscribe((messages) => {
      messages.forEach((message) => {
        const { from, subject, received } = message;
        this.addNewMessage(from, subject, received);
      });
    });
  }

  addNewMessage(email, subject, date) {
    let subjectShort = subject;
    if (subject.length > 15) {
      subjectShort = `${subject.substring(0, 15)}...`;
    }
    const dateObj = new Date(date);
    const pair = dateObj.toLocaleString().split(',');
    const dateFormatted = `${pair[1].trim().substring(0, 5)}  ${pair[0]}`;

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
