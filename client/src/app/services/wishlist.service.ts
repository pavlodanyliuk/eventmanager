import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Item} from '../model/item';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Event} from "../model/event";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {WishList} from "../model/wishlist";
import {AuthService} from "./auth.service";
import {User} from "../model/user";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class WishListService {

  headers: HttpHeaders;
  private base_url = '/wishlist';
  private subject=new Subject<Item>();
  private subItemArr = new BehaviorSubject<Item[]>([]);
  private curentWishList: WishList = new WishList();
  private items: Item[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.getUser().subscribe(
      (user: User) =>
    {
      this.getWishListByUser(user.id).subscribe(
        (wishList: WishList) =>
        {
          this.curentWishList = wishList
        }
      );
    }
    );
  }

  sendViewingItem(viewingItem: Item):void{
    this.subject.next(viewingItem);
  }

  hideViewingItem(){
    this.subject.next(new Item());
  }

  getViewingItem(): Observable<Item> {
    return this.subject.asObservable()
  }

  getItemsFromWishList( wishListId: number ) : Observable<Item[]> {
    console.log("im here " + wishListId)
    this.http.get<Item[]>(this.base_url + "/" + wishListId).subscribe( (items : Item[]) => {
      this.items = items;
      this.subItemArr.next(this.items);
    });

    return this.subItemArr.asObservable();

  }

  addItemIntoArr(item: Item) : void {
    this.items.push(item);
    this.subItemArr.next(this.items);
  }

  getWishListByUser ( userId: number) : Observable<WishList> {
    return this.http.get<WishList>(this.base_url + "/user/" + userId);
  }

  getCurrentWishListId(): number{
    return this.curentWishList.id;
  }

}