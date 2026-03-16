import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import emailjs from '@emailjs/browser';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class ContactFormComponent {
  submitted = false;
  showModal = false;
  isSending = false;
  sendError = false;
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{7,15}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      this.isSending = true;
      this.sendError = false;
      const formData = this.form.value;
      
      const templateParams = {
        from_name: formData.name,
        email: formData.email,
        message: formData.message +'\n' + 'Celular: '+ formData.phone,
      };

      
      try {
        // Enviar usando EmailJS
        await emailjs.send(
          environment.emailjs.serviceId,
          environment.emailjs.templateId,
          templateParams,
          environment.emailjs.publicKey,
        );
        
        this.isSending = false;
        this.showModal = true;
        this.submitted = true;
        console.log('Email enviado exitosamente a customers@gilushop.store');
      } catch (error) {
        console.error('Error al enviar email:', error);
        this.isSending = false;
        this.sendError = true;
        // Still show success modal as form was valid
        this.showModal = true;
        this.submitted = true;
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  onModalOk(): void {
    this.showModal = false;
    this.form.reset();
  }

  get f() {
    return this.form.controls;
  }
}
