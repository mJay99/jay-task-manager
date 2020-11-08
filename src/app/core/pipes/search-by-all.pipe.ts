import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Priority } from '../enums/priority.enum';
// let thisMoment: moment.Moment = moment("someDate");
@Pipe({
  name: 'searchByAll'
})
export class SearchByAllPipe implements PipeTransform {

  transform(items: any, filter: any): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      return items.filter((item: any) => {
        let modified_item = { ...item };
        return filterKeys.some((keyName) => {
          if (keyName === 'due_date') {
            let date = moment(modified_item.due_date).format("dddd, MMMM Do YYYY, h:mm:ss a");
            modified_item.due_date = date;
          }
          if (item.priority == Priority.High) {
            modified_item.priority = 'high'
          } else if (item.priority == Priority.Medium) {
            modified_item.priority = 'medium'
          } else {
            modified_item.priority = 'normal'
          }
      
          return new RegExp(filter[keyName], 'gi').test(modified_item[keyName]) || filter[keyName] == "";
        });
      });
    }
  }

}
