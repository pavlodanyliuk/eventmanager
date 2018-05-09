import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../services/wishlist.service';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { JQueryStatic } from 'jquery';

import { Event } from '../../model/event'
import {Item} from '../../model/item';
import {Subscription} from 'rxjs/Subscription';
import {LikeService} from "../../services/like.service";
import {ItemService} from "../../services/item.service";
import {WishList} from "../../model/wishlist";
import {AuthService} from "../../services/auth.service";
import {User} from "../../model/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-wish-list',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishListComponent implements OnInit {

  wishList: WishList;
  title = 'Your Wish Board!';
  items: Item[] = [];
  subscription: Subscription;
  isOwn: boolean = false;
  user: User = new User();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private wishListService: WishListService,
              private likeService: LikeService,
              private itemService: ItemService,
              private auth: AuthService,
              private userService: UserService
              ) {

  }

  ngOnInit() {

    if (this.router.url == '/wishlist') this.isOwn = true;

    if (this.isOwn) {
      this.auth.getUser().subscribe((user: User) => {
        this.initWishList(user.id);
      });
    } else {

      this.route.params.subscribe(params => {
        const id = params['id'];

        if (id) {
          this.userService.getUserById(id).subscribe((user: User) => {
            if (user) {
              this.user = user;
              this.initWishList(user.id)
            } else {
              console.log(`User with id '${id}' not found!`);
            }
          });
        }


      });

    }

  }

  initWishList(userId: number): void{
    this.wishListService.getWishListByUser(userId).subscribe(


      ( wishList: WishList ) => {
        if (wishList != null) {
          this.wishList = wishList;
          console.log(this.wishList);

          //TODO: CHANGE!!!
          this.wishListService.getItemsFromWishList(this.wishList.id)
            .subscribe((items: any) => {
              this.items = items;
            });

          for (let item of this.items) {
            this.likeService.wasLiked(item.id).subscribe((hasLike: boolean) => {
              item.hasLiked = hasLike;
            });

          }
          this.subscription = this.wishListService.getViewingItem().subscribe(item => {});
          //TODO:END!!!

        }
      }

    )
  }

  create() {
  }

  sendViewingItem(item: Item){
    this.itemService.getItem(item.id).subscribe( (fullItem: Item) => {
      console.log(fullItem);
      this.wishListService.sendViewingItem(fullItem)
    } );
  }

  hideViewingItem(){
    this.wishListService.hideViewingItem()
  }

  clickOnLikeButt(item: Item){
    this.likeService.addLike(item);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isOwnBoard(): boolean {
    return this.isOwn;
  }


}
