import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { JQueryStatic } from 'jquery';

import { Event } from '../../model/event'
import {User} from "../../model/user";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../services/auth.service";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-createEvent',
  templateUrl: './createEvent.component.html',
  styleUrls: ['./createEvent.component.css']
})
export class CreateEventComponent {

  private event : Event = new Event();

  //form: FormGroup;

  constructor(private auth : AuthService,
              private eventService: EventService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.auth.getUser().subscribe((data: any) => {this.event.creator = data});
    console.log(this.event.creator);
    // this.form = this.formBuilder.group({
    //   eventName: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$') ]],
    //   description: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9]*$') ]],
    //   place: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9]*$') ]],
    //   //timeLineStart: ['', [ Validators.required, Validators.pattern('[0-9].:') ]],
    //   //timeLineFinish: ['', [ Validators.required, Validators.pattern('[0-9].:') ]],
    // });
  }

  create() {
    // TODO: Handle create error
    this.event.isSent = false;
    this.eventService.createEvent(this.event);
  }

  publish() {
    // TODO: Handle create error
    this.event.isSent = true;
    this.eventService.createEvent(this.event);
  }

}
