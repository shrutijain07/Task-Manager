import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItems',
  standalone:true
})
export class FilterPipe implements PipeTransform {

  transform(valuesAray: any[], searchString:string): any[] {
    return valuesAray.filter(ele=>ele.title.toLowerCase().includes(searchString.toLowerCase()))
  }

}
