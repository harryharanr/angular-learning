import { Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import IClip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';
import { ClipsService } from '../../services/clips.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip:IClip | null = null;
  @Output() update = new EventEmitter();

  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';

  clipId = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  });

  constructor(private modal: ModalService, private clipsService: ClipsService) { }

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy() {
    this.modal.unregister('editClip');
  }

  ngOnChanges() {
    if(!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;

    this.clipId.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if(!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipsService.updateClip(this.clipId.value, this.title.value);
    } catch(error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Please try again later. ';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }

}
