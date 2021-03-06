import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { AddEventPage } from '../add-event/add-event';
import { DiaryService } from '../shared/diary.service';
import { DiaryEntryPage } from '../diary-entry/diary-entry';

@IonicPage()
@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html',
})
export class DiaryPage {
  errorMessage: string;
  entryType: string[] = [
    'https://drslash.com/wp-content/uploads/2014/07/Notes.png',
    'https://image.flaticon.com/icons/svg/432/432413.svg',
    'https://image.flaticon.com/icons/svg/235/235248.svg',
    'https://image.flaticon.com/icons/svg/236/236816.svg',
    'https://image.flaticon.com/icons/svg/236/236830.svg'
  ];

  entries: any[] = [];

  lecturers: any[] = [];
  private _lecturersUrl = 'https://still-beach-80885.herokuapp.com/users/lecturers';

  modules: any[] = [];
  private _modulesUrl = 'https://still-beach-80885.herokuapp.com/course/modules';

  courses: any[] = [];
  private _coursesUrl = 'https://still-beach-80885.herokuapp.com/course/courses';

  constructor(private alertCtrl: AlertController,
    public navCtrl: NavController,
    private _diaryService: DiaryService,
    public modalCtrl: ModalController) {
    this.getEntries(this.entries, this.lecturers, this.modules, this.courses);
  }

  /* onViewDidEnter() {
    this.getEntries(this.entries, this.lecturers, this.modules, this.courses);
  } */

  sortByDate(event1: any, event2: any) {
    if (event1.dueDate > event2.dueDate) return 1;
    else if (event1.dueDate === event2.dueDate) return 0;
    else return -1;
  }

  // Returns data on selected collection
  populateArrays(array, _url) {
    this._diaryService.populateArrays(_url).subscribe(data => {
      for (var i = 0; i < data.length; i++) {
        array[i] = data[i];
      }
    },
      error => this.errorMessage = <any>error);
  }

  // Returns Diary Entries
  getEntries(entries, lecturers, modules, courses) {
      this.populateArrays(lecturers, this._lecturersUrl);
      this.populateArrays(modules, this._modulesUrl);
      this.populateArrays(courses, this._coursesUrl);
      this._diaryService.getEntries().subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          entries.push(data[i]);
          for (var j = 0; j < entries.length; j++) {
            for (var k = 0; k < lecturers.length; k++) {
              if (entries[j].lecturer == lecturers[k]._id) {
                entries[j].lecturer = (lecturers[k].firstName + " " + lecturers[k].lastName);
              }
            }
            for (var l = 0; l < modules.length; l++) {
              if (entries[j].module == modules[l]._id) {
                entries[j].module = (modules[l].name);
              }
            }
          }
        }
      this.entries.sort(this.sortByDate);
    },
      error => this.errorMessage = <any>error);
  }

  openModal(entry) {
    let modal = this.modalCtrl.create(DiaryEntryPage, entry);
    modal.present();
  }

  addEvent() {
    this.navCtrl.push(AddEventPage);
  }
}