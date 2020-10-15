import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Cliente } from '../Models/Cliente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';

@Injectable({
  providedIn: "root"
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  signalReceived = new EventEmitter<Cliente[]>();

  constructor(private http: HttpClient) {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      //.withUrl('https://localhost:5001/clienteHub') //use your api adress here and make sure you use right hub name.
      .withUrl('http://localhost:5000/clienteHub') //use your api adress here and make sure you use right hub name.
      .build();
  };

  private startConnection = () => {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection Started...');
        this.registerSignalEvents();
        this.CriarGrupo();
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);

        //if you get error try to start connection again after 3 seconds.
        setTimeout(function() {
          this.startConnection();
        }, 3000);
      });
  };

  private registerSignalEvents() {
    this.hubConnection.on('TheosSignalR', (data: Cliente[]) => {
      let dados = data;
      this.signalReceived.emit(data);
    });
  }

  public CriarGrupo = () => {
    if(this.hubConnection.state === signalR.HubConnectionState.Connected){
      const groupId = uuid.v4();
      this.hubConnection.invoke('SubscribeToGroup')
      .catch(err => console.error(err))
    }
  }

  obterTodosClientes() : Observable<Cliente[]> {
    //const url = `https://localhost:5001/api/Clientes/todos-clientes`;
    const url = `http://localhost:5000/api/Clientes/todos-clientes`;
    return this.http.get<Cliente[]>(url);
  }

  public AdicionarNovoCliente(){
    let cliente  = {
      "nome": "Cliente ",
      "sobreNome": "Angular Frontend",
      "idade": 10,
      "telefones": [
        {
          "id": 1,
          "numeroTelefone": "18996596931"
        },
        {
          "id": 2,
          "numeroTelefone": "4439051585"
        }
      ],
      "endereco": {
        "rua": "Av. Brasil",
        "numero": 1520,
        "complemento": "Escritório"
      }
    }

    if(this.hubConnection.state === signalR.HubConnectionState.Connected){
      this.hubConnection.invoke('AdicionarNovoCliente', cliente)
      .catch(err => console.error(err))
    }
  }

}