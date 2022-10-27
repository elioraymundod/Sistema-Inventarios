import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../Services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private debounceTimer?: NodeJS.Timeout;

  constructor(private placeServices: PlacesService) { }

  ngOnInit(): void {
  }

  onQueryChange(query: string = ''){
    if(this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.placeServices.getPlacesByQuery(query);
    }, 350);
  }

}
