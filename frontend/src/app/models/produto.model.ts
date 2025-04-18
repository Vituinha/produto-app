export interface Produto {
    id?: number;
    descricao: string;
    custo?: number;
    imagem?: string | ArrayBuffer;
    precos?: Preco[];
  }
  
  export interface Preco {
    id?: number;
    loja: Loja;
    precoVenda: number;
  }
  
  export interface Loja {
    id: number;
    descricao: string;
  }