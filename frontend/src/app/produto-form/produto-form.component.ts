import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { PrecoDialogComponent } from '../preco-dialog/preco-dialog.component';
import { Produto, Preco, Loja } from '../models/produto.model';


@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.css']
})
export class ProdutoFormComponent implements OnInit {
  produtoForm: FormGroup;
  isEditMode = false;
  produtoId: number | null = null;
  precos: Preco[] = [];
  lojas: Loja[] = [];
  tituloPagina = 'Inclusão / Edição de Produto';
  imagemSelecionada: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.produtoForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(60)]],
      custo: [''],
      imagem: ['']
    });
  }

  ngOnInit(): void {
    this.carregarLojas();
    
    this.route.params.subscribe(params => {
      if (params['id'] !== 'novo') {
        this.isEditMode = true;
        this.produtoId = +params['id'];
        this.carregarProduto();
      }
    });
  }

  carregarLojas(): void {
    this.produtoService.getLojas().subscribe({
      next: (data: Loja[]) => {
        this.lojas = data;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar lojas', 'Fechar', { duration: 3000 });
      }
    });
  }

  carregarProduto(): void {
    if (this.produtoId) {
      this.produtoService.getProduto(this.produtoId).subscribe({
        next: (data: Produto) => {
          this.produtoForm.patchValue({
            descricao: data.descricao,
            custo: data.custo
          });
          this.precos = data.precos || [];
        },
        error: () => {
          this.snackBar.open('Erro ao carregar produto', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        this.snackBar.open('Apenas arquivos PNG e JPG são permitidos', 'Fechar', { duration: 3000 });
        return;
      }
      this.imagemSelecionada = file;
      this.produtoForm.patchValue({ imagem: file });
    }
  }
  
  removerImagem(): void {
    this.imagemSelecionada = null;
    this.produtoForm.patchValue({ imagem: null });
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) input.value = '';
  }

  adicionarPreco(): void {
    const dialogRef = this.dialog.open(PrecoDialogComponent, {
      width: '400px',
      data: { lojas: this.lojas }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const lojaExistente = this.precos.find(p => p.loja.id === result.lojaId);
        if (lojaExistente) {
          this.snackBar.open('Não é permitido mais que um preço de venda para a mesma loja.', 'Fechar', { duration: 3000 });
          return;
        }
        
        const lojaSelecionada = this.lojas.find(l => l.id === result.lojaId);
        if (lojaSelecionada) {
          this.precos.push({
            loja: lojaSelecionada,
            precoVenda: result.precoVenda
          });
        }
      }
    });
  }

  removerPreco(index: number): void {
    this.precos.splice(index, 1);
  }

  voltar(): void {
    this.router.navigate(['/produtos']);
  }

  salvarProduto(): void {
    this.produtoForm.markAllAsTouched();

    if (this.produtoForm.invalid) {
      this.snackBar.open('Preencha corretamente todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.precos.length === 0) {
      this.snackBar.open('Adicione pelo menos um preço para uma loja', 'Fechar', { duration: 3000 });
      return;
    }

    const produtoData = {
      ...this.produtoForm.value,
      precos: this.precos.map(p => ({
        lojaId: p.loja.id,
        precoVenda: p.precoVenda
      }))
    };

    console.log(produtoData);

    const request = this.isEditMode && this.produtoId
      ? this.produtoService.updateProduto(this.produtoId, produtoData)
      : this.produtoService.createProduto(produtoData);

    request.subscribe({
      next: () => {
        this.snackBar.open('Produto salvo com sucesso', 'Fechar', { duration: 3000 });
        this.router.navigate(['/produtos']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar produto', 'Fechar', { duration: 3000 });
      }
    });
  }

  excluirProduto(): void {
    if (this.produtoId) {
      this.produtoService.deleteProduto(this.produtoId).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso', 'Fechar', { duration: 3000 });
          this.router.navigate(['/produtos']);
        },
        error: () => {
          this.snackBar.open('Erro ao excluir produto', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}