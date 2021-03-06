import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  public token: string;
  public email: string;
  public form: FormGroup;
  public credentials = {login: '', password: ''};
  public loading = false;
  public error = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private toast: ToastService,
              private formBuilder: FormBuilder,
              private userService: UserService) {}

  ngOnInit() {
  	this.route.params.subscribe(params => {
  		this.token = params['token'];
  		if(this.route.snapshot.queryParams["email"]){
        this.email = this.route.snapshot.queryParams["email"];
      }
  		if(this.token) {
			  this.form = this.formBuilder.group({
			    login: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$') ]],
			    password: ['', [ Validators.required, Validators.pattern('^[a-zA-Z0-9]*$') ]]
			  });
  		} else {
  			this.router.navigate(['home']);
  			this.toast.error('Invalid verification link');
  		}
  	});
  }

  public login() {
    this.loading = true;
    this.error = false;

    this.auth.authenticate(this.credentials, true, () => {
        this.auth.current_user.subscribe(
          user => {
            this.verify(user, this.token);
          });
      },
      () => {
        this.error = true,
        this.loading = false
      });
  }

  public verify(user: User, token: string) {
  	if(user.verified) {
      if(this.email){
        if(token === user.token){
          this.changeEmail(user);
        } else {
          this.auth.logout();
          this.router.navigate(['home']);
          this.toast.error('Invalid link');
        }
      } else {
        this.toast.info('Already verified');
      }
	  } else {
  		const isVerified = token === user.token;
      const isActive = this.diffDays(new Date(), new Date(user.regDate.toString())) < 1;
	  	if(isVerified && isActive) {
	  		user.verified = isVerified;
	  		this.userService.updateUser(user).subscribe(response =>{
		  		this.router.navigate(['home']);
		  		this.toast.success('Your account verified');
	  		}, error => {
	  			this.toast.error('Some error occured');
	  		});
	  	} else {
        if (!isActive) {
          this.userService.deleteUser(user.id);
        }
        this.auth.logout();
	  		this.router.navigate(['hello']);
	  		this.toast.error('Invalid verification link');
	  	}
	  }
  }

  private changeEmail(user: User){
    user.email = this.email;
    this.userService.updateUser(user).subscribe(response =>{
      this.router.navigate(['home']);
      this.toast.success('Your email successfully changed');
    }, error => {
      this.toast.error('Some error occured');
    });
  }

  private diffDays(date1: Date, date2: Date) {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);
  }

}
