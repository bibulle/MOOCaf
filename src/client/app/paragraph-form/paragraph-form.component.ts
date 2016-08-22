import {Component, OnInit, Input} from '@angular/core';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/catch";

import {ParagraphAbstract} from "../paragraph-abstract.component";
import {Paragraph} from "../model/paragraph";
import {ParagraphService} from "../services/paragraph.service";
import {Subject} from "rxjs/Subject";

@Component({
  moduleId: module.id,
  selector: 'app-paragraph-form',
  inputs: ['data'],
  templateUrl: 'paragraph-form.component.html',
  styleUrls: ['../paragraph/paragraph.component.css', 'paragraph-form.component.css'],
  providers: [ParagraphService],
})

export class ParagraphFormComponent extends ParagraphAbstract implements OnInit {

  @Input()
  data: Paragraph;

  // The queue to manage user choices
  private userChoiceSubject: Subject<{UID; userChoice}>;

  // the constructor
  constructor(private paragraphService: ParagraphService) {
    super();

  }

  // Initialisation
  ngOnInit() {

    // Change Markdown to HTM in each label
    if (this.data.content) {
      for (let c of this.data.content) {
        if (c['label']) {
          c['label'] = this.marktownToHTML(c['label']).replace(/^<p>(.*)<\/p>[\r\n]*$/, "$1");
        }
      }
    }

    // Save user choice changes
    // TODO: Should be a promise and error should be send back to interface
    if (!this.userChoiceSubject) {
      this.userChoiceSubject = new Subject<{UID; userChoice}>();
      this.userChoiceSubject
        .debounceTime(500)
        .subscribe(
          fullUserChoice => this.paragraphService.saveUserChoice(fullUserChoice),
          error => console.log(error)
        );
    }


  }

  // Is the paragraph closed (interface should then be disabled)
  isClosed(paragraph) {
    return paragraph.userCheckOK || (paragraph.userCheckCount >= paragraph.maxCheckCount)
  }

  // In case of chekbox, create the user choices as an array of selected items
  checkboxChanged(event) {
    // remove the value from the result
    var index = this.data.userChoice.indexOf(event.target.value, 0);
    if (index > -1) {
      this.data.userChoice.splice(index, 1);
    }

    // add it if needed
    if (event.target.checked) {
      this.data.userChoice.push(event.target.value);
    }

    this.saveUserChoice();

  }

  // save the user choices
  saveUserChoice() {
    this.userChoiceSubject.next({
      UID: this.data.id,
      userChoice: this.data.userChoice
    });
  }

  // check user choice
  checkUserChoice() {
    // Send this to the backend
    this.paragraphService
      .checkUserChoice({
        UID: this.data.id,
        userChoice: this.data.userChoice
      })
      .then(modifiedParagraph => {
        // Update the paragraph
        this.data = modifiedParagraph;
        this.ngOnInit();
        console.log(this.data);
      });

  }

}
