import { Endereco } from './Endereco';
import { Telefone } from './Telefone';

export class Cliente{
    constructor(){
        this.telefones = [];
        this.endereco = new Endereco();
    }

    id: String;
    nome: String;
    sobreNome: String;
    idade: Number;
    telefones: Telefone[];
    endereco: Endereco;

}