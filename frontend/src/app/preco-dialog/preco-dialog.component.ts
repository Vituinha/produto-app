import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-preco-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './preco-dialog.component.html',
  styleUrls: ['./preco-dialog.component.css']
})
export class PrecoDialogComponent {
  precoForm: FormGroup;
  selectedLoja: any = null;
  precoVenda: number | null = null;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PrecoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lojas: any[] }
  ) {
    this.precoForm = this.fb.group({
      lojaId: ['', Validators.required],
      precoVenda: ['', [Validators.required, Validators.min(0)]]
    });
    this.precoForm.get('lojaId')?.valueChanges.subscribe(value => {
      this.selectedLoja = this.data.lojas.find(loja => loja.id === value);
    });
    
    this.precoForm.get('precoVenda')?.valueChanges.subscribe(value => {
      this.precoVenda = value;
    });    
  }

  salvar(): void {
    if (!this.selectedLoja || this.precoVenda == null) {
      return;
    }
  
    this.dialogRef.close({
      lojaId: this.selectedLoja.id,
      precoVenda: this.precoVenda
    });
  }  
}