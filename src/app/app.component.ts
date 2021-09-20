import { Component, OnInit } from '@angular/core';
import SmartConnect from 'wslink/src/SmartConnect';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  allMessages: string = '';
  txt: string = '';
  session:any = null;
  TOPIC = 'wslink.communication.channel';

  constructor() {}

  ngOnInit() {
    this.allMessages += `Try to connect\n`;
    const smartConnect = SmartConnect.newInstance({ 
      config: { 
        application: 'chat',
        sessionURL: 'ws://localhost:8080/ws',
        sessionManagerURL: 'http://localhost:5000/paraview'
      }
    });
    
    smartConnect.onConnectionClose((event) => {
      this.allMessages += 'WS Close\n';
      this.allMessages += JSON.stringify(event, null, 2);
    });

    smartConnect.onConnectionError((event) => {
      this.allMessages += 'WS Error\n';
      this.allMessages += JSON.stringify(event, null, 2);
    });

    smartConnect.onConnectionReady((connection) => {
      this.allMessages += 'WS Connected\n';
      this.session = connection.getSession();
      console.log('connected successfully.');

      this.session.subscribe(this.TOPIC, ([msg]) => {
        console.log('receive msg from subscription');
        this.allMessages += msg;
        this.allMessages += '\n';
      });
      if(this.session) {
        this.session.call('wslink.say.hello', ['message started']);
      }
    });

    smartConnect.connect();
  }

  onSendClick() {
    if (this.session) {
      this.session.call('wslink.say.hello', [this.txt]);
      this.txt = '';
    } else {
      this.allMessages += 'Session is not available yet\n';
    }
  }

  onClearClick() {
    this.allMessages = '';
  }

  onStartClick() {
    this.session.call('wslink.start.talking');
  }

  onStopClick() {
    this.session.call('wslink.stop.talking');
  }
}