import { Component } from '@angular/core';

interface Brand {
  name: string;
  slug: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-brand-showcase',
  templateUrl: './brand-showcase.component.html',
  styleUrls: ['./brand-showcase.component.scss']
})
export class BrandShowcaseComponent {
  brands: Brand[] = [
    {
      name: 'Huda Beauty',
      slug: 'huda-beauty',
      image: 'assets/image/huda-beauty--1.webp',
      alt: 'Polvo Easy Bake de Huda Beauty'
    },
    {
      name: 'NYX Professional Makeup',
      slug: 'nyx',
      image: 'assets/image/nyx--1.webp',
      alt: 'Rubor Buttermelt de NYX'
    },
    {
      name: 'Fenty Beauty',
      slug: 'fenty-beauty',
      image: 'assets/image/fenty-beauty--1.webp',
      alt: 'Productos para labios de Fenty Beauty'
    },
    {
      name: "L'Oréal Paris",
      slug: 'loreal',
      image: 'assets/image/loreal--1.webp',
      alt: 'Fijador Infallible de L’Oréal Paris'
    },
    {
      name: 'Too Faced',
      slug: 'too-faced',
      image: 'assets/image/too-faced--1.webp',
      alt: 'Corrector Born This Way de Too Faced'
    },
    {
      name: 'Milani',
      slug: 'milani',
      image: 'assets/image/milani--1.webp',
      alt: 'Base Conceal + Perfect de Milani'
    }
  ];
}
