import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItems',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(valuesArray: any[], searchString: string): any[] {
    if (!searchString) {
      return valuesArray;
    }
    return valuesArray.filter(ele =>
      ele.title.toLowerCase().includes(searchString.toLowerCase()) ||
      ele.description.toLowerCase().includes(searchString.toLowerCase())
    );
  }

}
