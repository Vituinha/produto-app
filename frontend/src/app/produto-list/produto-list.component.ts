import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent {
  produtos: any[] = [];
  filtros: any = {
    id: '',
    descricao: '',
    custo: '',
    precoVenda: ''
  };

  displayedColumns: string[] = ['id', 'descricao', 'precoVenda', 'actions'];

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    const params: any = {};
    for (const key in this.filtros) {
      if (this.filtros[key]) {
        params[key] = this.filtros[key];
      }
    }

    this.produtoService.getProdutos(params).subscribe(
      data => {
        this.produtos = data;
      },
      error => {
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
      }
    );
  }

  aplicarFiltros(): void {
    this.carregarProdutos();
  }

  editarProduto(id: number): void {
    this.router.navigate(['/produtos', id]);
  }

  excluirProduto(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Tem certeza que deseja excluir este produto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.produtoService.deleteProduto(id).subscribe(
          () => {
            this.snackBar.open('Produto excluído com sucesso', 'Fechar', { duration: 3000 });
            this.carregarProdutos();
          },
          error => {
            this.snackBar.open('Erro ao excluir produto', 'Fechar', { duration: 3000 });
          }
        );
      }
    });
  }

  novoProduto(): void {
    this.router.navigate(['/produtos/novo']);
  }
}