import { Component, AfterViewInit, ViewChild, ElementRef , OnInit} from '@angular/core';
import lottie from 'lottie-web';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Pokémon Fight';
  isLoading = true; 
  @ViewChild('lottieContainer') lottieContainer!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false ; 
    }, 3000);
  }
  ngAfterViewInit(): void {
    lottie.loadAnimation({
      container: this.lottieContainer.nativeElement, // Reference to the DOM element
      renderer: 'svg',  
      loop: true, 
      autoplay: true,  
      path: 'assets/pokemon-loader.json' // Example Lottie JSON file
    });
  }
}