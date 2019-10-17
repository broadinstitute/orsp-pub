import { BehaviorSubject } from 'rxjs';

const subscriber = new BehaviorSubject(0);

const messageService = {
  send: msg => {
    subscriber.next(msg)
  }
};

export {
  messageService,
  subscriber
}
