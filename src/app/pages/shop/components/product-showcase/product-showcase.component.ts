import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface CategoryShowcase {
  id: string;
  name: string;
  description: string;
  brands: string[];
  imageUrl: string;
  iconSvg?: string;
}

@Component({
  selector: 'app-product-showcase',
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.scss']
})
export class ProductShowcaseComponent {
  @ViewChild('showcaseSlider') showcaseSlider!: ElementRef;
  @Output() categorySelect = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) { }

  categories: CategoryShowcase[] = [
    {
      id: 'bases',
      name: 'Bases',
      description: 'Cobertura perfecta para todo tipo de piel. Desde ligeras hasta alta cobertura.',
      brands: ['Maybelline', 'e.l.f'],
      imageUrl: 'https://images.pexels.com/photos/354962/pexels-photo-354962.jpeg',
      iconSvg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Cuerpo del frasco -->
  <rect x="62" y="80" width="76" height="96" rx="12"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Hombro del frasco -->
  <path d="M62 92 C62 82 72 74 80 74 L120 74 C128 74 138 82 138 92"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Cuello -->
  <rect x="82" y="52" width="36" height="24" rx="5"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Tapa -->
  <rect x="78" y="38" width="44" height="18" rx="6"
        stroke="#b8426e" stroke-width="5"/>
  <line x1="78" y1="46" x2="122" y2="46"
        stroke="#b8426e" stroke-width="3" opacity="0.7"/>

  <!-- Bomba / pump -->
  <rect x="97" y="28" width="6" height="12" rx="3"
        stroke="#D95F80" stroke-width="3.5"/>
  <rect x="88" y="24" width="24" height="8" rx="4"
        stroke="#D95F80" stroke-width="3.5"/>

  <!-- Área de etiqueta -->
  <rect x="72" y="100" width="56" height="50" rx="4"
        stroke="#D95F80" stroke-width="3" opacity="0.7"/>

  <!-- Líneas de etiqueta -->
  <line x1="82" y1="114" x2="118" y2="114"
        stroke="#D95F80" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="86" y1="122" x2="114" y2="122"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <line x1="88" y1="130" x2="112" y2="130"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

  <!-- Nivel de líquido -->
  <line x1="63" y1="146" x2="137" y2="144"
        stroke="#b8426e" stroke-width="3" stroke-linecap="round" opacity="0.5"/>

  <!-- Brillo / reflejo -->
  <path d="M70 95 C70 88 74 84 78 82"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
</svg>`
    },
    {
      id: 'labios',
      name: 'Labios',
      description: 'Labiales, gloss y tinturas para labios irresistibles.',
      brands: ['Maybelline', 'e.l.f'],
      imageUrl: 'https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg',
      iconSvg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tubo inferior -->
  <rect x="72" y="130" width="56" height="88" rx="8"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Banda de etiqueta -->
  <rect x="72" y="158" width="56" height="36"
        stroke="#D95F80" stroke-width="3" opacity="0.7"/>
  <line x1="82" y1="170" x2="118" y2="170"
        stroke="#D95F80" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="86" y1="179" x2="114" y2="179"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.7"/>

  <!-- Anillo collar / mecanismo -->
  <rect x="70" y="124" width="60" height="10" rx="4"
        stroke="#b8426e" stroke-width="5"/>

  <!-- Manga / sleeve -->
  <rect x="76" y="88" width="48" height="40" rx="4"
        stroke="#D95F80" stroke-width="4.5"/>

  <!-- Bala del labial -->
  <rect x="82" y="52" width="36" height="40" rx="3"
        fill="#D95F80" opacity="0.25" stroke="#b8426e" stroke-width="5"/>

  <!-- Punta biselada -->
  <path d="M82 52 C82 42 88 32 100 28 C112 32 118 42 118 52 Z"
        fill="#D95F80" opacity="0.35"/>
  <path d="M82 52 C82 42 88 32 100 28 C112 32 118 42 118 52"
        stroke="#b8426e" stroke-width="5" stroke-linejoin="round"/>

  <!-- Brillos / reflejos -->
  <path d="M88 48 C89 40 93 33 98 30"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M85 54 L85 88"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
</svg>`
    },
    {
      id: 'rostro',
      name: 'Rostro',
      description: 'Blush, polvos y productos para un acabado perfecto.',
      brands: ['Maybelline', 'e.l.f'],
      imageUrl: 'https://images.pexels.com/photos/1047573/pexels-photo-1047573.jpeg',
      iconSvg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Base del compacto -->
  <rect x="30" y="110" width="140" height="58" rx="14"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Tapa abierta -->
  <path d="M30 110 C30 90 44 72 100 68 C156 72 170 90 170 110"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Espejo interior -->
  <path d="M38 110 C38 94 50 80 100 76 C150 80 162 94 162 110"
        stroke="#D95F80" stroke-width="2.5" opacity="0.6"/>

  <!-- Bisagra -->
  <rect x="88" y="107" width="24" height="6" rx="3"
        stroke="#b8426e" stroke-width="3.5"/>

  <!-- Pan de polvo -->
  <rect x="42" y="120" width="116" height="38" rx="10"
        stroke="#D95F80" stroke-width="3.5"/>
  <rect x="44" y="122" width="112" height="34" rx="9"
        fill="#D95F80" opacity="0.15"/>

  <!-- Textura swirl del polvo -->
  <path d="M100 139 C92 133 86 136 88 142 C90 148 98 150 106 146 C114 142 114 134 106 130 C98 126 88 130 86 138"
        stroke="#b8426e" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>

  <!-- Shimmer dots -->
  <g fill="#D95F80" opacity="0.5">
    <circle cx="72"  cy="132" r="2"/>
    <circle cx="90"  cy="150" r="2"/>
    <circle cx="110" cy="128" r="1.8"/>
    <circle cx="122" cy="132" r="2"/>
    <circle cx="100" cy="152" r="2"/>
  </g>

  <!-- Cierres laterales -->
  <rect x="24"  y="128" width="8" height="14" rx="3"
        stroke="#b8426e" stroke-width="3.5"/>
  <rect x="168" y="128" width="8" height="14" rx="3"
        stroke="#b8426e" stroke-width="3.5"/>

  <!-- Logo en tapa -->
  <ellipse cx="100" cy="92" rx="22" ry="10"
           stroke="#D95F80" stroke-width="2.5" opacity="0.5"/>
</svg>`
    },
    {
      id: 'primers',
      name: 'Primers',
      description: 'Prepara tu piel para un maquillaje que dura todo el día.',
      brands: ['Maybelline', 'e.l.f'],
      imageUrl: 'https://images.pexels.com/photos/30836149/pexels-photo-30836149.jpeg',
      iconSvg: `<svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Cuerpo del tubo -->
  <path d="M68 200 L68 100 C68 95 72 92 76 90 L100 82 L124 90 C128 92 132 95 132 100 L132 200 Z"
        stroke="#D95F80" stroke-width="5" stroke-linejoin="round"/>

  <!-- Fondo redondeado -->
  <path d="M68 200 C68 210 132 210 132 200"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Hombro -->
  <path d="M76 90 C76 80 84 74 100 72 C116 74 124 80 124 90"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Cuello -->
  <rect x="86" y="56" width="28" height="18" rx="4"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Tapa -->
  <rect x="80" y="36" width="40" height="22" rx="8"
        stroke="#b8426e" stroke-width="5"/>
  <line x1="80" y1="47" x2="120" y2="47"
        stroke="#b8426e" stroke-width="3" opacity="0.6"/>
  <path d="M84 36 C84 30 116 30 116 36"
        stroke="#b8426e" stroke-width="3" opacity="0.7"/>

  <!-- Etiqueta -->
  <rect x="72" y="118" width="56" height="60" rx="4"
        stroke="#D95F80" stroke-width="3" opacity="0.7"/>
  <line x1="82" y1="132" x2="118" y2="132"
        stroke="#D95F80" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="85" y1="141" x2="115" y2="141"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <line x1="87" y1="149" x2="113" y2="149"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

  <!-- Brillo -->
  <path d="M76 102 L76 195"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
</svg>`
    },
    {
      id: 'ojos',
      name: 'Ojos',
      description: 'Delineadores, rimeles y más para mirada expresiva.',
      brands: ['Maybelline', 'e.l.f'],
      imageUrl: 'https://images.pexels.com/photos/7712438/pexels-photo-7712438.jpeg',
      iconSvg: `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Tubo -->
  <rect x="78" y="130" width="44" height="100" rx="10"
        stroke="#D95F80" stroke-width="5"/>
  <path d="M78 228 C78 238 122 238 122 228"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Etiqueta -->
  <rect x="78" y="152" width="44" height="48"
        stroke="#D95F80" stroke-width="3" opacity="0.7"/>
  <line x1="88" y1="165" x2="112" y2="165"
        stroke="#D95F80" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="90" y1="174" x2="110" y2="174"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.7"/>

  <!-- Collar / wiper -->
  <rect x="76" y="122" width="48" height="12" rx="5"
        stroke="#b8426e" stroke-width="5"/>

  <!-- Varita -->
  <rect x="97" y="44" width="6" height="82" rx="3"
        stroke="#D95F80" stroke-width="4.5"/>

  <!-- Cabeza del cepillo -->
  <rect x="93" y="20" width="14" height="26" rx="4"
        stroke="#b8426e" stroke-width="4.5"/>

  <!-- Cerdas izquierda -->
  <g stroke="#D95F80" stroke-width="2.5" stroke-linecap="round">
    <line x1="93" y1="24" x2="84" y2="21"/>
    <line x1="93" y1="29" x2="83" y2="28"/>
    <line x1="93" y1="34" x2="83" y2="34"/>
    <line x1="93" y1="39" x2="84" y2="40"/>
    <line x1="93" y1="43" x2="85" y2="45"/>
  </g>

  <!-- Cerdas derecha -->
  <g stroke="#D95F80" stroke-width="2.5" stroke-linecap="round">
    <line x1="107" y1="24" x2="116" y2="21"/>
    <line x1="107" y1="29" x2="117" y2="28"/>
    <line x1="107" y1="34" x2="117" y2="34"/>
    <line x1="107" y1="39" x2="116" y2="40"/>
    <line x1="107" y1="43" x2="115" y2="45"/>
  </g>

  <!-- Tips de cerdas -->
  <g fill="#D95F80" opacity="0.7">
    <circle cx="83" cy="21" r="2"/> <circle cx="82" cy="28" r="2"/>
    <circle cx="82" cy="34" r="2"/> <circle cx="83" cy="40" r="2"/>
    <circle cx="84" cy="45" r="2"/>
  </g>
  <g fill="#D95F80" opacity="0.7">
    <circle cx="117" cy="21" r="2"/> <circle cx="118" cy="28" r="2"/>
    <circle cx="118" cy="34" r="2"/> <circle cx="117" cy="40" r="2"/>
    <circle cx="116" cy="45" r="2"/>
  </g>
</svg>`
    },
    {
      id: 'skincare',
      name: 'Skin Care',
      description: 'Rutina coreana para una piel radiante y saludable.',
      brands: ['Coreano'],
      imageUrl: 'https://images.pexels.com/photos/5927811/pexels-photo-5927811.jpeg',
      iconSvg: `<svg viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Bulbo del gotero -->
  <ellipse cx="100" cy="30" rx="16" ry="12"
           stroke="#b8426e" stroke-width="5"/>
  <path d="M88 26 C88 22 112 22 112 26"
        stroke="#D95F80" stroke-width="2.5" opacity="0.6"/>

  <!-- Tallo del gotero -->
  <rect x="97" y="40" width="6" height="22" rx="3"
        stroke="#D95F80" stroke-width="4.5"/>

  <!-- Gota cayendo -->
  <path d="M100 40 C100 40 97 50 97 53 C97 56.5 103 56.5 103 53 C103 50 100 40 100 40Z"
        stroke="#D95F80" stroke-width="3" opacity="0.8"/>

  <!-- Collar -->
  <rect x="84" y="60" width="32" height="10" rx="4"
        stroke="#b8426e" stroke-width="5"/>

  <!-- Cuello -->
  <rect x="90" y="68" width="20" height="18" rx="3"
        stroke="#D95F80" stroke-width="4.5"/>

  <!-- Cuerpo de la botella -->
  <path d="M90 86 C86 92 76 98 74 108 L74 210 C74 218 126 218 126 210 L126 108 C124 98 114 92 110 86 Z"
        stroke="#D95F80" stroke-width="5" stroke-linejoin="round"/>
  <path d="M74 208 C74 220 126 220 126 208"
        stroke="#D95F80" stroke-width="5"/>

  <!-- Logo -->
  <circle cx="100" cy="115" r="5" stroke="#b8426e" stroke-width="2.5" opacity="0.6"/>
  <circle cx="100" cy="115" r="2" fill="#b8426e" opacity="0.5"/>

  <!-- Etiqueta -->
  <rect x="78" y="122" width="44" height="64" rx="5"
        stroke="#D95F80" stroke-width="3" opacity="0.7"/>
  <line x1="88" y1="136" x2="112" y2="136"
        stroke="#D95F80" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
  <line x1="90" y1="145" x2="110" y2="145"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <line x1="91" y1="153" x2="109" y2="153"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

  <!-- Brillo -->
  <path d="M82 100 L82 206"
        stroke="#D95F80" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
</svg>`
    }
  ];

  currentIndex = 0;

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.categories.length - 1;
    }
  }

  next(): void {
    if (this.currentIndex < this.categories.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  viewProducts(categoryId: string): void {
    this.categorySelect.emit(categoryId);
    // Scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  get currentCategory(): CategoryShowcase {
    return this.categories[this.currentIndex];
  }

  getCategoryIcon(iconSvg: string | undefined): SafeHtml {
    if (iconSvg) {
      return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
    }
    return '';
  }
}
