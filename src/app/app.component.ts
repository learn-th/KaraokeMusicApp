import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MusicModel } from './music-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'KaraokeMusicList';
  data:MusicModel[] = [];
  private jsonPath = 'https://learn-th.github.io/KaraokeMusicApp/assets/app_data.json';
  dataToDisplay:MusicModel[] = [];
  public searchText:string='';
  private filteredData:MusicModel[] = [];
  public isArtist = 'true';
  private searched = false;
  private startIndex = 0;
  
  constructor(public http:HttpClient) {
    
  }

  ngOnInit(): void {
    this.http.get<any>(this.jsonPath).subscribe(response => {
      this.data = response;
      this.addItems("main");
    })
  }

  search():void {
    this.filteredData = [];
    let termToFind = this.searchText;
    let filterByArtist = this.isArtist;
    console.log('isArtist', this.isArtist)
    this.filteredData = this.data.filter(function(item){
      if(filterByArtist === 'true')
      {
        return item.Artist.toLowerCase().indexOf(termToFind.toLowerCase()) !== -1;
      }
      else{
        return item.Name.toLowerCase().indexOf(termToFind.toLowerCase()) !== -1;
      }
    });

    if(this.isArtist === 'true')
    {
      this.filteredData = this.filteredData.sort((a, b) => a.Artist.localeCompare(b.Artist));  
    }
    else{    
      this.filteredData = this.filteredData.sort((a, b) => a.Name.localeCompare(b.Name));
    }
    
    this.dataToDisplay = [];
    this.searched = true;
    this.startIndex = 0;

    this.addItems("sorted");
  }

  updateSearchText(event:Event):void{
    this.searchText = (<HTMLInputElement>event.target).value;
  }

  clearSearch():void{
    this.searchText = '';
    this.dataToDisplay = [];
    this.searched = false;
    this.startIndex = 0;
    this.addItems("main");
  }

  onScrollDown(ev: any) {
    this.appendItems();
  }

  appendItems() {
    if(this.searched === false)
    {
      this.addItems("main");
    }
    else{
      this.addItems("sorted");
    }
  }

  addItems(source: string) {
    for (let i = this.startIndex; i < this.startIndex + 20; ++i) {
      if( source === 'main'){
        if(this.data[i])
        {
          this.dataToDisplay.push(this.data[i]);
        }
      }
      else if( source === 'sorted'){        
        if(this.filteredData[i])
        {
          this.dataToDisplay.push(this.filteredData[i]);
        }
      }
    }

    this.startIndex += 20;
  }

}
