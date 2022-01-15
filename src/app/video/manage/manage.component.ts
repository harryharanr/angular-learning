import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ClipsService } from '../../services/clips.service';
import IClip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(private router: Router, private route: ActivatedRoute,
        private clipsService: ClipsService, private modal: ModalService) { 
      this.sort$  = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipsService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];
      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data() 
        });
      })
    });
  }

  sort($event: Event) {
    const { value } = ($event.target as HTMLSelectElement);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  update($event: IClip) {
    this.clips.forEach((clip, index) => {
      if(clip.docID === $event.docID) {
        this.clips[index].title = $event.title;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipsService.deleteClip(clip);

    this.clips.forEach((element, index) => {
      if(element.docID === clip.docID) {
        this.clips.splice(index, 1);
      }
    });
  }
}
