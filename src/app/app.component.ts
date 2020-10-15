import { Component, OnInit } from '@angular/core';
import { Cliente } from './Models/Cliente';
import { SignalRService } from './Services/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  listaDeClientes: Cliente[] = [];

  constructor(private signalRService: SignalRService) { }

  ngOnInit() {
    this.obterTodosClientes();
    this.signalRService.signalReceived.subscribe((signalResults: Cliente[]) => {
      //this.listaDeClientes.push(signal);
      this.listaDeClientes = signalResults;
    });
  }

  private obterTodosClientes() {
    this.signalRService
      .obterTodosClientes()
      .subscribe(
        _clientes => {
          this.listaDeClientes = _clientes;
        },
        _erros => {
          console.log(_erros);
        }
      );
  }

  public AdicionarCliente(){
    this.signalRService.AdicionarNovoCliente();
  }

}
