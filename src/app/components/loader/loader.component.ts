import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import lottie from 'lottie-web';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements AfterViewInit {
  title = 'Pokémon Fights'; // You can make this an @Input() if you want to pass the title dynamically

  @ViewChild('lottieContainer') lottieContainer!: ElementRef;

  ngAfterViewInit(): void {
    lottie.loadAnimation({
      container: this.lottieContainer.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/pokemon-loader.json' // Pokéball animation
    });
  }
}