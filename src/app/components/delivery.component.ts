import { Component, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryOrder } from '../models';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  form!:FormGroup
  itemArray!:FormArray

  @Output()
  onNewDeliveryOrder = new Subject<DeliveryOrder>

  constructor(public fb:FormBuilder) {
  }

  ngOnInit():void {
    //this method is called when the component is created for initialization
    this.form = this.createForm()
  }

  private createForm(): FormGroup {
    this.itemArray = this.fb.array([])
    return this.fb.group({
      name: this.fb.control<string>('',[Validators.required,Validators.minLength(3)]),
      address: this.fb.control<string>('',[Validators.required]),
      email: this.fb.control<string>('',[Validators.required,Validators.email]),
      session: this.fb.control<string>('',[Validators.required]),
      insurance: this.fb.control<boolean>(false),
      priority: this.fb.control<boolean>(false),
      deliveryDate: this.fb.control<string>('',[Validators.required]),
      comments: this.fb.control<string>(''),
      items: this.itemArray
    })
  }

  processDelivery() {
    const delivery = this.form.value as DeliveryOrder
    console.info(">>> delivery: ",delivery)
    this.onNewDeliveryOrder.next(delivery)
    this.form.reset()
  }

  hasError(cn:string):boolean {
    return !!(this.form.get(cn)?.invalid && this.form.get(cn)?.dirty)
  }

  isFormInvalid():boolean {
    const dd = this.form.get('deliveryDate')?.value
    if (!dd){
      return true
    }
    const deliveryDate = new Date(dd)
    const today = new Date()
    return this.form.invalid && (deliveryDate<today)
  }

  private createOrderItem():FormGroup {
    return this.fb.group({
      item:this.fb.control<string>('',[Validators.required]),
      quantity:this.fb.control<number>(1,[Validators.required,Validators.min(1)])
    })
  }

  addItem() {
    const orderItem = this.createOrderItem()
    this.itemArray.push(orderItem)
  }

  deleteItem(idx:number) {
    this.itemArray.removeAt(idx)
  }

}
