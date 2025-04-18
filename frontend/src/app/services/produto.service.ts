import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:3000/produtos';
  private lojasUrl = 'http://localhost:3000/lojas';

  constructor(private http: HttpClient) { }

  getProdutos(filtros: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filtros });
  }

  getProduto(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduto(produto: any): Observable<any> {
    return this.http.post(this.apiUrl, produto);
  }

  updateProduto(id: number, produto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, produto);
  }

  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addPreco(produtoId: number, preco: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${produtoId}/precos`, preco);
  }

  getLojas(): Observable<any[]> {
    return this.http.get<any[]>(this.lojasUrl);
  }
}